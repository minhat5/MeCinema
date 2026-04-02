import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';
import type { ApiResponse, PaginatedResponse } from '@shared/types/api.type';
import type { MovieFilter } from '@shared/schemas/movie.schema';

interface Movie {
  _id: string;
  title: string;
  slug: string;
  description: string;
  genres: Array<{ _id: string; name: string }>;
  duration: number;
  releaseDate: string;
  poster: string;
  trailer?: string;
  status: 'UPCOMING' | 'RELEASED' | 'ENDED';
  createdAt: string;
  updatedAt: string;
}

const mapMovie = (raw: any): Movie => ({
  _id: String(raw?.id ?? raw?._id ?? ''),
  title: raw?.title ?? '',
  slug: raw?.slug ?? String(raw?.id ?? raw?._id ?? ''),
  description: raw?.description ?? '',
  genres: Array.isArray(raw?.genres)
    ? raw.genres.map((g: any) => ({
        _id: String(g?.id ?? g?._id ?? ''),
        name: g?.name ?? '',
      }))
    : [],
  duration: Number(raw?.duration ?? raw?.durationMinutes ?? 0),
  releaseDate: raw?.releaseDate ?? '',
  poster: raw?.poster ?? raw?.posterUrl ?? '',
  trailer: raw?.trailer ?? raw?.trailerUrl,
  status: ((raw?.status as Movie['status']) ?? 'UPCOMING') as Movie['status'],
  createdAt: raw?.createdAt ?? '',
  updatedAt: raw?.updatedAt ?? '',
});

/**
 * Hook: Lấy danh sách phim với filter, search, pagination
 */
export const useMovies = (options?: Partial<MovieFilter>) => {
  return useQuery({
    queryKey: ['admin-movies', options],
    queryFn: async () => {
      const page = Math.max(0, ((options as any)?.page ?? 1) - 1);
      const size = (options as any)?.limit ?? 10;
      const keyword = (options as any)?.search as string | undefined;
      const status = (options as any)?.status as string | undefined;

      const raw: any = keyword
        ? await apiClient.get('/movies/search', { params: { q: keyword, page, size } })
        : await apiClient.get('/movies', { params: { page, size } });

      let data = Array.isArray(raw?.content) ? raw.content.map(mapMovie) : [];
      if (status) {
        data = data.filter((m: Movie) => m.status === status);
      }

      return {
        success: true,
        message: '',
        data: {
          data,
          pagination: {
            total: Number(raw?.totalElements ?? data.length),
            page: Number(raw?.number ?? 0) + 1,
            limit: Number(raw?.size ?? size),
            totalPages: Number(raw?.totalPages ?? 1),
          },
        },
      } as ApiResponse<PaginatedResponse<Movie>>;
    },
  });
};

/**
 * Hook: Lấy thông tin phim by id
 */
export const useMovieById = (id?: string) => {
  return useQuery({
    queryKey: ['admin-movies', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.get<ApiResponse<Movie>>(`/movies/${id}`);
      return mapMovie((response as any)?.data ?? response);
    },
    enabled: !!id,
  });
};

export type { Movie };
