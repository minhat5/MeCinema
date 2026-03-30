package com.mecinema.mecinema.service.impl;

import com.mecinema.mecinema.exception.ResourceNotFoundException;
import com.mecinema.mecinema.model.dto.booking.SeatAvailabilityResponse;
import com.mecinema.mecinema.model.entity.Seat;
import com.mecinema.mecinema.model.entity.Showtime;
import com.mecinema.mecinema.model.enumtype.SeatAvailabilityStatus;
import com.mecinema.mecinema.model.enumtype.Status;
import com.mecinema.mecinema.repo.SeatRepository;
import com.mecinema.mecinema.repo.ShowtimeRepository;
import com.mecinema.mecinema.repo.TicketRepository;
import com.mecinema.mecinema.service.SeatAvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SeatAvailabilityServiceImpl implements SeatAvailabilityService {

    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final TicketRepository ticketRepository;

    @Override
    public SeatAvailabilityResponse getSeatAvailability(Long showtimeId) {
        Showtime showtime = showtimeRepository.findWithDetailsById(showtimeId)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found"));

        List<Seat> seats = seatRepository.findByRoomIdOrderByRowSymbolAscSeatNumberAsc(showtime.getRoom().getId());

        Map<Long, SeatAvailabilityStatus> reservedSeats = new HashMap<>();
        ticketRepository.findSeatStatusesByShowtime(showtimeId)
                .forEach(view -> reservedSeats.put(view.getSeatId(), mapStatus(view.getBookingStatus())));

        List<SeatAvailabilityResponse.SeatInfo> seatInfos = seats.stream()
                .map(seat -> new SeatAvailabilityResponse.SeatInfo(
                        seat.getId(),
                        seat.getRowSymbol(),
                        seat.getSeatNumber(),
                        seat.getType(),
                        reservedSeats.getOrDefault(seat.getId(), SeatAvailabilityStatus.AVAILABLE)
                ))
                .collect(Collectors.toList());

        return new SeatAvailabilityResponse(
                showtimeId,
                showtime.getRoom().getId(),
                seatInfos
        );
    }

    private SeatAvailabilityStatus mapStatus(Status status) {
        return switch (status) {
            case SUCCESS -> SeatAvailabilityStatus.BOOKED;
            case PENDING -> SeatAvailabilityStatus.HELD;
            default -> SeatAvailabilityStatus.AVAILABLE;
        };
    }
}

