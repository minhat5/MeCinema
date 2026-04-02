package com.mecinema.mecinema.controller.admin;

import com.mecinema.mecinema.model.dto.*;
import com.mecinema.mecinema.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {
    
    private final RoomService roomService;
    
    //Tạo phòng chiếu mới
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RoomDto>> createRoom(
            @Valid @RequestBody CreateRoomDto createRoomDto) {
        RoomDto roomDto = roomService.createRoom(createRoomDto);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(
                        HttpStatus.CREATED.value(),
                        "Tạo phòng chiếu thành công",
                        roomDto
                )
        );
    }
    
    // Lấy danh sách phòng theo chi nhánh GET: /api/rooms?cinemaId=1&page=1&limit=10
    @GetMapping
    public ResponseEntity<ApiResponse<Page<RoomDto>>> getRoomsByCinema(
            @RequestParam Long cinemaId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        
        Pageable pageable = PageRequest.of(page, limit);
        Page<RoomDto> rooms = roomService.getRoomsByCinema(cinemaId, pageable);
        
        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Lấy danh sách phòng thành công",
                        rooms
                )
        );
    }
    
    //Lấy chi tiết một phòng GET: /api/v1/rooms/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomDto>> getRoomById(
            @PathVariable Long id) {
        RoomDto roomDto = roomService.getRoomById(id);
        
        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Lấy thông tin phòng thành công",
                        roomDto
                )
        );
    }
    
    //Cập nhật thông tin phòng
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RoomDto>> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRoomDto updateRoomDto) {
        
        RoomDto roomDto = roomService.updateRoom(id, updateRoomDto);
        
        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Cập nhật phòng thành công",
                        roomDto
                )
        );
    }
    
    //Xóa phòng chiếu
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteRoom(
            @PathVariable Long id) {
        
        roomService.deleteRoom(id);
        
        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Xóa phòng thành công",
                        null
                )
        );
    }
}


