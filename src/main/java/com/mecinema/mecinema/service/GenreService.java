package com.mecinema.mecinema.service;

import com.mecinema.mecinema.model.entity.Genre;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface GenreService {
    Page<Genre> getGenres(Pageable pageable);
    Genre findGenreById(Long id);
    Genre createGenre(Genre genre);
    Genre updateGenre(Long id, Genre genre);
    void deleteGenre(Long id);
    Genre findGenreByName(String name);
}
