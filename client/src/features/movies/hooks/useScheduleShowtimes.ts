import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/api-client';
import type { ApiResponse, PaginatedResponse } from '@shared/types/api.type';

export interface ScheduleShowtimeItem {
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

interface ScheduleShowtimeQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface ScheduleCinemaOption {
  _id: string;
  name: string;
}

const mapShowtime = (raw: any): ScheduleShowtimeItem => ({
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

const normalizePaginated = (
  raw: any,
  fallbackLimit: number,
): ApiResponse<PaginatedResponse<ScheduleShowtimeItem>> => {
  const pageRaw = raw?.data ?? raw ?? {};
  const listRaw = pageRaw?.content ?? [];
  const data = Array.isArray(listRaw) ? listRaw.map(mapShowtime) : [];

  const totalItems = Number(pageRaw?.totalElements ?? data.length);
  const currentPage = Number(pageRaw?.pageNumber ?? 0) + 1;
  const itemsPerPage = Number(pageRaw?.pageSize ?? fallbackLimit);
  const totalPages = Number(
    pageRaw?.totalPages ?? Math.max(1, Math.ceil(totalItems / Math.max(1, itemsPerPage))),
  );

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

const getScheduleShowtimes = async (params?: ScheduleShowtimeQueryParams) => {
  const page = Math.max(0, (params?.page ?? 1) - 1);
  const limit = params?.limit ?? 15;

  const response = await apiClient.get('/showtimes', {
    params: {
      ...params,
      page,
      size: limit,
      sortDirection: params?.sortDirection ?? 'asc',
    },
  });

  return normalizePaginated(response, limit);
};

const getScheduleCinemas = async (): Promise<ScheduleCinemaOption[]> => {
  const response = await apiClient.get('/showtimes', { params: { page: 0, size: 1000 } });
  const listRaw = (response as any)?.data?.content ?? [];

  const cinemasMap = new Map<string, ScheduleCinemaOption>();
  listRaw.forEach((raw: any) => {
    const id = String(raw?.cinemaId ?? '');
    if (!id || cinemasMap.has(id)) return;
    cinemasMap.set(id, { _id: id, name: raw?.cinemaName ?? `Rạp ${id}` });
  });

  return Array.from(cinemasMap.values()).sort((a, b) => a.name.localeCompare(b.name, 'vi'));
};

export const useScheduleShowtimes = (params?: ScheduleShowtimeQueryParams) =>
  useQuery({
    queryKey: ['public-showtimes', params],
    queryFn: () => getScheduleShowtimes(params),
    staleTime: 60 * 1000,
  });

export const useScheduleCinemas = () =>
  useQuery({
    queryKey: ['public-showtimes-cinemas'],
    queryFn: getScheduleCinemas,
    staleTime: 5 * 60 * 1000,
  });


