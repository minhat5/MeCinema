package com.mecinema.mecinema.model.dto.food;

import com.mecinema.mecinema.model.enumtype.FoodType;

import java.math.BigDecimal;

public record FoodRequest(
        String name,
        String description,
        BigDecimal price,
        String imageUrl,
        FoodType type,
        Boolean isActive
) {
}
