package com.mecinema.mecinema.service;

import com.mecinema.mecinema.config.BookingProperties;
import com.mecinema.mecinema.model.enumtype.Status;
import com.mecinema.mecinema.repo.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingCleanupService {

    private final BookingRepository bookingRepository;
    private final BookingProperties bookingProperties;

    @Scheduled(fixedRateString = "${mecinema.booking.cleanup-rate:60000}")
    @Transactional
    public void cancelExpiredBookings() {
        int expiryMinutes = bookingProperties.getPending().getExpiryMinutes();
        LocalDateTime timeoutAt = LocalDateTime.now().minusMinutes(expiryMinutes);
        int updatedCount = bookingRepository.updateStatusForOldBookings(Status.PENDING, Status.FAILED, timeoutAt);
        if (updatedCount > 0) {
            log.info("Cancelled {} expired pending bookings older than {} minutes", updatedCount, expiryMinutes);
        }
    }
}

