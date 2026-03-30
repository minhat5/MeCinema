package com.mecinema.mecinema.controller.booking;

import com.mecinema.mecinema.model.dto.booking.BookingRequest;
import com.mecinema.mecinema.model.dto.booking.BookingResponse;
import com.mecinema.mecinema.model.dto.booking.SeatAvailabilityResponse;
import com.mecinema.mecinema.service.BookingService;
import com.mecinema.mecinema.service.SeatAvailabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.mecinema.mecinema.security.CurrentUser;
import com.mecinema.mecinema.security.CustomUserDetails;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Validated
public class BookingController {

    private final BookingService bookingService;
    private final SeatAvailabilityService seatAvailabilityService;

    @GetMapping("/showtimes/{showtimeId}/seats")
    public SeatAvailabilityResponse getSeatAvailability(@PathVariable Long showtimeId) {
        return seatAvailabilityService.getSeatAvailability(showtimeId);
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @CurrentUser CustomUserDetails userDetails,
            @Valid @RequestBody BookingRequest request) {
        BookingResponse response = bookingService.createBooking(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{bookingId}")
    public BookingResponse getBooking(
            @CurrentUser CustomUserDetails userDetails,
            @PathVariable Long bookingId) {
        return bookingService.getBooking(userDetails.getId(), bookingId);
    }

    @GetMapping("/me")
    public Page<BookingResponse> getMyBookings(
            @CurrentUser CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookingService.getBookingHistory(userDetails.getId(), pageable);
    }
}
