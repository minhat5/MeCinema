package com.mecinema.mecinema.model.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

//DTO để tạo phòng chiếu mới
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateRoomDto {
    
    @NotNull(message = "ID chi nhánh không được để trống")
    @Positive(message = "ID chi nhánh phải là số dương")
    private Long cinemaId;
    
    @NotBlank(message = "Tên phòng không được để trống")
    @Size(min = 1, max = 100, message = "Tên phòng phải từ 1 đến 100 ký tự")
    private String name;
}

