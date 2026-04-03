package com.mecinema.mecinema.service;

import com.mecinema.mecinema.model.dto.showtimes.CreateShowtimeRequest;
import com.mecinema.mecinema.model.dto.showtimes.PaginatedResponse;
import com.mecinema.mecinema.model.dto.showtimes.ShowtimeDTO;
import com.mecinema.mecinema.model.dto.showtimes.UpdateShowtimeRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface ShowtimeService {
    ShowtimeDTO getShowtimeById(Long id);
    ShowtimeDTO createShowtime(CreateShowtimeRequest request);
    ShowtimeDTO updateShowtime(Long id, UpdateShowtimeRequest request);
    void deleteShowtime(Long id);
    List<ShowtimeDTO> getShowtimesByMovie(Long movieId);
    List<ShowtimeDTO> getShowtimesByRoom(Long roomId);
    PaginatedResponse<ShowtimeDTO> getShowtimesByCinema(Long cinemaId, Pageable pageable);
    PaginatedResponse<ShowtimeDTO> getUpcomingShowtimes(Pageable pageable);
    List<ShowtimeDTO> getShowtimesOfDay(LocalDate date);
    PaginatedResponse<ShowtimeDTO> getAllShowtimes(Pageable pageable);
}

