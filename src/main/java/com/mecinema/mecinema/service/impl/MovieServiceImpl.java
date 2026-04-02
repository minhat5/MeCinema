package com.mecinema.mecinema.service.impl;

import com.mecinema.mecinema.model.dto.movie.MovieRequest;
import com.mecinema.mecinema.model.entity.Genre;
import com.mecinema.mecinema.model.entity.Movie;
import com.mecinema.mecinema.model.enumtype.MovieStatus;
import com.mecinema.mecinema.repo.GenreRepository;
import com.mecinema.mecinema.repo.MovieRepository;
import com.mecinema.mecinema.service.MovieService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieServiceImpl implements MovieService {
    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;

    private Set<Genre> resolveGenres(Set<String> genres) {
        if (genres == null || genres.isEmpty()) {
            return Set.of();
        }

        return genres.stream()
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(name -> genreRepository.findByName(name)
                        .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thể loại: " + name)))
                .collect(Collectors.toSet());
    }

    @Override
    public Page<Movie> findAll(Pageable pageable) {
        return movieRepository.findAll(pageable);
    }

    @Override
    public Page<Movie> findAllAvailable(Pageable pageable) {
        return movieRepository.findByStatus(MovieStatus.RELEASED, pageable);
    }

    @Override
    public Movie findById(Long id) {
        return movieRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phim với id: " + id));
    }

    @Override
    public Movie create(MovieRequest movie) {
        Movie newMovie = new Movie();
        newMovie.setTitle(movie.title());
        newMovie.setDescription(movie.description());
        newMovie.setReleaseDate(movie.releaseDate());
        newMovie.setDurationMinutes(movie.durationMinutes());
        newMovie.setPosterUrl(movie.posterUrl());
        newMovie.setTrailerUrl(movie.trailerUrl());
        newMovie.setStatus(movie.status() != null ? movie.status() : MovieStatus.UPCOMING);
        newMovie.setGenres(resolveGenres(movie.genres()));
        return movieRepository.save(newMovie);
    }

    @Override
    public Movie update(Long id, MovieRequest movie) {
        Movie updatingMovie = movieRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phim với id: " + id));
        updatingMovie.setTitle(movie.title());
        updatingMovie.setDescription(movie.description());
        updatingMovie.setReleaseDate(movie.releaseDate());
        updatingMovie.setDurationMinutes(movie.durationMinutes());
        updatingMovie.setPosterUrl(movie.posterUrl());
        updatingMovie.setTrailerUrl(movie.trailerUrl());
        updatingMovie.setStatus(movie.status() != null ? movie.status() : updatingMovie.getStatus());
        updatingMovie.setGenres(resolveGenres(movie.genres()));
        return movieRepository.save(updatingMovie);
    }

    @Override
    public void delete(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy phim với id: " + id);
        }
        movieRepository.deleteById(id);
    }

    @Override
    public Page<Movie> search(String keyword, Pageable pageable) {
        return movieRepository.findAll((root, query, criteriaBuilder) -> {
            String likePattern = "%" + keyword.toLowerCase() + "%";
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), likePattern);
        },  pageable);
    }

    @Override
    public Page<Movie> searchAvailable(String keyword, Pageable pageable) {
        return movieRepository.findAll((root, query, criteriaBuilder) -> {
            String likePattern = "%" + keyword.toLowerCase() + "%";
            return criteriaBuilder.and(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), likePattern),
                    criteriaBuilder.equal(root.get("status"), "RELEASED")
            );
        },  pageable);
    }
}
