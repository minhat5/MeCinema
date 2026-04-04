package com.mecinema.mecinema.model.dto.seats;

import com.mecinema.mecinema.model.enumtype.SeatType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatDto {
    private Long id;
    private String rowSymbol;
    private Integer seatNumber;
    private SeatType type;
}

