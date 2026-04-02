package com.mecinema.mecinema.model.dto.movie;

import com.mecinema.mecinema.model.enumtype.MovieStatus;

import java.time.LocalDate;
import java.util.Set;

public record MovieRequest(
        String title,
        String description,
        Integer durationMinutes,
        LocalDate releaseDate,
        String posterUrl,
        String trailerUrl,
        MovieStatus status,
        Set<String> genres
) {
}
