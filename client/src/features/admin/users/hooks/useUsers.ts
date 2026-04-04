import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';
import type { ApiResponse, PaginatedResponse } from '@shared/types/api.type';
import type { User } from '@shared/schemas/user.schema';

interface GetUsersOptions {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: string;
}

function normalizeRole(role: unknown): string {
  if (typeof role === 'string') {
    return role.replace(/^ROLE_/, '');
  }

  if (role && typeof role === 'object') {
    const roleName = (role as { name?: unknown }).name;
    if (typeof roleName === 'string') {
      return roleName.replace(/^ROLE_/, '');
    }
  }

  return '';
}

function normalizeUser(raw: unknown): User {
  const u = (raw ?? {}) as Record<string, unknown>;
  return {
    id: (u.id as string | number | undefined) ?? (u._id as string | undefined),
    _id: (u._id as string | undefined) ?? (typeof u.id !== 'undefined' ? String(u.id) : undefined),
    email: (u.email as string | undefined) ?? '',
    fullName: (u.fullName as string | undefined) ?? '',
    phone: (u.phone as string | undefined) ?? '',
    role: normalizeRole(u.role),
    isActive: typeof u.isActive === 'boolean' ? u.isActive : true,
    avatar: (u.avatar as string | undefined) ?? undefined,
  };
}

/**
 * Hook: Lấy danh sách user với filter, search, pagination
 */
export const useUsers = (options?: GetUsersOptions) => {
  return useQuery({
    queryKey: ['users', options],
    queryFn: async () => {
      const page = Math.max(0, (options?.page ?? 1) - 1);
      const size = options?.limit ?? 10;

      let raw: any;
      if (options?.search) {
        raw = await apiClient.get('/users/search', {
          params: { q: options.search, page, size },
        });
      } else if (options?.role) {
        raw = await apiClient.get(`/users/role/${options.role}`, {
          params: { page, size },
        });
      } else {
        raw = await apiClient.get('/users', {
          params: { page, size },
        });
      }

      const content = Array.isArray(raw?.content)
        ? raw.content.map((item: unknown) => normalizeUser(item))
        : [];
      return {
        success: true,
        message: '',
        data: {
          data: content,
          pagination: {
            totalItems: Number(raw?.totalElements ?? content.length),
            totalPages: Number(raw?.totalPages ?? 1),
            currentPage: Number(raw?.number ?? 0) + 1,
            itemsPerPage: Number(raw?.size ?? size),
          },
        },
      } as ApiResponse<PaginatedResponse<User>>;
    },
  });
};

/**
 * Hook: Lấy thông tin user by id
 */
export const useUserById = (id?: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
      const rawUser = (response as any)?.data ?? response;
      return normalizeUser(rawUser);
    },
    enabled: !!id,
  });
};

/**
 * Hook: Tạo user mới
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await apiClient.post<ApiResponse<User>>('/users', {
        ...data,
        role: normalizeRole(data.role),
      });
      const rawUser = (response as any)?.data ?? response;
      return normalizeUser(rawUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

/**
 * Hook: Cập nhật user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      const response = await apiClient.put<ApiResponse<User>>(
        `/users/${id}`,
        {
          ...data,
          ...(typeof data.role !== 'undefined'
            ? { role: normalizeRole(data.role) }
            : {}),
        },
      );
      const rawUser = (response as any)?.data ?? response;
      return normalizeUser(rawUser);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
};
