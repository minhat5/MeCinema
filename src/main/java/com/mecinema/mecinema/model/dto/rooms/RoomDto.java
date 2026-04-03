package com.mecinema.mecinema.model.dto.rooms;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

//DTO để trả về thông tin phòng chiếu
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class RoomDto {
    private Long id;
    private Long cinemaId;
    private String cinemaName;
    private String name;
    private Integer totalSeats;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}

