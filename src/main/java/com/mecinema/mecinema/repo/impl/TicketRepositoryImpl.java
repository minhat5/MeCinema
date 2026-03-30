package com.mecinema.mecinema.repo.impl;

import com.mecinema.mecinema.model.enumtype.Status;
import com.mecinema.mecinema.repo.TicketRepository;
import com.mecinema.mecinema.repo.TicketRepositoryExtended;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public class TicketRepositoryImpl implements TicketRepositoryExtended {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<TicketRepository.SeatReservationView> findSeatStatusesByShowtime(Long showtimeId) {
        var query = entityManager.createQuery(
                "select t.seat.id, t.booking.status from Ticket t where t.booking.showtime.id = :showtimeId",
                Object[].class
        );
        query.setParameter("showtimeId", showtimeId);
        return query.getResultList().stream()
                .map(row -> (TicketRepository.SeatReservationView) new SeatReservationProjection((Long) row[0], (Status) row[1]))
                .toList();
    }

    @Override
    public List<TicketRepository.SeatReservationView> findSeatStatusesForSeats(Long showtimeId, Collection<Long> seatIds) {
        if (seatIds == null || seatIds.isEmpty()) {
            return List.of();
        }
        var query = entityManager.createQuery(
                "select t.seat.id, t.booking.status from Ticket t where t.booking.showtime.id = :showtimeId and t.seat.id in :seatIds",
                Object[].class
        );
        query.setParameter("showtimeId", showtimeId);
        query.setParameter("seatIds", seatIds);
        return query.getResultList().stream()
                .map(row -> (TicketRepository.SeatReservationView) new SeatReservationProjection((Long) row[0], (Status) row[1]))
                .toList();
    }

    private record SeatReservationProjection(Long seatId, Status bookingStatus)
            implements TicketRepository.SeatReservationView {

        @Override
        public Long getSeatId() {
            return seatId;
        }

        @Override
        public Status getBookingStatus() {
            return bookingStatus;
        }
    }
}
