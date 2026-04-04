package com.mecinema.mecinema.model.dto.seats;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatMapLayoutDto {
    private Long roomId;
    private String roomName;
    private Set<String> rowSymbols;
    private Integer maxSeatNumberPerRow;
    private List<SeatDto> seats;
    private SeatLayoutStats stats;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SeatLayoutStats {
        private Integer totalSeats;
        private Integer normalSeats;
        private Integer vipSeats;
        private Integer sweetboxSeats;
    }
}

