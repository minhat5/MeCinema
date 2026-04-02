/**
 * MovieDetail — Component chi tiết phim
 *
 * Sections:
 * 1. Banner (poster background + play trailer inline)
 * 2. Info (poster nhỏ + title + badges + rating + genres + directors + actors)
 * 3. Nội dung phim (description)
 * 4. Lịch chiếu (date tabs + cinema filter + showtime slots)
 * 5. Sidebar: Phim đang chiếu (related movies)
 */

import { useState } from 'react';
import { Badge, Container } from '@mantine/core';
import { Link } from 'react-router-dom';
import { getYouTubeEmbedUrl } from './TrailerModal';
import type { MovieResponse } from '../services/movies.service';

interface MovieDetailProps {
  movie: MovieResponse;
}

export default function MovieDetail({ movie }: MovieDetailProps) {
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  const embedUrl = movie.trailer ? getYouTubeEmbedUrl(movie.trailer) : null;

  const releaseDate = new Date(movie.releaseDate).toLocaleDateString('vi-VN');

  return (
    <div>
      {/* ========== BANNER SECTION ========== */}
      <div className="relative w-full h-[400px] md:h-[480px] overflow-hidden">
        {isPlayingTrailer && embedUrl ? (
          /* Trailer đang phát — YouTube embed inline */
          <div className="w-full h-full bg-black">
            <iframe
              className="w-full h-full"
              src={embedUrl}
              title={`Trailer ${movie.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 'none' }}
            />
          </div>
        ) : (
          /* Banner poster với nút Play */
          <>
            {/* Background Image */}
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />

            {/* Play Button (center) */}
            {movie.trailer && (
              <button
                onClick={() => setIsPlayingTrailer(true)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 border-white/50 cursor-pointer group"
              >
                <svg
                  className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.5 3.5a1 1 0 011.555-.832l10 6.5a1 1 0 010 1.664l-10 6.5A1 1 0 016.5 16.5v-13z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}

            {/* Movie Title on Banner */}
            {/* <div className="absolute bottom-6 left-0 right-0">
                <Container size="xl">
                  <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                    {movie.title}
                  </h1>
                </Container>
              </div> */}
          </>
        )}
      </div>

      {/* ========== INFO SECTION ========== */}
      <Container size="xl" className="py-8">
        <div className="flex gap-8">
          {/* LEFT: Main Content */}
          <div className="flex-1 min-w-0">
            {/* Poster + Info Row */}
            <div className="flex gap-6 mb-8">
              {/* Poster nhỏ */}
              <div className="shrink-0 w-[200px] -mt-24 relative z-10">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full rounded-xl shadow-2xl border-4 border-white"
                />
              </div>

              {/* Info Details */}
              <div className="flex-1 pt-2">
                {/* Title + Age Rating */}
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {movie.title}
                  </h2>
                  <span
                    className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-md"
                  >
                    {movie.status === 'RELEASED' ? 'Đang chiếu' : 'Sắp chiếu'}
                  </span>
                </div>

                {/* Duration + Release Date */}
                <div className="flex items-center gap-4 text-gray-600 text-sm mb-3">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {movie.duration} Phút
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {releaseDate}
                  </span>
                </div>


                {/* Genres */}
                <div className="flex items-center gap-2 text-sm mb-2">
                  <span className="text-gray-400 min-w-[80px]">Thể loại:</span>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <Link
                        to={`/dien-anh?genre=${genre._id}`}
                        key={genre._id}
                        className="no-underline"
                      >
                        <Badge
                          variant="outline"
                          color="gray"
                          size="sm"
                          radius="sm"
                          className="hover:bg-gray-100 cursor-pointer"
                        >
                          {genre.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Persons feature (directors/actors) is disabled */}
              </div>
            </div>

            {/* ========== NỘI DUNG PHIM ========== */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b-2 border-orange-500 inline-block">
                Nội Dung Phim
              </h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {movie.description}
              </div>
            </div>
          </div>

          {/* RIGHT: Sidebar — sẽ được truyền từ ngoài */}
        </div>
      </Container>
    </div>
  );
}
