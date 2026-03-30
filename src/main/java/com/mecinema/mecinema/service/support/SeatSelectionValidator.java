package com.mecinema.mecinema.service.support;

import com.mecinema.mecinema.config.BookingProperties;
import com.mecinema.mecinema.exception.BookingException;
import com.mecinema.mecinema.exception.SeatAlreadyBookedException;
import com.mecinema.mecinema.model.entity.Seat;
import com.mecinema.mecinema.model.entity.Showtime;
import com.mecinema.mecinema.model.enumtype.Status;
import com.mecinema.mecinema.repo.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class SeatSelectionValidator {

    private final Clock clock;
    private final TicketRepository ticketRepository;
    private final BookingProperties bookingProperties;

    public void validateSelection(Showtime showtime, Collection<Long> seatIds) {
        if (seatIds == null || seatIds.isEmpty()) {
            throw new BookingException("Seat selection cannot be empty");
        }
        if (seatIds.size() != new HashSet<>(seatIds).size()) {
            throw new BookingException("Seat selection contains duplicates");
        }
        int maxSeats = bookingProperties.getSelection().getMaxSeats();
        if (seatIds.size() > maxSeats) {
            throw new BookingException("Seat selection exceeds maximum limit");
        }
    }

    public void ensureSeatsBelongToRoom(Showtime showtime, List<Seat> seats) {
        Long roomId = showtime.getRoom().getId();
        boolean invalid = seats.stream().anyMatch(seat -> !Objects.equals(seat.getRoom().getId(), roomId));
        if (invalid) {
            throw new BookingException("Seat does not belong to showtime room");
        }
    }

    public void ensureSeatsAreFree(Showtime showtime, Collection<Long> seatIds) {
        var views = ticketRepository.findSeatStatusesForSeats(showtime.getId(), seatIds);
        boolean busy = views.stream().anyMatch(view -> view.getBookingStatus() == Status.PENDING || view.getBookingStatus() == Status.SUCCESS);
        if (busy) {
            throw new SeatAlreadyBookedException("Seat already reserved by another booking");
        }
    }
}
