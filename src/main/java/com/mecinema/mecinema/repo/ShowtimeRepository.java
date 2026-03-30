package com.mecinema.mecinema.repo;

import com.mecinema.mecinema.model.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long>, ShowtimeRepositoryExtended {
}