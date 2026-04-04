/**
 * useMovieDetail — Hooks cho trang chi tiết phim
 *
 * Tách riêng khỏi useMovies vì dùng ở MovieDetailPage
 * Bao gồm: useMovieBySlug, useMovieById, useRelatedMovies, useShowtimesByMovie
 */

import { useQuery } from '@tanstack/react-query';
import {
  getMovieById,
} from '../services/movies.service';

/**
 * Lấy chi tiết phim theo ID
 */
export const useMovieById = (id: string) =>
  useQuery({
    queryKey: ['movies', 'detail', id],
    queryFn: () => getMovieById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });