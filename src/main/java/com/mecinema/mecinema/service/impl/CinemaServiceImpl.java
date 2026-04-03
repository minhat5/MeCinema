package com.mecinema.mecinema.service.impl;

import com.mecinema.mecinema.exception.CinemaNotFoundException;
import com.mecinema.mecinema.mapper.CinemaMapper;
import com.mecinema.mecinema.model.dto.cinema.CinemaRequest;
import com.mecinema.mecinema.model.dto.cinema.CinemaResponse;
import com.mecinema.mecinema.model.dto.cinema.UpdateCinemaRequest;
import com.mecinema.mecinema.model.entity.Cinema;
import com.mecinema.mecinema.repo.CinemaRepository;
import com.mecinema.mecinema.service.CinemaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CinemaServiceImpl implements CinemaService {

    private final CinemaRepository cinemaRepository;
    private final CinemaMapper cinemaMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<Cinema> findAll(Pageable pageable) {
        log.debug("Finding all cinemas with pageable: {}", pageable);
        return cinemaRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Cinema findById(Long id) {
        log.debug("Finding cinema with id: {}", id);
        return cinemaRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Cinema not found with id: {}", id);
                    return new CinemaNotFoundException(id);
                });
    }

    @Override
    public CinemaResponse create(CinemaRequest request) {
        log.info("Creating new cinema: {}", request.getName());
        Cinema cinema = cinemaMapper.toCinema(request);
        Cinema savedCinema = cinemaRepository.save(cinema);
        log.info("Cinema created successfully with id: {}", savedCinema.getId());
        return cinemaMapper.toCinemaResponse(savedCinema);
    }

    @Override
    public CinemaResponse update(Long id, UpdateCinemaRequest request) {
        log.info("Updating cinema with id: {}", id);
        Cinema cinema = findById(id);
        cinemaMapper.updateCinemaFromRequest(request, cinema);
        Cinema updatedCinema = cinemaRepository.save(cinema);
        log.info("Cinema updated successfully with id: {}", id);
        return cinemaMapper.toCinemaResponse(updatedCinema);
    }

    @Override
    public void delete(Long id) {
        log.info("Deleting cinema with id: {}", id);
        Cinema cinema = findById(id);
        cinemaRepository.delete(cinema);
        log.info("Cinema deleted successfully with id: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Cinema> search(String keyword, Pageable pageable) {
        log.debug("Searching cinemas with keyword: {}", keyword);
        return cinemaRepository.findByNameContainingIgnoreCase(keyword, pageable);
    }
}

