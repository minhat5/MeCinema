import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export type AdminGenre = {
  id: string;
  name: string;
};

type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

type GenreListPayload = {
  data: AdminGenre[];
  pagination: PaginationMeta;
};

type ListOptions = {
  page?: number;
  limit?: number;
  search?: string;
};

function normalizeGenre(raw: unknown): AdminGenre {
  const g = (raw ?? {}) as Record<string, unknown>;
  return {
    id: String(g.id ?? g._id ?? ''),
    name: String(g.name ?? ''),
  };
}

export function useAdminGenres(options?: ListOptions) {
  return useQuery({
    queryKey: ['admin-genres', options],
    queryFn: async (): Promise<GenreListPayload> => {
      const page = Math.max(0, (options?.page ?? 1) - 1);
      const size = options?.limit ?? 10;
      const search = options?.search?.trim();

      const raw = search
        ? await apiClient.get('/genres/search', { params: { q: search, page, size } })
        : await apiClient.get('/genres', { params: { page, size } });

      const content = Array.isArray((raw as any)?.content) ? (raw as any).content : [];
      const data = content.map((item: unknown) => normalizeGenre(item));

      return {
        data,
        pagination: {
          currentPage: Number((raw as any)?.number ?? 0) + 1,
          totalPages: Number((raw as any)?.totalPages ?? 1),
          totalItems: Number((raw as any)?.totalElements ?? data.length),
          itemsPerPage: Number((raw as any)?.size ?? size),
        },
      };
    },
  });
}

export function useCreateGenre() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string }) => {
      return apiClient.post('/genres', { name: payload.name.trim() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-genres'] });
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
  });
}

export function useUpdateGenre() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; name: string }) => {
      return apiClient.put(`/genres/${payload.id}`, { name: payload.name.trim() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-genres'] });
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
  });
}

export function useDeleteGenre() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/genres/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-genres'] });
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
  });
}

