package com.mecinema.mecinema.repo;

import com.mecinema.mecinema.model.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long>, SeatRepositoryExtended {

    List<Seat> findByRoomIdOrderByRowSymbolAscSeatNumberAsc(Long roomId);
}