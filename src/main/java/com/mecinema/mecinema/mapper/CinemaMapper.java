package com.mecinema.mecinema.mapper;

import com.mecinema.mecinema.model.dto.cinema.CinemaRequest;
import com.mecinema.mecinema.model.dto.cinema.CinemaResponse;
import com.mecinema.mecinema.model.dto.cinema.UpdateCinemaRequest;
import com.mecinema.mecinema.model.entity.Cinema;
import org.springframework.stereotype.Component;

@Component
public class CinemaMapper {

    public Cinema toCinema(CinemaRequest request) {
        Cinema cinema = new Cinema();
        cinema.setName(request.getName());
        cinema.setAddress(request.getAddress());
        cinema.setHotline(request.getHotline());
        return cinema;
    }

    public CinemaResponse toCinemaResponse(Cinema cinema) {
        CinemaResponse response = new CinemaResponse();
        response.setId(cinema.getId());
        response.setName(cinema.getName());
        response.setAddress(cinema.getAddress());
        response.setHotline(cinema.getHotline());
        response.setCreatedAt(cinema.getCreatedAt());
        response.setUpdatedAt(cinema.getUpdatedAt());
        return response;
    }

    public void updateCinemaFromRequest(UpdateCinemaRequest request, Cinema cinema) {
        if (request.getName() != null) {
            cinema.setName(request.getName());
        }
        if (request.getAddress() != null) {
            cinema.setAddress(request.getAddress());
        }
        if (request.getHotline() != null) {
            cinema.setHotline(request.getHotline());
        }
    }
}

