package com.mecinema.mecinema.model.dto.booking;

import com.mecinema.mecinema.model.enumtype.PaymentMethod;
import com.mecinema.mecinema.model.enumtype.SeatType;
import com.mecinema.mecinema.model.enumtype.Status;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record BookingResponse(
        Long bookingId,
        Status bookingStatus,
        BigDecimal totalPrice,
        LocalDateTime bookingTime,
        ShowtimeInfo showtime,
        List<SeatSelection> seats,
        List<FoodSelection> foods,
        PaymentSnapshot payment
) {

    public record ShowtimeInfo(
            Long showtimeId,
            String movieTitle,
            LocalDateTime startTime,
            LocalDateTime endTime,
            Long roomId,
            String roomName,
            Long cinemaId,
            String cinemaName
    ) {
    }

    public record SeatSelection(
            Long seatId,
            String rowSymbol,
            Integer seatNumber,
            SeatType seatType,
            BigDecimal price
    ) {
    }

    public record FoodSelection(
            Long foodId,
            String name,
            Integer quantity,
            BigDecimal price
    ) {
    }

    public record PaymentSnapshot(
            Long paymentId,
            PaymentMethod method,
            Status status,
            String transactionNo
    ) {
    }
}

