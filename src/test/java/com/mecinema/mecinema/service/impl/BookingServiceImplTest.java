package com.mecinema.mecinema.service.impl;

import com.mecinema.mecinema.exception.BookingException;
import com.mecinema.mecinema.exception.ResourceNotFoundException;
import com.mecinema.mecinema.mapper.BookingMapper;
import com.mecinema.mecinema.model.dto.booking.BookingRequest;
import com.mecinema.mecinema.model.dto.booking.BookingResponse;
import com.mecinema.mecinema.model.entity.Booking;
import com.mecinema.mecinema.model.entity.BookingFood;
import com.mecinema.mecinema.model.entity.Showtime;
import com.mecinema.mecinema.model.entity.User;
import com.mecinema.mecinema.model.enumtype.Status;
import com.mecinema.mecinema.repo.BookingRepository;
import com.mecinema.mecinema.repo.PaymentRepository;
import com.mecinema.mecinema.repo.ShowtimeRepository;
import com.mecinema.mecinema.repo.UserRepository;
import com.mecinema.mecinema.service.support.BookingFactory;
import com.mecinema.mecinema.service.support.FoodSelectionService;
import com.mecinema.mecinema.service.support.TicketSelectionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceImplTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private ShowtimeRepository showtimeRepository;

    @Mock
    private UserRepository userRepo;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private BookingMapper bookingMapper;

    @Mock
    private FoodSelectionService foodSelectionService;

    @Mock
    private BookingFactory bookingFactory;

    @Mock
    private TicketSelectionService ticketSelectionService;

    @InjectMocks
    private BookingServiceImpl bookingService;

    @Test
    void createBooking_whenUserDoesNotExist_throwsResourceNotFoundException() {
        BookingRequest request = new BookingRequest(10L, List.of(1L, 2L), List.of());

        when(userRepo.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookingService.createBooking(1L, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("User not found");

        verify(showtimeRepository, never()).findById(request.showtimeId());
        verify(bookingRepository, never()).save(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void createBooking_whenShowtimeDoesNotExist_throwsResourceNotFoundException() {
        User user = new User();
        BookingRequest request = new BookingRequest(10L, List.of(1L, 2L), List.of());

        when(userRepo.findById(1L)).thenReturn(Optional.of(user));
        when(showtimeRepository.findById(10L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bookingService.createBooking(1L, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Showtime not found");

        verify(bookingRepository, never()).save(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void createBooking_whenShowtimeAlreadyStarted_throwsBookingException() {
        User user = new User();
        Showtime showtime = new Showtime();
        showtime.setStartTime(LocalDateTime.now().minusMinutes(1));
        BookingRequest request = new BookingRequest(10L, List.of(1L, 2L), List.of());

        when(userRepo.findById(1L)).thenReturn(Optional.of(user));
        when(showtimeRepository.findById(10L)).thenReturn(Optional.of(showtime));

        assertThatThrownBy(() -> bookingService.createBooking(1L, request))
                .isInstanceOf(BookingException.class);

        verify(bookingRepository, never()).save(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void createBooking_whenRequestIsValid_createsBookingWithSeatTotalPlusFoodTotal() {
        User user = new User();
        Showtime showtime = new Showtime();
        showtime.setStartTime(LocalDateTime.now().plusHours(1));
        Booking booking = new Booking();
        BookingRequest request = new BookingRequest(
                10L,
                List.of(1L, 2L),
                List.of(new BookingRequest.FoodSelection(100L, 2))
        );
        TicketSelectionService.TicketSelectionResult ticketResult =
                new TicketSelectionService.TicketSelectionResult(Set.of(), BigDecimal.valueOf(200000));
        BookingFood bookingFood = new BookingFood();
        bookingFood.setPrice(BigDecimal.valueOf(30000));
        bookingFood.setQuantity(2);
        BookingResponse response = new BookingResponse(
                99L,
                Status.PENDING,
                BigDecimal.valueOf(260000),
                LocalDateTime.now(),
                null,
                List.of(),
                List.of(),
                null
        );

        when(userRepo.findById(1L)).thenReturn(Optional.of(user));
        when(showtimeRepository.findById(10L)).thenReturn(Optional.of(showtime));
        when(bookingFactory.createPendingBooking(user, showtime)).thenReturn(booking);
        when(ticketSelectionService.createTicketsAndCalculateTotal(booking, showtime, request.seatIds()))
                .thenReturn(ticketResult);
        when(foodSelectionService.buildBookingFoods(booking, request)).thenReturn(Set.of(bookingFood));
        when(bookingRepository.save(booking)).thenReturn(booking);
        when(bookingMapper.toResponse(booking, Optional.empty())).thenReturn(response);

        BookingResponse actual = bookingService.createBooking(1L, request);

        assertThat(booking.getTotalPrice()).isEqualByComparingTo(BigDecimal.valueOf(260000));
        assertThat(actual.totalPrice()).isEqualByComparingTo(BigDecimal.valueOf(260000));
        verify(bookingRepository).save(booking);
    }
}
