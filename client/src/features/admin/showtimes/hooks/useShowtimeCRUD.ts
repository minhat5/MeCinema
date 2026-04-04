import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import apiClient from '../../../../lib/api-client';
import type { ApiResponse, PaginatedResponse } from '@shared/types/api.type';

export interface ShowtimeRelatedEntity {
  _id: string;
  name?: string;
  title?: string;
  city?: string;
}

export interface ShowtimeItem {
  _id: string;
  movieId: string;
  movieTitle: string;
  cinemaId: string;
  cinemaName: string;
  roomId: string;
  roomName: string;
  startTime: string;
  endTime: string;
  basePrice: number;
}

export interface CreateShowtimePayload {
  movieId: string;
  roomId: string;
  startTime: string;
  endTime: string;
  basePrice: number;
}

export interface UpdateShowtimePayload {
  startTime: string;
  endTime: string;
  basePrice: number;
}

interface ShowtimeQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

const mapEntity = (raw: any): ShowtimeRelatedEntity => ({
  _id: String(raw?.id ?? raw?._id ?? ''),
  name: raw?.name,
  title: raw?.title,
  city: raw?.city,
});

const mapShowtime = (raw: any): ShowtimeItem => ({
  _id: String(raw?.id ?? raw?._id ?? ''),
  movieId: String(raw?.movieId ?? ''),
  movieTitle: raw?.movieTitle ?? '',
  cinemaId: String(raw?.cinemaId ?? ''),
  cinemaName: raw?.cinemaName ?? '',
  roomId: String(raw?.roomId ?? ''),
  roomName: raw?.roomName ?? '',
  startTime: raw?.startTime ?? '',
  endTime: raw?.endTime ?? '',
  basePrice: Number(raw?.basePrice ?? 0),
});

const normalizePaginated = (raw: any, fallbackLimit: number): ApiResponse<PaginatedResponse<ShowtimeItem>> => {
  const pageRaw = raw?.data ?? raw ?? {};
  const listRaw = pageRaw?.content ?? [];
  const data = Array.isArray(listRaw) ? listRaw.map(mapShowtime) : [];

  const totalItems = Number(pageRaw?.totalElements ?? data.length);
  const currentPage = Number(pageRaw?.pageNumber ?? 0) + 1;
  const itemsPerPage = Number(pageRaw?.pageSize ?? fallbackLimit);
  const totalPages = Number(pageRaw?.totalPages ?? Math.max(1, Math.ceil(totalItems / itemsPerPage)));

  return {
    success: true,
    message: raw?.message,
    data: {
      data,
      pagination: {
        totalItems,
        currentPage,
        itemsPerPage,
        totalPages,
      },
    },
  };
};

const normalizeSelectList = (raw: any): ShowtimeRelatedEntity[] => {
  const listRaw = raw?.data?.content ?? raw?.content ?? raw?.data ?? raw ?? [];
  return Array.isArray(listRaw) ? listRaw.map(mapEntity) : [];
};

const getErrorMessage = (error: unknown, fallback: string) =>
  (error as Error)?.message || fallback;

const toApiDateTime = (value: string) => {
  const parsed = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(parsed.getTime())) return value;
  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, '0');
  const d = String(parsed.getDate()).padStart(2, '0');
  const hh = String(parsed.getHours()).padStart(2, '0');
  const mm = String(parsed.getMinutes()).padStart(2, '0');
  const ss = String(parsed.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
};

const getShowtimes = async (params?: ShowtimeQueryParams) => {
  const page = Math.max(0, (params?.page ?? 1) - 1);
  const limit = params?.limit ?? 15;

  const response = await apiClient.get('/showtimes', {
    params: {
      ...params,
      page,
      size: limit,
      sortDirection: params?.sortDirection ?? 'desc',
    },
  });

  return normalizePaginated(response, limit);
};

const getMoviesForSelect = async () => {
  const response = await apiClient.get('/movies', {
    params: { page: 0, size: 200 },
  });
  return normalizeSelectList(response);
};

