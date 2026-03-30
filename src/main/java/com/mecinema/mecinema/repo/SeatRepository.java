package com.mecinema.mecinema.repo;

import com.mecinema.mecinema.model.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long>, SeatRepositoryExtended {

    List<Seat> findByRoomIdOrderByRowSymbolAscSeatNumberAsc(Long roomId);
}