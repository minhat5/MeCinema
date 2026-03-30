package com.mecinema.mecinema.repo;

import com.mecinema.mecinema.model.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface BookingRepositoryExtended {
    Page<Booking> findByUserIdOrderByBookingTimeDesc(Long userId, Pageable pageable);

    Optional<Booking> findByIdAndUserId(Long bookingId, Long userId);
}