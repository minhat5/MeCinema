package com.mecinema.mecinema.controller.booking;

import com.mecinema.mecinema.model.dto.seats.SeatMapLayoutDto;
import com.mecinema.mecinema.service.SeatManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class SeatMapController {

    private final SeatManagementService seatManagementService;

    /**
     * Lấy sơ đồ ghế của phòng chiếu (public endpoint)
     * GET: /api/rooms/{roomId}/seat-map
     */
    @GetMapping("/{roomId}/seat-map")
    public ResponseEntity<SeatMapLayoutDto> getSeatMapLayout(@PathVariable Long roomId) {
        SeatMapLayoutDto layoutDto = seatManagementService.getSeatMapLayout(roomId);
        return ResponseEntity.status(HttpStatus.OK).body(layoutDto);
    }
}

