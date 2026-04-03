package com.mecinema.mecinema.service.support;

import com.mecinema.mecinema.mapper.CinemaMapper;
import com.mecinema.mecinema.model.dto.cinema.CinemaListResponse;
import com.mecinema.mecinema.model.dto.cinema.CinemaResponse;
import com.mecinema.mecinema.model.entity.Cinema;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CinemaResponseBuilder {

    private final CinemaMapper cinemaMapper;

    public CinemaListResponse buildCinemaListResponse(Page<Cinema> page) {
        CinemaListResponse response = new CinemaListResponse();
        response.setCinemas(
                page.getContent().stream()
                    .map(cinemaMapper::toCinemaResponse)
                    .collect(Collectors.toList())
        );
        response.setTotalPages(page.getTotalPages());
        response.setTotalElements(page.getTotalElements());
        response.setCurrentPage(page.getNumber());
        response.setPageSize(page.getSize());
        response.setHasNext(page.hasNext());
        response.setHasPrevious(page.hasPrevious());
        return response;
    }
}

