package com.mecinema.mecinema.service.support;

import com.mecinema.mecinema.exception.ResourceNotFoundException;
import com.mecinema.mecinema.model.entity.Booking;
import com.mecinema.mecinema.model.entity.Seat;
import com.mecinema.mecinema.model.entity.Showtime;
import com.mecinema.mecinema.model.entity.Ticket;
import com.mecinema.mecinema.repo.SeatRepository;
import com.mecinema.mecinema.service.PricingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TicketSelectionService {
    
    private final SeatRepository seatRepository;
    private final SeatSelectionValidator seatSelectionValidator;
    private final PricingService pricingService;
    private final BookingFactory bookingFactory;

    public record TicketSelectionResult(Set<Ticket> tickets, BigDecimal totalSeatPrice) {}

    public TicketSelectionResult createTicketsAndCalculateTotal(Booking booking, Showtime showtime, List<Long> seatIds) {
        seatSelectionValidator.validateSelection(showtime, seatIds);

        List<Seat> lockedSeats = seatRepository.findAllByIdForUpdate(seatIds);
        if (lockedSeats.size() != seatIds.size()) {
            throw new ResourceNotFoundException("One or more seats are invalid");
        }

        seatSelectionValidator.ensureSeatsBelongToRoom(showtime, lockedSeats);
        seatSelectionValidator.ensureSeatsAreFree(showtime, seatIds);

        BigDecimal seatTotal = BigDecimal.ZERO;
        Set<Ticket> tickets = new LinkedHashSet<>();
        for (Seat seat : lockedSeats) {
            BigDecimal seatPrice = pricingService.calculateSeatPrice(showtime.getBasePrice(), seat.getType());
            Ticket ticket = bookingFactory.createTicket(booking, seat, seatPrice);
            tickets.add(ticket);
            seatTotal = seatTotal.add(seatPrice);
        }
        
        return new TicketSelectionResult(tickets, seatTotal);
    }
}
