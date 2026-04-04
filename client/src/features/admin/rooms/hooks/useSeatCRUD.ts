import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';
import type { ApiResponse } from '@shared/types/api.type';

// Types
export type SeatType = 'NORMAL' | 'VIP' | 'SWEETBOX';

export type SeatDto = {
  id: number;
  rowSymbol: string;
  seatNumber: number;
  type: SeatType;
};

export type CreateSeatInput = {
  roomId: number;
  rowSymbol: string;
  seatNumber: number;
  type: SeatType;
};

export type UpdateSeatInput = {
  type: SeatType;
};

export type BulkCreateSeatsInput = {
  roomId: number;
  rowSymbol: string;
  startSeatNumber: number;
  endSeatNumber: number;
  type: SeatType;
};

export type SeatLayoutStats = {
  totalSeats: number;
  normalSeats: number;
  vipSeats: number;
  sweetboxSeats: number;
};

export type SeatMapLayoutDto = {
  roomId: number;
  roomName: string;
  rowSymbols: string[];
  maxSeatNumberPerRow: number;
  seats: SeatDto[];
  stats: SeatLayoutStats;
};

type SeatsListPayload = {
  content: SeatDto[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

// Hooks
export function useSeatsByRoom(roomId: number | null, page: number = 0, limit: number = 50) {
  return useQuery({
    queryKey: ['seats', roomId, page, limit],
    queryFn: async (): Promise<{ seats: SeatDto[]; pagination: any }> => {
      const res = (await apiClient.get('/admin/seats', {
        params: { roomId, page, size: limit },
      })) as ApiResponse<SeatsListPayload>;

      const pageData = res.data ?? {};
      return {
        seats: (pageData.content ?? []),
        pagination: {
          page: (pageData.number ?? 0) + 1,
          limit: pageData.size ?? limit,
          totalItems: pageData.totalElements ?? 0,
          totalPages: pageData.totalPages ?? 1,
        },
      };
    },
    enabled: !!roomId,
  });
}

export function useSeatMapLayout(roomId: number | null) {
  return useQuery({
    queryKey: ['seat-layout', roomId],
    queryFn: async (): Promise<SeatMapLayoutDto> => {
      const res = (await apiClient.get(`/admin/seats/layout/${roomId}`)) as ApiResponse<SeatMapLayoutDto>;
      return res.data;
    },
    enabled: !!roomId,
  });
}

export function useCreateSeat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateSeatInput) => {
      return apiClient.post('/admin/seats', body);
    },
    onSuccess: (_, { roomId }) => {
      qc.invalidateQueries({ queryKey: ['seats', roomId] });
      qc.invalidateQueries({ queryKey: ['seat-layout', roomId] });
    },
  });
}

export function useBulkCreateSeats() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: BulkCreateSeatsInput) => {
      return apiClient.post('/admin/seats/bulk', body);
    },
    onSuccess: (_, { roomId }) => {
      qc.invalidateQueries({ queryKey: ['seats', roomId] });
      qc.invalidateQueries({ queryKey: ['seat-layout', roomId] });
    },
  });
}

export function useUpdateSeat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ seatId, body }: { seatId: number; body: UpdateSeatInput }) => {
      return apiClient.patch(`/admin/seats/${seatId}`, body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['seats'] });
      qc.invalidateQueries({ queryKey: ['seat-layout'] });
    },
  });
}

export function useDeleteSeat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (seatId: number) => {
      return apiClient.delete(`/admin/seats/${seatId}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['seats'] });
      qc.invalidateQueries({ queryKey: ['seat-layout'] });
    },
  });
}

export function useDeleteAllSeatsInRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (roomId: number) => {
      return apiClient.delete(`/admin/seats/room/${roomId}`);
    },
    onSuccess: (_, roomId) => {
      qc.invalidateQueries({ queryKey: ['seats', roomId] });
      qc.invalidateQueries({ queryKey: ['seat-layout', roomId] });
    },
  });
}

