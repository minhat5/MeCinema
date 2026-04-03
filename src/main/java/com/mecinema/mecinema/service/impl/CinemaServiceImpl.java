package com.mecinema.mecinema.service.impl;

import com.mecinema.mecinema.model.entity.Cinema;
import com.mecinema.mecinema.repo.CinemaRepository;
import com.mecinema.mecinema.service.CinemaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CinemaServiceImpl implements CinemaService {

    private final CinemaRepository cinemaRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<Cinema> findAll(Pageable pageable) {
        return cinemaRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Cinema findById(Long id) {
        return cinemaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cinema not found with id: " + id));
    }
}

