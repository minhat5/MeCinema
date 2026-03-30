package com.mecinema.mecinema.model.dto.booking;

import com.mecinema.mecinema.model.enumtype.SeatAvailabilityStatus;
import com.mecinema.mecinema.model.enumtype.SeatType;

import java.util.List;

public record SeatAvailabilityResponse(
        Long showtimeId,
        Long roomId,
        List<SeatInfo> seats
) {
    public record SeatInfo(
            Long seatId,
            String rowSymbol,
            Integer seatNumber,
            SeatType seatType,
            SeatAvailabilityStatus status
    ) {
    }
}

