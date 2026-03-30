package com.mecinema.mecinema.repo;

import com.mecinema.mecinema.model.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long>, BookingRepositoryExtended {

    boolean existsByIdAndUserId(Long bookingId, Long userId);
}