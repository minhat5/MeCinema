/**
 * Movies Service — API calls cho module phim
 *
 * Dùng: apiClient (đã auto attach token)
 * Trả về: data đã unwrap từ interceptor (response.data)
 */

import apiClient from '../../../lib/api-client';

export interface MovieResponse {
  _id: string;
  title: string;
  slug: string;
  description: string;
  directors: {
    _id: string;
    name: string;
    slug: string;
    avatar?: string;
    nationality?: string;
  }[];
  actors: {
    _id: string;
    name: string;
    slug: string;
    avatar?: string;
    nationality?: string;
  }[];
  genres: { _id: string; name: string; slug: string }[];
  duration: number;
  releaseDate: string;
  endDate?: string;
  poster: string;
  trailer?: string;
  rating: number;
  status: string;
  language: string;
  audioType: string;
  ageRating: string;
  country?: string;
  viewCount: number;
  createdAt: string;
}

export interface CinemaResponse {
  _id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  description?: string;
  images: string[];
  openingHours?: string;
}

export interface MoviesListResponse {
  success: boolean;
  data: {
    data: MovieResponse[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    };
  };
}

// --- MOVIES API ---

export const getMovies = (params?: Record<string, any>) =>
  params?.search
    ? apiClient.get('/movie/search', {
        params: {
          q: params.search,
          page: Math.max(0, (params.page ?? 1) - 1),
          size: params.limit ?? 10,
        },
      })
    : apiClient.get('/movie', {
        params: {
          page: Math.max(0, (params?.page ?? 1) - 1),
          size: params?.limit ?? 10,
        },
      });

export const getNowShowing = (limit = 10) =>
  apiClient.get('/movie', { params: { page: 0, size: limit } });

export const getUpcoming = (limit = 10) =>
  apiClient.get('/movie', { params: { page: 0, size: limit } });

export const getMovieBySlug = (slug: string) =>
  apiClient
    .get('/movie/search', { params: { q: slug, page: 0, size: 1 } })
    .then((res: any) => {
      const first = Array.isArray(res?.content) ? res.content[0] : undefined;
      if (!first) {
        throw new Error('Khong tim thay phim');
      }
      return first;
    });

export const getMovieById = (id: string) => apiClient.get(`/movie/${id}`);

export const getRelatedMovies = (movieId: string, limit = 6) => {
  void movieId;
  return apiClient.get('/movie', { params: { page: 0, size: limit } });
};

// --- CINEMAS API ---

export const getCinemas = (params?: Record<string, any>) =>
  apiClient.get('/cinemas', { params: { limit: 100, ...params } });

export const getCinemaCities = () => apiClient.get('/cinemas/cities');

// --- GENRES API ---

export const getGenres = () => apiClient.get('/genres');

// --- FILTER OPTIONS API ---

export const getCountries = () => Promise.resolve([]);

export const getYears = () => Promise.resolve([]);
