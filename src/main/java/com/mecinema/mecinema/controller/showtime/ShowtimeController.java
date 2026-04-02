package com.mecinema.mecinema.controller.showtime;

import com.mecinema.mecinema.model.dto.*;
import com.mecinema.mecinema.service.ShowtimeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/showtimes")
@RequiredArgsConstructor
@Slf4j
public class ShowtimeController {
    
    private final ShowtimeService showtimeService;
    //Lấy thông tin lịch chiếu theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ShowtimeDTO>> getShowtimeById(@PathVariable Long id) {
        log.info("GET request to fetch showtime with id: {}", id);
        ShowtimeDTO showtime = showtimeService.getShowtimeById(id);
        return ResponseEntity.ok(new ApiResponse<>(
                HttpStatus.OK.value(),
                "Lịch chiếu lấy thành công",
                showtime
        ));
    }
     //Lấy tất cả lịch chiếu (có phân trang)
    @GetMapping
    public ResponseEntity<ApiResponse<PaginatedResponse<ShowtimeDTO>>> getAllShowtimes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "startTime") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        
        log.info("GET request to fetch all showtimes with page: {}, size: {}", page, size);
        
        Sort.Direction direction = Sort.Direction.fromString(sortDirection.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        PaginatedResponse<ShowtimeDTO> result = showtimeService.getAllShowtimes(pageable);
        
        return ResponseEntity.ok(new ApiResponse<>(
                HttpStatus.OK.value(),
                "Lấy danh sách lịch chiếu thành công",
                result
        ));
    }
    
    //Tạo mới lịch chiếu
    @PostMapping
    public ResponseEntity<ApiResponse<ShowtimeDTO>> createShowtime(
            @Valid @RequestBody CreateShowtimeRequest request) {
        
        log.info("POST request to create showtime for movie: {} and room: {}", 
                request.getMovieId(), request.getRoomId());
        
        ShowtimeDTO showtime = showtimeService.createShowtime(request);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                HttpStatus.CREATED.value(),
                "Lịch chiếu tạo mới thành công",
                showtime
        ));
    }
    
    //Cập nhật lịch chiếu
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ShowtimeDTO>> updateShowtime(
            @PathVariable Long id,
            @Valid @RequestBody UpdateShowtimeRequest request) {
        
        log.info("PUT request to update showtime with id: {}", id);
        
        ShowtimeDTO showtime = showtimeService.updateShowtime(id, request);
        
        return ResponseEntity.ok(new ApiResponse<>(
                HttpStatus.OK.value(),
                "Lịch chiếu cập nhật thành công",
                showtime
        ));
    }

     // Xóa lịch chiếu
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteShowtime(@PathVariable Long id) {
        log.info("DELETE request to delete showtime with id: {}", id);
        
        showtimeService.deleteShowtime(id);
        
        return ResponseEntity.ok(new ApiResponse<>(
                HttpStatus.OK.value(),
                "Lịch chiếu xóa thành công",
                null
        ));
    }
     //Lấy tất cả lịch chiếu của một bộ phim
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<ApiResponse<List<ShowtimeDTO>>> getShowtimesByMovie(@PathVariable Long movieId) {
        log.info("GET request to fetch showtimes for movie: {}", movieId);
        
        List<ShowtimeDTO> showtimes = showtimeService.getShowtimesByMovie(movieId);
        
        return ResponseEntity.ok(new ApiResponse<>(
                HttpStatus.OK.value(),
                "Lấy danh sách lịch chiếu của bộ phim thành công",
                showtimes
        ));
    }
    
    //Lấy tất cả lịch chiếu của một phòng chiếu
    @GetMapping("/room/{roomId}")
    public ResponseEntity<ApiResponse<List<ShowtimeDTO>>> getShowtimesByRoom(@PathVariable Long roomId) {
        log.info("GET request to fetch showtimes for room: {}", roomId);
        
        List<ShowtimeDTO> showtimes = showtimeService.getShowtimesByRoom(roomId);
        
        return ResponseEntity.ok(new ApiResponse<>(
                HttpStatus.OK.value(),
                "Lấy danh sách lịch chiếu của phòng chiếu thành công",
                showtimes
        ));
    }
     //Lấy lịch chiếu theo cinema có phân trang
    @GetMapping("/cinema/{cinemaId}")
    public ResponseEntity<ApiResponse<PaginatedResponse<ShowtimeDTO>>> getShowtimesByCinema(
            @PathVariable Long cinemaId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "startTime") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        
        log.info("GET request to fetch showtimes for cinema: {} with pagination", cinemaId);
        
        Sort.Direction direction = Sort.Direction.fromString(sortDirection.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        PaginatedResponse<ShowtimeDTO> result = showtimeService.getShowtimesByCinema(cinemaId, pageable);
        
        return ResponseEntity.ok(new ApiResponse<>(
                HttpStatus.OK.value(),
                "Lấy danh sách lịch chiếu của cụm rạp thành công",
                result
        ));
    }
    
    // Lấy lịch chiếu sắp tới trong 7 ngày
    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<PaginatedResponse<ShowtimeDTO>>> getUpcomingShowtimes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "startTime") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        
        log.info("GET request to fetch upcoming showtimes");
        
        Sort.Direction direction = Sort.Direction.fromString(sortDirection.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        PaginatedResponse<ShowtimeDTO> result = showtimeService.getUpcomingShowtimes(pageable);
        
        return ResponseEntity.ok(new ApiResponse<>(
                HttpStatus.OK.value(),
                "Lấy danh sách lịch chiếu sắp tới thành công",
                result
        ));
    }
    
    // Lấy lịch chiếu trong ngày
    @GetMapping("/date/{date}")
    public ResponseEntity<ApiResponse<List<ShowtimeDTO>>> getShowtimesOfDay(@PathVariable String date) {
        log.info("GET request to fetch showtimes for date: {}", date);
        
        LocalDate localDate = LocalDate.parse(date);
        List<ShowtimeDTO> showtimes = showtimeService.getShowtimesOfDay(localDate);
        
        return ResponseEntity.ok(new ApiResponse<>(
                HttpStatus.OK.value(),
                "Lấy danh sách lịch chiếu trong ngày thành công",
                showtimes
        ));
    }
}

