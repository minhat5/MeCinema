package com.mecinema.mecinema.service;

import com.mecinema.mecinema.exception.SeatAlreadyBookedException;
import com.mecinema.mecinema.model.dto.booking.BookingRequest;
import com.mecinema.mecinema.model.entity.*;
import com.mecinema.mecinema.model.enumtype.MovieStatus;
import com.mecinema.mecinema.model.enumtype.RoleUser;
import com.mecinema.mecinema.model.enumtype.SeatType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class BookingServiceIntegrationTest {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private EntityManager entityManager;

    private Long showtimeId;
    private Long userAId;
    private Long userBId;
    private List<Long> seatIds;

    @BeforeEach
    void setUp() {
        Role role = new Role();
        role.setName(RoleUser.CUSTOMER);
        entityManager.persist(role);

        User userA = new User();
        userA.setEmail("userA@example.com");
        userA.setPassword("secret");
        userA.setFullName("User A");
        userA.setRole(role);
        entityManager.persist(userA);

        User userB = new User();
        userB.setEmail("userB@example.com");
        userB.setPassword("secret");
        userB.setFullName("User B");
        userB.setRole(role);
        entityManager.persist(userB);

        Cinema cinema = new Cinema();
        cinema.setName("Cinema 1");
        cinema.setAddress("123 Street");
        cinema.setHotline("0123456789");
        entityManager.persist(cinema);

        Room room = new Room();
        room.setCinema(cinema);
        room.setName("Room 1");
        entityManager.persist(room);

        Seat seat1 = new Seat();
        seat1.setRoom(room);
        seat1.setRowSymbol("A");
        seat1.setSeatNumber(1);
        seat1.setType(SeatType.NORMAL);
        entityManager.persist(seat1);

        Seat seat2 = new Seat();
        seat2.setRoom(room);
        seat2.setRowSymbol("A");
        seat2.setSeatNumber(2);
        seat2.setType(SeatType.VIP);
        entityManager.persist(seat2);

        Movie movie = new Movie();
        movie.setTitle("Movie 1");
        movie.setDescription("Description");
        movie.setDurationMinutes(120);
        movie.setReleaseDate(LocalDate.now());
        movie.setStatus(MovieStatus.UPCOMING);
        entityManager.persist(movie);

        Showtime showtime = new Showtime();
        showtime.setMovie(movie);
        showtime.setRoom(room);
        showtime.setStartTime(LocalDateTime.now().plusDays(1));
        showtime.setEndTime(LocalDateTime.now().plusDays(1).plusHours(2));
        showtime.setBasePrice(BigDecimal.valueOf(100000));
        entityManager.persist(showtime);

        entityManager.flush();

        this.showtimeId = showtime.getId();
        this.userAId = userA.getId();
        this.userBId = userB.getId();
        this.seatIds = new ArrayList<>();
        seatIds.add(seat1.getId());
        seatIds.add(seat2.getId());
    }

    @Test
    void shouldPreventDoubleBookingForSameSeats() {
        BookingRequest firstRequest = new BookingRequest(showtimeId, seatIds, List.of());
        bookingService.createBooking(userAId, firstRequest);

        BookingRequest secondRequest = new BookingRequest(showtimeId, seatIds, List.of());
        assertThrows(SeatAlreadyBookedException.class,
                () -> bookingService.createBooking(userBId, secondRequest));
    }
}

