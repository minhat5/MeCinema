package com.mecinema.mecinema.repo;

import com.mecinema.mecinema.model.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookingRepositoryExtended {
    Page<Booking> findByUserIdOrderByBookingTimeDesc(Long userId, Pageable pageable);

    Optional<Booking> findByIdAndUserId(Long bookingId, Long userId);
}