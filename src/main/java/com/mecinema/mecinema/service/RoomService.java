package com.mecinema.mecinema.service;

import com.mecinema.mecinema.model.dto.CreateRoomDto;
import com.mecinema.mecinema.model.dto.RoomDto;
import com.mecinema.mecinema.model.dto.UpdateRoomDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RoomService {
    
    //Tạo phòng chiếu mới
    RoomDto createRoom(CreateRoomDto createRoomDto);

    //Lấy danh sách phòng theo chi nhánh (có phân trang)
    Page<RoomDto> getRoomsByCinema(Long cinemaId, Pageable pageable);

     //Lấy chi tiết một phòng
    RoomDto getRoomById(Long roomId);

     //Cập nhật thông tin phòng
    RoomDto updateRoom(Long roomId, UpdateRoomDto updateRoomDto);
    
    //Xóa phòng (có check constraint)
    void deleteRoom(Long roomId);
    
    // Kiểm tra phòng có tồn tại không
    boolean existsById(Long roomId);
}
