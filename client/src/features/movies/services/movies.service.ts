import apiClient from '../../../lib/api-client';

interface BackendGenre {
  id?: number | string;
  name?: string;
}

interface BackendMovie {
  id?: number | string;
  title?: string;
  description?: string;
  genres?: BackendGenre[];
  durationMinutes?: number;
  releaseDate?: string;
  posterUrl?: string;
  trailerUrl?: string;
  status?: string;
  createdAt?: string;
}

interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface MovieResponse {
  _id: string;
  title: string;
  description: string;
  genres: { _id: string; name: string }[];
  duration: number;
  releaseDate: string;
  poster: string;
  trailer?: string;
  status: string;
  createdAt: string;
}

export interface MoviesListResponse {
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

const mapMovie = (raw: BackendMovie): MovieResponse => {
  const id = String(raw.id ?? '');
  const title = raw.title?.trim() || 'Untitled';

  return {
    _id: id,
    title,
    description: raw.description?.trim() || 'Chua co mo ta cho phim nay.',
    genres: (raw.genres || []).map((genre, index) => {
      const genreName = genre.name?.trim() || 'Khac';
      const genreId = String(genre.id ?? `genre-${index}`);
      return {
        _id: genreId,
        name: genreName,
      };
    }),
    duration: raw.durationMinutes ?? 0,
    releaseDate: raw.releaseDate || new Date().toISOString(),
    poster: raw.posterUrl || '',
    trailer: raw.trailerUrl,
    status: raw.status || 'UPCOMING',
    createdAt: raw.createdAt || new Date().toISOString(),
  };
};

const mapMoviePage = (page: SpringPage<BackendMovie>): MoviesListResponse => ({
  data: {
    data: (page.content || []).map(mapMovie),
    pagination: {
      totalItems: page.totalElements ?? 0,
      totalPages: page.totalPages ?? 0,
      currentPage: (page.number ?? 0) + 1,
      itemsPerPage: page.size ?? 10,
    },
  },
});

export const getMovies = async (
  params?: Record<string, string | number | undefined>,
): Promise<MoviesListResponse> => {
  const page = Math.max(0, Number((params?.page as number | undefined) ?? 1) - 1);
  const size = Number((params?.limit as number | undefined) ?? 10);

  const result = params?.search
    ? await apiClient.get('/movie/search', {
        params: {
          q: params.search,
          page,
          size,
        },
      })
    : await apiClient.get('/movie', {
        params: {
          page,
          size,
        },
      });

  return mapMoviePage(result as unknown as SpringPage<BackendMovie>);
};

export const getNowShowing = async (limit = 10): Promise<{ data: MovieResponse[] }> => {
  const response = await getMovies({ page: 1, limit });
  return { data: response.data.data };
};

export const getUpcoming = async (limit = 10): Promise<{ data: MovieResponse[] }> => {
  const response = await getMovies({ page: 1, limit });
  return { data: response.data.data.filter((movie) => movie.status === 'UPCOMING') };
};

export const getMovieBySlug = async (slug: string): Promise<{ data: MovieResponse }> => {
  const response = await getMovies({ search: slug, page: 1, limit: 1 });
  const first = response.data.data[0];
  if (!first) {
    throw new Error('Khong tim thay phim');
  }
  return { data: first };
};

export const getMovieById = async (id: string): Promise<{ data: MovieResponse }> => {
  const response = await apiClient.get(`/movie/${id}`);
  return { data: mapMovie(response as unknown as BackendMovie) };
};

export const getRelatedMovies = async (
  movieId: string,
  limit = 6,
): Promise<{ data: MovieResponse[] }> => {
  const response = await getMovies({ page: 1, limit: limit + 1 });
  return { data: response.data.data.filter((movie) => movie._id !== movieId).slice(0, limit) };
};

export const getCinemas = async (_params?: Record<string, any>) => {
  // Backend không có API trực tiếp lấy danh sách rạp /cinemas
  // Phải fetch thông qua danh sách showtimes để lấy ra các rạp duy nhất
  const response = await apiClient.get('/showtimes', { params: { size: 1000 } });
  const rawShowtimes: any[] = (response as any).data?.content || [];
  
  const cinemasMap = new Map<string, any>();
  
  rawShowtimes.forEach((st) => {
    if (st.cinemaId) {
      const cId = String(st.cinemaId);
      if (!cinemasMap.has(cId)) {
        cinemasMap.set(cId, {
          _id: cId,
          name: st.cinemaName || `Rạp ${cId}`,
          city: 'Toàn quốc', 
        });
      }
    }
  });
  
  return { data: Array.from(cinemasMap.values()) };
};

export const getCinemaCities = () => Promise.resolve({ data: ['Toàn quốc'] });

export const getGenres = () => apiClient.get('/genres');

export const getCountries = () => Promise.resolve([]);

export const getYears = () => Promise.resolve([]);
