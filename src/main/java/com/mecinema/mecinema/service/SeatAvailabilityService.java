package com.mecinema.mecinema.service;

import com.mecinema.mecinema.model.dto.booking.SeatAvailabilityResponse;

public interface SeatAvailabilityService {
    SeatAvailabilityResponse getSeatAvailability(Long showtimeId);
}

