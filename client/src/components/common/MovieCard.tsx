/**
 * MovieCard — Card hiển thị phim với hover overlay
 *
 * Props: { movie, onClick? }
 * Hover: overlay với 2 nút "Mua vé" + "Trailer"
 * Click ngoài 2 nút → vào chi tiết phim
 * Click "Trailer" → mở modal YouTube embed (không redirect)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrailerModal from '../../features/movies/components/TrailerModal';
import type { MovieResponse } from '../../features/movies/services/movies.service';

interface MovieCardProps {
  movie: MovieResponse;
  onBuyTicket?: (movie: MovieResponse) => void;
}

export default function MovieCard({ movie, onBuyTicket }: MovieCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [trailerOpened, setTrailerOpened] = useState(false);

  const handleCardClick = () => {
    navigate(`/phim/${movie._id}`);
  };

  const handleBuyTicket = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBuyTicket) {
      onBuyTicket(movie);
    } else {
      navigate(`/phim/${movie._id}`);
    }
  };

  const handleTrailer = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (movie.trailer) {
      setTrailerOpened(true);
    }
  };

  return (
    <>
      <div className="group cursor-pointer" onClick={handleCardClick}>
        {/* Poster Container */}
        <div
          className="relative overflow-hidden rounded-xl aspect-[2/3]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Poster Image */}
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-md">
            {movie.status}
          </div>

          {/* HOVER OVERLAY — 2 nút Mua vé + Trailer */}
          <div
            className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Nút Mua vé */}
            <button
              onClick={handleBuyTicket}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-200 hover:scale-105 shadow-lg cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
              Mua vé
            </button>

            {/* Nút Trailer */}
            {movie.trailer && (
              <button
                onClick={handleTrailer}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-200 hover:scale-105 border border-white/40 cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Trailer
              </button>
            )}
          </div>
        </div>

        {/* Movie Title */}
        <h3 className="mt-3 text-[15px] font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-orange-500 transition-colors duration-200">
          {movie.title}
        </h3>
      </div>

      {/* Trailer Modal — YouTube embed inline */}
      {movie.trailer && (
        <TrailerModal
          opened={trailerOpened}
          onClose={() => setTrailerOpened(false)}
          trailerUrl={movie.trailer}
          movieTitle={movie.title}
        />
      )}
    </>
  );
}
