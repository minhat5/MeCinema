package com.mecinema.mecinema.repo;

import com.mecinema.mecinema.model.entity.Showtime;
import java.util.Optional;

public interface ShowtimeRepositoryExtended {
    Optional<Showtime> findWithDetailsById(Long id);
}