package com.mecinema.mecinema.service;

import com.mecinema.mecinema.model.dto.cinema.CinemaRequest;
import com.mecinema.mecinema.model.dto.cinema.CinemaResponse;
import com.mecinema.mecinema.model.dto.cinema.UpdateCinemaRequest;
import com.mecinema.mecinema.model.entity.Cinema;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CinemaService {
    Page<Cinema> findAll(Pageable pageable);
    Cinema findById(Long id);
    CinemaResponse create(CinemaRequest request);
    CinemaResponse update(Long id, UpdateCinemaRequest request);
    void delete(Long id);
    Page<Cinema> search(String keyword, Pageable pageable);
}

