package com.mecinema.mecinema.model.dto.seats;

import com.mecinema.mecinema.model.enumtype.SeatType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BulkCreateSeatsDto {
    @NotNull(message = "Room ID không được để trống")
    private Long roomId;

    @NotBlank(message = "Ký tự hàng không được để trống")
    private String rowSymbol;

    @NotNull(message = "Số ghế bắt đầu không được để trống")
    @Positive(message = "Số ghế bắt đầu phải là số dương")
    private Integer startSeatNumber;

    @NotNull(message = "Số ghế kết thúc không được để trống")
    @Positive(message = "Số ghế kết thúc phải là số dương")
    private Integer endSeatNumber;

    @NotNull(message = "Loại ghế không được để trống")
    private SeatType type;

    @AssertTrue(message = "Số ghế bắt đầu phải nhỏ hơn hoặc bằng số ghế kết thúc")
    private boolean isValidRange() {
        return startSeatNumber != null && endSeatNumber != null && startSeatNumber <= endSeatNumber;
    }
}

