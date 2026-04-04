package com.mecinema.mecinema.controller.admin;

import com.mecinema.mecinema.model.dto.ApiResponse;
import com.mecinema.mecinema.model.dto.seats.*;
import com.mecinema.mecinema.service.SeatManagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/seats")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminSeatController {

    private final SeatManagementService seatManagementService;

    //Tạo một ghế mới POST: /api/admin/seats
    @PostMapping
    public ResponseEntity<ApiResponse<SeatDto>> createSeat(
            @Valid @RequestBody CreateSeatDto createSeatDto) {
        SeatDto seatDto = seatManagementService.createSeat(createSeatDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(
                        HttpStatus.CREATED.value(),
                        "Tạo ghế thành công",
                        seatDto
                )
        );
    }

    // Tạo nhiều ghế cùng lúc POST: /api/admin/seats/bulk
    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<List<SeatDto>>> createSeatsInBulk(
            @Valid @RequestBody BulkCreateSeatsDto bulkCreateSeatsDto) {
        List<SeatDto> seatDtos = seatManagementService.createSeatsInBulk(bulkCreateSeatsDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>(
                        HttpStatus.CREATED.value(),
                        String.format("Tạo %d ghế thành công", seatDtos.size()),
                        seatDtos
                )
        );
    }

    //Lấy danh sách ghế theo phòng GET: /api/admin/seats?roomId=1&page=0&size=10
    @GetMapping
    public ResponseEntity<ApiResponse<Page<SeatDto>>> getSeatsByRoom(
            @RequestParam Long roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SeatDto> seats = seatManagementService.getSeatsByRoom(roomId, pageable);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Lấy danh sách ghế thành công",
                        seats
                )
        );
    }

    // Lấy sơ đồ ghế của phòng chiếu GET: /api/admin/seats/layout/{roomId}
    @GetMapping("/layout/{roomId}")
    public ResponseEntity<ApiResponse<SeatMapLayoutDto>> getSeatMapLayout(
            @PathVariable Long roomId) {
        SeatMapLayoutDto layoutDto = seatManagementService.getSeatMapLayout(roomId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Lấy sơ đồ ghế thành công",
                        layoutDto
                )
        );
    }

    //Lấy chi tiết một ghế GET: /api/admin/seats/{seatId}
    @GetMapping("/{seatId}")
    public ResponseEntity<ApiResponse<SeatDto>> getSeatById(
            @PathVariable Long seatId) {
        SeatDto seatDto = seatManagementService.getSeatById(seatId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Lấy thông tin ghế thành công",
                        seatDto
                )
        );
    }

    // Cập nhật thông tin ghế PATCH: /api/admin/seats/{seatId}
    @PatchMapping("/{seatId}")
    public ResponseEntity<ApiResponse<SeatDto>> updateSeat(
            @PathVariable Long seatId,
            @Valid @RequestBody UpdateSeatDto updateSeatDto) {
        SeatDto seatDto = seatManagementService.updateSeat(seatId, updateSeatDto);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Cập nhật ghế thành công",
                        seatDto
                )
        );
    }

    // Xóa một ghế DELETE: /api/admin/seats/{seatId}
    @DeleteMapping("/{seatId}")
    public ResponseEntity<ApiResponse<Void>> deleteSeat(
            @PathVariable Long seatId) {
        seatManagementService.deleteSeat(seatId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Xóa ghế thành công",
                        null
                )
        );
    }

    //Xóa tất cả ghế của một phòng DELETE: /api/admin/seats/room/{roomId}
    @DeleteMapping("/room/{roomId}")
    public ResponseEntity<ApiResponse<Void>> deleteAllSeatsByRoom(
            @PathVariable Long roomId) {
        seatManagementService.deleteAllSeatsByRoom(roomId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Xóa tất cả ghế của phòng thành công",
                        null
                )
        );
    }
}

