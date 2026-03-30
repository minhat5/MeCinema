package com.mecinema.mecinema.mapper;

import com.mecinema.mecinema.model.dto.booking.BookingResponse;
import com.mecinema.mecinema.model.entity.Booking;
import com.mecinema.mecinema.model.entity.BookingFood;
import com.mecinema.mecinema.model.entity.Payment;
import com.mecinema.mecinema.model.entity.Ticket;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Component
public class BookingMapper {

    public BookingResponse toResponse(Booking booking, Optional<Payment> payment) {
        BookingResponse.ShowtimeInfo showtimeInfo = new BookingResponse.ShowtimeInfo(
                booking.getShowtime().getId(),
                booking.getShowtime().getMovie().getTitle(),
                booking.getShowtime().getStartTime(),
                booking.getShowtime().getEndTime(),
                booking.getShowtime().getRoom().getId(),
                booking.getShowtime().getRoom().getName(),
                booking.getShowtime().getRoom().getCinema().getId(),
                booking.getShowtime().getRoom().getCinema().getName()
        );

        List<BookingResponse.SeatSelection> seats = booking.getTickets().stream()
                .sorted(Comparator.comparing(Ticket::getId))
                .map(ticket -> new BookingResponse.SeatSelection(
                        ticket.getSeat().getId(),
                        ticket.getSeat().getRowSymbol(),
                        ticket.getSeat().getSeatNumber(),
                        ticket.getSeat().getType(),
                        ticket.getPrice()
                ))
                .toList();

        List<BookingResponse.FoodSelection> foods = booking.getBookingFoods().stream()
                .sorted(Comparator.comparing(BookingFood::getId))
                .map(food -> new BookingResponse.FoodSelection(
                        food.getFood().getId(),
                        food.getFood().getName(),
                        food.getQuantity(),
                        food.getPrice()
                ))
                .toList();

        BookingResponse.PaymentSnapshot paymentSnapshot = payment
                .map(p -> new BookingResponse.PaymentSnapshot(
                        p.getId(),
                        p.getPaymentMethod(),
                        p.getStatus(),
                        p.getTransactionNo()
                ))
                .orElse(null);

        return new BookingResponse(
                booking.getId(),
                booking.getStatus(),
                booking.getTotalPrice(),
                booking.getBookingTime(),
                showtimeInfo,
                seats,
                foods,
                paymentSnapshot
        );
    }
}

