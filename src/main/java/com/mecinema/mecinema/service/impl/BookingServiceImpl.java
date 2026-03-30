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
import com.mecinema.mecinema.repo.BookingRepository;
import com.mecinema.mecinema.repo.PaymentRepository;
import com.mecinema.mecinema.repo.SeatRepository;
import com.mecinema.mecinema.repo.ShowtimeRepository;
import com.mecinema.mecinema.repo.UserRepository;
import com.mecinema.mecinema.service.BookingService;
import com.mecinema.mecinema.service.PricingService;
import com.mecinema.mecinema.service.support.BookingFactory;
import com.mecinema.mecinema.service.support.FoodSelectionService;
import com.mecinema.mecinema.service.support.SeatSelectionValidator;
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
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final PricingService pricingService;
    private final BookingMapper bookingMapper;
    private final SeatSelectionValidator seatSelectionValidator;
    private final FoodSelectionService foodSelectionService;
    private final BookingFactory bookingFactory;

    @Override
    @Transactional
    public BookingResponse createBooking(Long userId, BookingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Showtime showtime = showtimeRepository.findWithDetailsById(request.showtimeId())
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found"));

        seatSelectionValidator.validateSelection(showtime, request.seatIds());

        List<Seat> lockedSeats = seatRepository.findAllByIdForUpdate(request.seatIds());
        if (lockedSeats.size() != request.seatIds().size()) {
            throw new ResourceNotFoundException("One or more seats are invalid");
        }

        seatSelectionValidator.ensureSeatsBelongToRoom(showtime, lockedSeats);
        seatSelectionValidator.ensureSeatsAreFree(showtime, request.seatIds());

        Booking booking = bookingFactory.createPendingBooking(user, showtime);

        BigDecimal seatTotal = BigDecimal.ZERO;
        Set<Ticket> tickets = new LinkedHashSet<>();
        for (Seat seat : lockedSeats) {
            BigDecimal seatPrice = pricingService.calculateSeatPrice(showtime.getBasePrice(), seat.getType());
            Ticket ticket = bookingFactory.createTicket(booking, seat, seatPrice);
            tickets.add(ticket);
            seatTotal = seatTotal.add(seatPrice);
        }
        booking.setTickets(tickets);

        Set<BookingFood> bookingFoods = foodSelectionService.buildBookingFoods(booking, request);
        BigDecimal foodTotal = bookingFoods.stream()
                .map(food -> food.getPrice().multiply(BigDecimal.valueOf(food.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        booking.setBookingFoods(bookingFoods);

        booking.setTotalPrice(seatTotal.add(foodTotal));

        Booking saved = bookingRepository.save(booking);
        return bookingMapper.toResponse(saved, Optional.empty());
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBooking(Long userId, Long bookingId) {
        Booking booking = bookingRepository.findByIdAndUserId(bookingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        Optional<Payment> payment = paymentRepository.findByBookingId(bookingId);
        return bookingMapper.toResponse(booking, payment);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponse> getBookingHistory(Long userId, Pageable pageable) {
        Page<Booking> bookings = bookingRepository.findByUserIdOrderByBookingTimeDesc(userId, pageable);
        List<Long> bookingIds = bookings.stream().map(Booking::getId).toList();
        Map<Long, Payment> paymentMap = bookingIds.isEmpty()
                ? Collections.emptyMap()
                : paymentRepository.findByBookingIdIn(bookingIds).stream()
                .collect(Collectors.toMap(payment -> payment.getBooking().getId(), payment -> payment));
        return bookings.map(booking -> bookingMapper.toResponse(booking, Optional.ofNullable(paymentMap.get(booking.getId()))));
    }

}

