package com.mecinema.mecinema.service;

import com.mecinema.mecinema.model.dto.seats.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SeatManagementService {
    
    //Tạo một ghế mới trong phòng chiếu
    SeatDto createSeat(CreateSeatDto createSeatDto);
    
    //Tạo hàng ghế (nhiều ghế cùng lúc)
    List<SeatDto> createSeatsInBulk(BulkCreateSeatsDto bulkCreateSeatsDto);
    
    //Lấy danh sách ghế theo phòng (có phân trang)
    Page<SeatDto> getSeatsByRoom(Long roomId, Pageable pageable);
    
    //Lấy sơ đồ ghế của phòng chiếu
    SeatMapLayoutDto getSeatMapLayout(Long roomId);
    
    //Lấy chi tiết một ghế
    SeatDto getSeatById(Long seatId);
    
    //Cập nhật thông tin ghế (chủ yếu loại ghế)
    SeatDto updateSeat(Long seatId, UpdateSeatDto updateSeatDto);
    
    //Xóa một ghế
    void deleteSeat(Long seatId);
    
    //Xóa tất cả ghế của một phòng
    void deleteAllSeatsByRoom(Long roomId);
    
    //Kiểm tra xem ghế đã tồn tại chưa
    boolean seatExists(Long roomId, String rowSymbol, Integer seatNumber);
}

