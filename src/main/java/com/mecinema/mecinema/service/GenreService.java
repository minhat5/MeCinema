package com.mecinema.mecinema.service;

import com.mecinema.mecinema.model.entity.Genre;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GenreService {
    Page<Genre> findAll(Pageable pageable);
    Genre findById(Long id);
    Genre create(Genre genre);
    Genre update(Long id, Genre genre);
    void delete(Long id);
    Page<Genre> search(String keyword, Pageable pageable);
}
