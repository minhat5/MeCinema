export interface MovieFilter {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'UPCOMING' | 'RELEASED' | 'ENDED';
}
export interface CreateMovieInput {
  title: string;
  description: string;
  genres: string[];
  duration: number;
  releaseDate: string;
  poster: string;
  trailer?: string;
  status?: 'UPCOMING' | 'RELEASED' | 'ENDED';
}
export type UpdateMovieInput = Partial<CreateMovieInput>;
