package com.mecinema.mecinema.service;

import com.mecinema.mecinema.model.dto.booking.BookingRequest;
import com.mecinema.mecinema.model.dto.booking.BookingResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookingService {
    BookingResponse createBooking(Long userId, BookingRequest request);

    BookingResponse getBooking(Long userId, Long bookingId);

    Page<BookingResponse> getBookingHistory(Long userId, Pageable pageable);

    void cancelBooking(Long userId, Long bookingId);
}

