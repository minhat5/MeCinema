package com.mecinema.mecinema.model.dto.seats;

import com.mecinema.mecinema.model.enumtype.SeatType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSeatDto {
    @NotNull(message = "Room ID không được để trống")
    private Long roomId;

    @NotBlank(message = "Ký tự hàng không được để trống")
    private String rowSymbol;

    @NotNull(message = "Số ghế không được để trống")
    @Positive(message = "Số ghế phải là số dương")
    private Integer seatNumber;

    @NotNull(message = "Loại ghế không được để trống")
    private SeatType type;
}

