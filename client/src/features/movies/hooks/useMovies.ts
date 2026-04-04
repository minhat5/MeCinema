/**
 * useMovies — Hooks cho trang danh sách phim
 *
 * Dùng: useQuery từ TanStack Query
 * Chỉ chứa hooks liên quan listing: useNowShowing, useUpcoming, useMovies, useGenres, useCinemas
 * Hooks chi tiết phim → xem useMovieDetail.ts
 */

import { useQuery } from '@tanstack/react-query';
import {
  getNowShowing,
  getUpcoming,
  getMovies,
} from '../services/movies.service';

export const useNowShowing = (limit = 10) =>
  useQuery({
    queryKey: ['movies', 'now-showing', limit],
    queryFn: () => getNowShowing(limit),
    staleTime: 5 * 60 * 1000,
  });

export const useUpcoming = (limit = 10) =>
  useQuery({
    queryKey: ['movies', 'upcoming', limit],
    queryFn: () => getUpcoming(limit),
    staleTime: 5 * 60 * 1000,
  });

export const useMovies = (params?: Record<string, any>) =>
  useQuery({
    queryKey: ['movies', params],
    queryFn: () => getMovies(params),
    staleTime: 5 * 60 * 1000,
  });
