import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';
import type { ApiResponse } from '@shared/types/api.type';
import type { CreateMovieInput } from '@shared/schemas/movie.schema';
import type { Movie } from './useMovies';

/**
 * Hook: Tạo phim mới
 */
export const useCreateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMovieInput) => {
      const payload = {
        title: data.title,
        description: data.description,
        durationMinutes: (data as any).duration,
        releaseDate: String(data.releaseDate).slice(0, 10),
        posterUrl: (data as any).poster,
        trailerUrl: (data as any).trailer,
        status: (data as any).status ?? 'UPCOMING',
        genres: (data as any).genres ?? [],
      };
      const response = await apiClient.post<ApiResponse<Movie>>(
        '/movies',
        payload,
      );
      return (response as any)?.data ?? response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
    },
  });
};
