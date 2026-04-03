package com.mecinema.mecinema.model.dto.rooms;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//DTO để cập nhật thông tin phòng chiếu

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateRoomDto {
    
    @Size(min = 1, max = 100, message = "Tên phòng phải từ 1 đến 50 ký tự")
    private String name;
}

