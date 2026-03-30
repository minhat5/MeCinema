package com.mecinema.mecinema.service.impl;

import com.mecinema.mecinema.exception.ResourceNotFoundException;
import com.mecinema.mecinema.mapper.BookingMapper;
import com.mecinema.mecinema.model.dto.booking.BookingRequest;
import com.mecinema.mecinema.model.dto.booking.BookingResponse;
import com.mecinema.mecinema.model.entity.Booking;
import com.mecinema.mecinema.model.entity.BookingFood;
import com.mecinema.mecinema.model.entity.Payment;
import com.mecinema.mecinema.model.entity.Seat;
import com.mecinema.mecinema.model.entity.Showtime;
import com.mecinema.mecinema.model.entity.Ticket;
import com.mecinema.mecinema.model.entity.User;
import com.mecinema.mecinema.repo.*;
import com.mecinema.mecinema.service.BookingService;
import com.mecinema.mecinema.service.PricingService;
import com.mecinema.mecinema.service.support.BookingFactory;
import com.mecinema.mecinema.service.support.FoodSelectionService;
import com.mecinema.mecinema.service.support.SeatSelectionValidator;
import com.mecinema.mecinema.service.support.TicketSelectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ShowtimeRepository showtimeRepository;
    private final UserRepo userRepo;
    private final PaymentRepository paymentRepository;
    private final BookingMapper bookingMapper;
    private final FoodSelectionService foodSelectionService;
    private final BookingFactory bookingFactory;
    private final TicketSelectionService ticketSelectionService;

    @Override
    @Transactional
    public BookingResponse createBooking(Long userId, BookingRequest request) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Showtime showtime = showtimeRepository.findWithDetailsById(request.showtimeId())
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found"));

        Booking booking = bookingFactory.createPendingBooking(user, showtime);

        TicketSelectionService.TicketSelectionResult ticketResult = ticketSelectionService.createTicketsAndCalculateTotal(booking, showtime, request.seatIds());
        booking.setTickets(ticketResult.tickets());

        Set<BookingFood> bookingFoods = foodSelectionService.buildBookingFoods(booking, request);
        BigDecimal foodTotal = bookingFoods.stream()
                .map(food -> food.getPrice().multiply(BigDecimal.valueOf(food.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        booking.setBookingFoods(bookingFoods);

        booking.setTotalPrice(ticketResult.totalSeatPrice().add(foodTotal));

        Booking saved = bookingRepository.save(booking);
        return bookingMapper.toResponse(saved, Optional.empty());
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBooking(Long userId, Long bookingId) {
        Booking booking = bookingRepository.findByIdAndUserId(bookingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        Optional<Payment> payment = paymentRepository.findFirstByBookingIdOrderByCreatedAtDesc(bookingId);
        return bookingMapper.toResponse(booking, payment);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponse> getBookingHistory(Long userId, Pageable pageable) {
        Page<Booking> bookings = bookingRepository.findByUserIdOrderByBookingTimeDesc(userId, pageable);
        List<Long> bookingIds = bookings.stream().map(Booking::getId).toList();
        
        Map<Long, Payment> paymentMap = Collections.emptyMap();
        if (!bookingIds.isEmpty()) {
            List<Payment> payments = paymentRepository.findByBookingIdInOrderByCreatedAtDesc(bookingIds);
            paymentMap = payments.stream()
                .collect(Collectors.toMap(
                    payment -> payment.getBooking().getId(),
                    payment -> payment,
                    (existing, replacement) -> existing // keep first (newest)
                ));
        }
        
        Map<Long, Payment> finalPaymentMap = paymentMap;
        return bookings.map(booking -> bookingMapper.toResponse(booking, Optional.ofNullable(finalPaymentMap.get(booking.getId()))));
    }

}
