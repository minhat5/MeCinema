package com.mecinema.mecinema.model.dto.booking;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record BookingRequest(
        @NotNull Long showtimeId,
        @NotEmpty List<@NotNull Long> seatIds,
        @Valid List<FoodSelection> foods
) {
    public record FoodSelection(
            @NotNull Long foodId,
            @Min(1) int quantity
    ) {
    }
}

