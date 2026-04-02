import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/api-client';

export interface ShowtimeFilter {
  movieId: string;
  cinemaId?: string;
}

export const useShowtimes = ({ movieId, cinemaId }: ShowtimeFilter) =>
  useQuery({
	queryKey: ['showtimes', 'movie', movieId, cinemaId],
	queryFn: () =>
	  apiClient.get(`/showtimes/movie/${movieId}`, {
		params: cinemaId ? { cinemaId } : {},
	  }),
	enabled: !!movieId,
	staleTime: 2 * 60 * 1000,
  });

