import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';
import type { ApiResponse } from '@shared/types/api.type';
import type {
  CreateComboInput,
  CreateProductInput,
  PatchProductInput,
} from '@shared/schemas/food.schema';

type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

const FOOD_TYPE_MAP: Record<string, 'COMBO' | 'FOOD' | 'DRINK'> = {
  COMBO: 'COMBO',
  POPCORN: 'FOOD',
  FOOD: 'FOOD',
  OTHER: 'FOOD',
  DRINK: 'DRINK',
};

function normalizeFoodCategory(raw: unknown): 'COMBO' | 'FOOD' | 'DRINK' {
  if (typeof raw === 'string') {
    const normalized = raw.trim().toUpperCase();
    return FOOD_TYPE_MAP[normalized] ?? 'FOOD';
  }

  if (raw && typeof raw === 'object') {
    const name = (raw as { name?: unknown }).name;
    if (typeof name === 'string') {
      const normalized = name.trim().toUpperCase();
      return FOOD_TYPE_MAP[normalized] ?? 'FOOD';
    }
  }

  return 'FOOD';
}

export type AdminProductRow = {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  isActive: boolean;
  comboItems?: { productId: string; quantity: number }[];
  discountPercent?: number | null;
  createdAt: string;
  updatedAt: string;
};

type ProductsListPayload = {
  data: AdminProductRow[];
  pagination: PaginationMeta;
};

export type ComboItemPopulated = {
  productId: {
    _id: string;
    name: string;
    price: number;
    category: string;
    image?: string;
  };
  quantity: number;
};

export type AdminProductDetail = AdminProductRow & {
  comboItems?: ComboItemPopulated[];
};

const toAdminProduct = (item: any): AdminProductRow => {
  const category = normalizeFoodCategory(
    item?.type ?? item?.category ?? item?.foodType,
  );
  return {
    _id: String(item?.id ?? item?._id ?? ''),
    name: item?.name ?? '',
    price: Number(item?.price ?? 0),
    image: item?.imageUrl ?? item?.image ?? '',
    category,
    description: item?.description ?? '',
    isActive: item?.isActive !== false,
    comboItems: Array.isArray(item?.comboItems) ? item.comboItems : [],
    discountPercent: item?.discountPercent ?? null,
    createdAt: item?.createdAt ?? '',
    updatedAt: item?.updatedAt ?? '',
  };
};

const toAdminProductDetail = (item: any): AdminProductDetail => {
  const base = toAdminProduct(item);
  const comboItems = Array.isArray(item?.comboItems)
    ? item.comboItems.map((ci: any) => ({
        productId:
          ci?.productId && typeof ci.productId === 'object'
            ? {
                _id: String(ci.productId?.id ?? ci.productId?._id ?? ''),
                name: ci.productId?.name ?? '',
                price: Number(ci.productId?.price ?? 0),
                category: normalizeFoodCategory(
                  ci.productId?.type ?? ci.productId?.category ?? ci.productId?.foodType,
                ),
                image: ci.productId?.image ?? ci.productId?.imageUrl,
              }
            : {
                _id: String(ci?.productId ?? ''),
                name: '',
                price: 0,
                category: '',
              },
        quantity: Number(ci?.quantity ?? 1),
      }))
    : undefined;

  return {
    ...base,
    comboItems,
  };
};

export function useAdminProducts(
  filter: {
    page: number;
    limit: number;
    category?: string;
    kind?: 'retail' | 'combo' | 'all';
  },
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['admin-food-products', filter],
    queryFn: async (): Promise<ProductsListPayload> => {
      const fetchSize = 200;
      let pageIndex = 0;
      let totalPages = 1;
      const allProducts: AdminProductRow[] = [];

      do {
        const raw = await apiClient.get('/foods', {
          params: {
            page: pageIndex,
            size: fetchSize,
          },
        });

        const content = Array.isArray((raw as any)?.content)
          ? (raw as any).content
          : [];
        allProducts.push(...content.map(toAdminProduct));

        const serverTotalPages = Number((raw as any)?.totalPages ?? 1);
        totalPages =
          Number.isFinite(serverTotalPages) && serverTotalPages > 0
            ? serverTotalPages
            : 1;
        pageIndex += 1;
      } while (pageIndex < totalPages);

      let filtered = allProducts;

      if (filter.kind === 'combo') {
        filtered = filtered.filter((p) => p.category === 'COMBO');
      }
      if (filter.kind === 'retail') {
        filtered = filtered.filter((p) => p.category !== 'COMBO');
      }
      if (filter.category) {
        filtered = filtered.filter((p) => p.category === filter.category);
      }

      const totalItems = filtered.length;
      const totalPagesAfterFilter = Math.max(1, Math.ceil(totalItems / filter.limit));
      const currentPage = Math.min(Math.max(1, filter.page), totalPagesAfterFilter);
      const start = (currentPage - 1) * filter.limit;
      const data = filtered.slice(start, start + filter.limit);

      return {
        data,
        pagination: {
          page: currentPage,
          limit: filter.limit,
          totalItems,
          totalPages: totalPagesAfterFilter,
        },
      };
    },
    enabled: options?.enabled ?? true,
  });
}

export function useProductById(id: string | undefined, enabled: boolean) {
  const pid = id ? String(id).trim() : '';
  return useQuery({
    queryKey: ['admin-food-product', pid],
    queryFn: async (): Promise<AdminProductDetail> => {
      const res = await apiClient.get(`/foods/${pid}`);
      return toAdminProductDetail(res);
    },
    enabled: enabled && !!pid,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateProductInput) => {
      return apiClient.post<ApiResponse<AdminProductRow>>('/foods', {
        name: body.name,
        description: body.description,
        price: body.price,
        imageUrl: body.image,
        type: FOOD_TYPE_MAP[body.category] ?? 'FOOD',
        isActive: true,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-food-products'] });
    },
  });
}

export function useCreateCombo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateComboInput) => {
      return apiClient.post<ApiResponse<AdminProductDetail>>('/foods', {
        name: body.name,
        description: body.description,
        price: body.price,
        imageUrl: body.image,
        type: 'COMBO',
        isActive: true,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-food-products'] });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: PatchProductInput;
    }) => {
      const pid = String(id).trim();
      return apiClient.put(`/foods/${pid}`, {
        name: body.name,
        description: body.description,
        price: body.price,
        imageUrl: body.image,
        type:
          body.category != null
            ? FOOD_TYPE_MAP[String(body.category)] ?? 'FOOD'
            : body.comboItems
              ? 'COMBO'
              : undefined,
        isActive: body.isActive,
      });
    },
    onSuccess: (_, { id }) => {
      const pid = String(id).trim();
      qc.invalidateQueries({ queryKey: ['admin-food-products'] });
      qc.invalidateQueries({ queryKey: ['admin-food-product', pid] });
    },
  });
}

/** Ẩn sản phẩm — PUT { isActive: false } (tránh PATCH/DELETE bị proxy chặn). */
export function useDeactivateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const pid = String(id).trim();
      const current = await apiClient.get(`/foods/${pid}`);
      return apiClient.put(`/foods/${pid}`, {
        ...(current as any),
        isActive: false,
      });
    },
    onSuccess: (_, id) => {
      const pid = String(id).trim();
      qc.invalidateQueries({ queryKey: ['admin-food-products'] });
      qc.invalidateQueries({ queryKey: ['admin-food-product', pid] });
    },
  });
}