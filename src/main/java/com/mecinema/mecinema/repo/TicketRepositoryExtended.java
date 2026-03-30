package com.mecinema.mecinema.repo;

import java.util.Collection;
import java.util.List;

public interface TicketRepositoryExtended {
    List<TicketRepository.SeatReservationView> findSeatStatusesByShowtime(Long showtimeId);

    List<TicketRepository.SeatReservationView> findSeatStatusesForSeats(Long showtimeId, Collection<Long> seatIds);
}