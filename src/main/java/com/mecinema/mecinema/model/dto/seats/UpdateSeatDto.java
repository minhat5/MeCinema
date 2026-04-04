package com.mecinema.mecinema.model.dto.seats;

import com.mecinema.mecinema.model.enumtype.SeatType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateSeatDto {
    @NotNull(message = "Loại ghế không được để trống")
    private SeatType type;
}

