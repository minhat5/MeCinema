import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';
import type { ApiResponse } from '@shared/types/api.type';
import type { UpdateMovieInput } from '@shared/schemas/movie.schema';
import type { Movie } from './useMovies';

/**
 * Hook: Cập nhật phim
 */
export const useUpdateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateMovieInput;
    }) => {
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
      const response = await apiClient.put<ApiResponse<Movie>>(
        `/movies/${id}`,
        payload,
      );
      return (response as any)?.data ?? response;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
      queryClient.invalidateQueries({ queryKey: ['admin-movies', id] });
    },
  });
};
