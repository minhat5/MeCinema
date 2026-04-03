package com.mecinema.mecinema.service;

import com.mecinema.mecinema.model.entity.Cinema;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CinemaService {
    Page<Cinema> findAll(Pageable pageable);
    Cinema findById(Long id);
}

