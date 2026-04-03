package com.mecinema.mecinema.model.dto.showtimes;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateShowtimeRequest {
    
    @NotNull(message = "Movie ID không được để trống")
    @Positive(message = "Movie ID phải là số dương")
    private Long movieId;
    
    @NotNull(message = "Room ID không được để trống")
    @Positive(message = "Room ID phải là số dương")
    private Long roomId;
    
    @NotNull(message = "Thời gian bắt đầu không được để trống")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;
    
    @NotNull(message = "Thời gian kết thúc không được để trống")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;
    
    @NotNull(message = "Giá vé không được để trống")
    @Positive(message = "Giá vé phải là số dương")
    private BigDecimal basePrice;
}

