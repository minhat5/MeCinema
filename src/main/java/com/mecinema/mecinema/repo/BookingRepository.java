package com.mecinema.mecinema.repo;

import com.mecinema.mecinema.model.entity.Booking;
import com.mecinema.mecinema.model.enumtype.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface BookingRepository extends JpaRepository<Booking, Long>, BookingRepositoryExtended {


    @Modifying
    @Query("UPDATE Booking b SET b.status = :newStatus WHERE b.status = :currentStatus AND b.bookingTime <= :timeoutAt")
    int updateStatusForOldBookings(@Param("currentStatus") Status currentStatus,
                                   @Param("newStatus") Status newStatus,
                                   @Param("timeoutAt") LocalDateTime timeoutAt);
}