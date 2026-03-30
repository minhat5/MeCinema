package com.mecinema.mecinema.service.impl;

import com.mecinema.mecinema.model.enumtype.SeatType;
import com.mecinema.mecinema.service.PricingService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;

@Service
public class PricingServiceImpl implements PricingService {

    private static final Map<SeatType, BigDecimal> MULTIPLIERS = Map.of(
            SeatType.NORMAL, BigDecimal.valueOf(1.0),
            SeatType.VIP, BigDecimal.valueOf(1.2),
            SeatType.SWEETBOX, BigDecimal.valueOf(1.5)
    );

    @Override
    public BigDecimal calculateSeatPrice(BigDecimal basePrice, SeatType seatType) {
        BigDecimal multiplier = MULTIPLIERS.getOrDefault(seatType, BigDecimal.ONE);
        return basePrice.multiply(multiplier).setScale(2, RoundingMode.HALF_UP);
    }
}

