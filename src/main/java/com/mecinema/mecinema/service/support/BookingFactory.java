package com.mecinema.mecinema.service.support;

import com.mecinema.mecinema.config.BookingProperties;
import com.mecinema.mecinema.model.entity.Booking;
import com.mecinema.mecinema.model.entity.Seat;
import com.mecinema.mecinema.model.entity.Showtime;
import com.mecinema.mecinema.model.entity.Ticket;
import com.mecinema.mecinema.model.entity.User;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class BookingFactory {

    private final Clock clock;
    private final BookingProperties bookingProperties;

    public Booking createPendingBooking(User user, Showtime showtime) {
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShowtime(showtime);
        LocalDateTime now = LocalDateTime.now(clock);
        booking.setBookingTime(now);
        return booking;
    }

    public Ticket createTicket(Booking booking, Seat seat, BigDecimal price) {
        Ticket ticket = new Ticket();
        ticket.setBooking(booking);
        ticket.setSeat(seat);
        ticket.setPrice(price);
        return ticket;
    }
}
