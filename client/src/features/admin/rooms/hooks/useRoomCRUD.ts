import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';
import type { ApiResponse } from '@shared/types/api.type';

export type AdminCinemaOption = {
  id: number;
  name: string;
  city?: string;
};

export type AdminRoomRow = {
  id: number;
  name: string;
  cinemaId: number;
  cinemaName: string;
  totalSeats: number;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminRoomDetail = AdminRoomRow;

type CreateRoomInput = {
  cinemaId: number;
  name: string;
};

type UpdateRoomInput = {
  name?: string;
};

type RoomFilter = {
  page: number;
  limit: number;
  cinemaId?: string | number;
};

type RoomsListPayload = {
  data: AdminRoomRow[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

type BackendRoom = {
  id: number;
  cinemaId: number;
  cinemaName?: string;
  name: string;
  totalSeats?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

type BackendPage<T> = {
  content?: T[];
  number?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
};

function mapRoom(room: BackendRoom): AdminRoomRow {
  return {
    id: room.id,
    name: room.name,
    cinemaId: room.cinemaId,
    cinemaName: room.cinemaName ?? '-',
    totalSeats: room.totalSeats ?? 0,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
  };
}

export function useAdminCinemasForRooms() {
  return useQuery({
    queryKey: ['admin-cinemas-for-rooms'],
    queryFn: async (): Promise<AdminCinemaOption[]> => {
      const res = (await apiClient.get('/cinemas', {
        params: { limit: 100, page: 0 },
      })) as
        | BackendPage<{ id?: number; _id?: string; name: string; city?: string }>
        | ApiResponse<
            | BackendPage<{ id?: number; _id?: string; name: string; city?: string }>
            | Array<{ id?: number; _id?: string; name: string; city?: string }>
          >;

      const payload = (res as ApiResponse<unknown>)?.data ?? res;
      const list = Array.isArray(payload)
        ? payload
        : ((payload as BackendPage<{ id?: number; _id?: string; name: string; city?: string }>)?.content ?? []);

      return list
        .map((c) => ({
          id: c.id ?? Number(c._id),
          name: c.name,
          city: c.city,
        }))
        .filter((c) => Number.isFinite(c.id));
    },
  });
}

export function useAdminRooms(filter: Partial<RoomFilter>) {
  const hasCinemaId = filter.cinemaId !== undefined && filter.cinemaId !== null && filter.cinemaId !== '';

  return useQuery({
    queryKey: ['admin-rooms', filter],
    queryFn: async (): Promise<RoomsListPayload> => {
      const res = (await apiClient.get('/rooms', {
        params: {
          page: (filter.page ?? 1) - 1,
          limit: filter.limit ?? 10,
          ...(hasCinemaId ? { cinemaId: filter.cinemaId } : {}),
        },
      })) as ApiResponse<BackendPage<BackendRoom>>;

      const pageData = res.data ?? {};
      return {
        data: (pageData.content ?? []).map(mapRoom),
        pagination: {
          page: (pageData.number ?? 0) + 1,
          limit: pageData.size ?? filter.limit ?? 10,
          totalItems: pageData.totalElements ?? 0,
          totalPages: pageData.totalPages ?? 1,
        },
      };
    },
    enabled: hasCinemaId,
  });
}

export function useAdminRoomById(id: string | number | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ['admin-room', id],
    queryFn: async (): Promise<AdminRoomDetail> => {
      const res = (await apiClient.get(`/rooms/${id}`)) as ApiResponse<BackendRoom>;
      return mapRoom(res.data);
    },
    enabled: enabled && !!id,
  });
}

export function useCreateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateRoomInput) => {
      return apiClient.post<ApiResponse<AdminRoomRow>>('/rooms', body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-rooms'] });
    },
  });
}

export function useUpdateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number | string; body: UpdateRoomInput }) => {
      return apiClient.patch(`/rooms/${id}`, body);
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin-rooms'] });
      qc.invalidateQueries({ queryKey: ['admin-room', id] });
    },
  });
}

export function useDeleteRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number | string) => apiClient.delete(`/rooms/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-rooms'] });
    },
  });
}

