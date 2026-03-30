package com.mecinema.mecinema.service;

import com.mecinema.mecinema.model.enumtype.SeatType;

import java.math.BigDecimal;

public interface PricingService {
    BigDecimal calculateSeatPrice(BigDecimal basePrice, SeatType seatType);
}

