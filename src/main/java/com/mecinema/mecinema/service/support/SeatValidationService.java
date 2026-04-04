package com.mecinema.mecinema.service.support;

import com.mecinema.mecinema.exception.BookingException;
import com.mecinema.mecinema.repo.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SeatValidationService {

    private final SeatRepository seatRepository;

    /**
     * Validate that a seat doesn't already exist
     */
    public void validateSeatUniqueness(Long roomId, String rowSymbol, Integer seatNumber) {
        if (seatRepository.existsByRoomIdAndRowSymbolAndSeatNumber(roomId, rowSymbol, seatNumber)) {
            throw new BookingException(
                    String.format("Ghế hàng %s số %d đã tồn tại trong phòng này", rowSymbol, seatNumber)
            );
        }
    }
}

