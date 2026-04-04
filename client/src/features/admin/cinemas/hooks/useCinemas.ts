import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export type Cinema = {
  id: string;
  name: string;
  address: string;
  hotline: string;
  createdAt: string;
  updatedAt: string;
};

type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

type CinemaListPayload = {
  data: Cinema[];
  pagination: PaginationMeta;
};

type ListOptions = {
  page?: number;
  limit?: number;
  search?: string;
};

type CreateCinemaPayload = {
  name: string;
  address: string;
  hotline: string;
};

type UpdateCinemaPayload = {
  id: string;
  name: string;
  address: string;
  hotline: string;
};

function normalizeCinema(raw: unknown): Cinema {
  const c = (raw ?? {}) as Record<string, unknown>;
  return {
    id: String(c.id ?? ''),
    name: String(c.name ?? ''),
    address: String(c.address ?? ''),
    hotline: String(c.hotline ?? ''),
    createdAt: String(c.createdAt ?? ''),
    updatedAt: String(c.updatedAt ?? ''),
  };
}

export function useAdminCinemas(options?: ListOptions) {
  return useQuery({
    queryKey: ['admin-cinemas', options],
    queryFn: async (): Promise<CinemaListPayload> => {
      const page = Math.max(0, (options?.page ?? 1) - 1);
      const size = options?.limit ?? 10;
      const search = options?.search?.trim();

      const raw = search
        ? await apiClient.get('/cinemas/search', { params: { q: search, page, size } })
        : await apiClient.get('/cinemas', { params: { page, size } });

      const content = Array.isArray((raw as any)?.data?.content) 
        ? (raw as any).data.content 
        : Array.isArray((raw as any)?.content)
        ? (raw as any).content
        : [];
      
      const data = content.map((item: unknown) => normalizeCinema(item));

      return {
        data,
        pagination: {
          currentPage: Number((raw as any)?.data?.number ?? (raw as any)?.number ?? 0) + 1,
          totalPages: Number((raw as any)?.data?.totalPages ?? (raw as any)?.totalPages ?? 1),
          totalItems: Number((raw as any)?.data?.totalElements ?? (raw as any)?.totalElements ?? data.length),
          itemsPerPage: Number((raw as any)?.data?.size ?? (raw as any)?.size ?? size),
        },
      };
    },
  });
}

export function useCreateCinema() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateCinemaPayload) => {
      return apiClient.post('/cinemas', {
        name: payload.name.trim(),
        address: payload.address.trim(),
        hotline: payload.hotline.trim(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cinemas'] });
    },
  });
}

export function useUpdateCinema() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateCinemaPayload) => {
      return apiClient.put(`/cinemas/${payload.id}`, {
        name: payload.name.trim(),
        address: payload.address.trim(),
        hotline: payload.hotline.trim(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cinemas'] });
    },
  });
}

export function useDeleteCinema() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/cinemas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cinemas'] });
    },
  });
}

