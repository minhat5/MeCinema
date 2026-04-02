package com.mecinema.mecinema.service;

import com.mecinema.mecinema.model.dto.movie.MovieRequest;
import com.mecinema.mecinema.model.entity.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MovieService {
    Page<Movie> findAll(Pageable pageable);
    Page<Movie> findAllAvailable(Pageable pageable);
    Movie findById(Long id);
    Movie create(MovieRequest movie);
    Movie update(Long id, MovieRequest movie);
    void delete(Long id);
    Page<Movie> search(String keyword, Pageable pageable);
    Page<Movie> searchAvailable(String keyword, Pageable pageable);
}
