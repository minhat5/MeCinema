package com.mecinema.mecinema.repo;

import com.mecinema.mecinema.model.entity.Ticket;
import com.mecinema.mecinema.model.enumtype.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Collection;

public interface TicketRepository extends JpaRepository<Ticket, Long>, TicketRepositoryExtended {

    boolean existsBySeatIdAndBooking_ShowtimeIdAndBooking_StatusIn(Long seatId, Long showtimeId, Collection<Status> statuses);

    public interface SeatReservationView {
        Long getSeatId();
        Status getBookingStatus();
    }
}