const getCinemasForSelect = async () => {
  const size = 200;
  let page = 0;
  let totalPages = 1;
  const cinemas: ShowtimeRelatedEntity[] = [];

  do {
    const response = await apiClient.get('/cinemas', {
      params: { page, size },
    });

    cinemas.push(...normalizeSelectList(response));

    const pageRaw = (response as any)?.data ?? response;
    const serverTotalPages = Number(pageRaw?.totalPages ?? 1);
    totalPages =
      Number.isFinite(serverTotalPages) && serverTotalPages > 0
        ? serverTotalPages
        : 1;
    page += 1;
  } while (page < totalPages);

  const uniqueMap = new Map<string, ShowtimeRelatedEntity>();
  cinemas.forEach((cinema) => {
    if (!cinema._id || uniqueMap.has(cinema._id)) return;
    uniqueMap.set(cinema._id, cinema);
  });

  return Array.from(uniqueMap.values());
};

const getRoomsByCinema = async (cinemaId: string) => {
  const response = await apiClient.get('/rooms', {
    params: { cinemaId, page: 0, limit: 100 },
  });
  return normalizeSelectList(response).map((room) => ({
    _id: room._id,
    name: room.name,
  }));
};

const createShowtime = async (payload: CreateShowtimePayload) =>
  apiClient.post('/showtimes', {
    movieId: Number(payload.movieId),
    roomId: Number(payload.roomId),
    startTime: toApiDateTime(payload.startTime),
    endTime: toApiDateTime(payload.endTime),
    basePrice: payload.basePrice,
  });

const updateShowtime = async (id: string, payload: UpdateShowtimePayload) =>
  apiClient.put(`/showtimes/${id}`, {
    startTime: toApiDateTime(payload.startTime),
    endTime: toApiDateTime(payload.endTime),
    basePrice: payload.basePrice,
  });

const cancelShowtime = async (id: string) => apiClient.delete(`/showtimes/${id}`);

export const useShowtimes = (params?: ShowtimeQueryParams) =>
  useQuery({
    queryKey: ['admin-showtimes', params],
    queryFn: () => getShowtimes(params),
    staleTime: 60 * 1000,
  });

export const useMoviesSelect = () =>
  useQuery({
    queryKey: ['showtime-movies-select'],
    queryFn: getMoviesForSelect,
    staleTime: 5 * 60 * 1000,
  });

export const useCinemasSelect = () =>
  useQuery({
    queryKey: ['showtime-cinemas-select'],
    queryFn: getCinemasForSelect,
    staleTime: 5 * 60 * 1000,
  });

export const useRoomsByCinema = (cinemaId: string) =>
  useQuery({
    queryKey: ['showtime-rooms-by-cinema', cinemaId],
    queryFn: () => getRoomsByCinema(cinemaId),
    enabled: !!cinemaId,
    staleTime: 5 * 60 * 1000,
  });

export const useCreateShowtime = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createShowtime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-showtimes'] });
      notifications.show({
        title: 'Thành công',
        message: 'Tạo suất chiếu mới thành công',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Lỗi',
        message: getErrorMessage(error, 'Tạo suất chiếu thất bại'),
        color: 'red',
      });
    },
  });
};

export const useUpdateShowtime = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShowtimePayload }) => updateShowtime(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-showtimes'] });
      notifications.show({
        title: 'Thành công',
        message: 'Cập nhật suất chiếu thành công',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Lỗi',
        message: getErrorMessage(error, 'Cập nhật suất chiếu thất bại'),
        color: 'red',
      });
    },
  });
};

export const useCancelShowtime = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelShowtime(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-showtimes'] });
      notifications.show({
        title: 'Đã huỷ',
        message: 'Suất chiếu đã được huỷ',
        color: 'blue',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Lỗi',
        message: getErrorMessage(error, 'Huỷ suất chiếu thất bại'),
        color: 'red',
      });
    },
  });
};

