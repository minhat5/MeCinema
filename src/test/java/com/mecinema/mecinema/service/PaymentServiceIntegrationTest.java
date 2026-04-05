package com.mecinema.mecinema.service;

import com.mecinema.mecinema.exception.BookingException;
import com.mecinema.mecinema.model.dto.booking.BookingRequest;
import com.mecinema.mecinema.model.dto.booking.BookingResponse;
import com.mecinema.mecinema.model.dto.payment.PaymentCallbackRequest;
import com.mecinema.mecinema.model.dto.payment.PaymentInitRequest;
import com.mecinema.mecinema.model.dto.payment.PaymentInitResponse;
import com.mecinema.mecinema.model.entity.*;
import com.mecinema.mecinema.model.enumtype.MovieStatus;
import com.mecinema.mecinema.model.enumtype.PaymentMethod;
import com.mecinema.mecinema.model.enumtype.RoleUser;
import com.mecinema.mecinema.model.enumtype.SeatType;
import com.mecinema.mecinema.model.enumtype.Status;
import com.mecinema.mecinema.payment.PaymentGatewayClient;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;


@SpringBootTest
@ActiveProfiles("test")
@Transactional
class PaymentServiceIntegrationTest {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private TestPaymentGatewayClient paymentGatewayClient;

    private Long userId;
    private Long showtimeId;
    private Long seatId;

    @BeforeEach
    void setUp() {
        Role role = new Role();
        role.setName(RoleUser.CUSTOMER);
        entityManager.persist(role);

        User user = new User();
        user.setEmail("payment@example.com");
        user.setPassword("secret");
        user.setFullName("Payment User");
        user.setRole(role);
        entityManager.persist(user);

        Cinema cinema = new Cinema();
        cinema.setName("Cinema 2");
        cinema.setAddress("456 Street");
        cinema.setHotline("0987654321");
        entityManager.persist(cinema);

        Room room = new Room();
        room.setCinema(cinema);
        room.setName("Room 2");
        entityManager.persist(room);

        Seat seat = new Seat();
        seat.setRoom(room);
        seat.setRowSymbol("B");
        seat.setSeatNumber(5);
        seat.setType(SeatType.NORMAL);
        entityManager.persist(seat);

        Movie movie = new Movie();
        movie.setTitle("Movie 2");
        movie.setDescription("Description");
        movie.setDurationMinutes(100);
        movie.setReleaseDate(LocalDate.now());
        movie.setStatus(MovieStatus.UPCOMING);
        entityManager.persist(movie);

        Showtime showtime = new Showtime();
        showtime.setMovie(movie);
        showtime.setRoom(room);
        showtime.setStartTime(LocalDateTime.now().plusDays(1));
        showtime.setEndTime(LocalDateTime.now().plusDays(1).plusHours(2));
        showtime.setBasePrice(BigDecimal.valueOf(90000));
        entityManager.persist(showtime);

        entityManager.flush();

        this.userId = user.getId();
        this.showtimeId = showtime.getId();
        this.seatId = seat.getId();
    }

    @Test
    void handleCallbackShouldMarkBookingSuccessWhenSignatureValid() {
        BookingResponse booking = bookingService.createBooking(userId,
                new BookingRequest(showtimeId, List.of(seatId), List.of()));

        PaymentInitResponse initResponse = paymentService.initPayment(userId, booking.bookingId(),
                new PaymentInitRequest(PaymentMethod.SEPAY, null));

        paymentGatewayClient.setSignatureResult(true);

        PaymentCallbackRequest callbackRequest = new PaymentCallbackRequest(
                1L,
                "sepay",
                "2023-01-01 12:00:00",
                "123456789",
                null,
                BigDecimal.valueOf(90000),
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                "CODE",
                "Transfer for booking",
                initResponse.transactionNo(),
                "body",
                BigDecimal.valueOf(90000),
                BigDecimal.ZERO,
                BigDecimal.valueOf(90000), // transferAmount exactly matching standard price in test
                "IN"
        );

        paymentService.handleCallback(callbackRequest, "valid-token");

        BookingResponse updated = bookingService.getBooking(userId, booking.bookingId());
        assertEquals(Status.SUCCESS, updated.bookingStatus());
    }

    @Test
    void handleCallbackShouldRejectInvalidSignature() {
        BookingResponse booking = bookingService.createBooking(userId,
                new BookingRequest(showtimeId, List.of(seatId), List.of()));

        PaymentInitResponse initResponse = paymentService.initPayment(userId, booking.bookingId(),
                new PaymentInitRequest(PaymentMethod.SEPAY, null));

        paymentGatewayClient.setSignatureResult(false);

        PaymentCallbackRequest callbackRequest = new PaymentCallbackRequest(
                1L,
                "sepay",
                "2023-01-01 12:00:00",
                "123456789",
                null,
                BigDecimal.valueOf(90000),
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                "CODE",
                "Transfer for booking",
                initResponse.transactionNo(),
                "body",
                BigDecimal.valueOf(90000),
                BigDecimal.ZERO,
                BigDecimal.valueOf(90000),
                "IN"
        );

        assertThrows(BookingException.class, () -> paymentService.handleCallback(callbackRequest, "invalid"));
    }

    @Test
    void initPayment_and_handleCallback_success() {
        BookingResponse booking = bookingService.createBooking(userId,
                new BookingRequest(showtimeId, List.of(seatId), List.of()));
        PaymentInitRequest initRequest = new PaymentInitRequest(PaymentMethod.SEPAY, null);
        PaymentInitResponse initResponse = paymentService.initPayment(userId, booking.bookingId(), initRequest);

        paymentGatewayClient.setSignatureResult(true);

        PaymentCallbackRequest callbackRequest = new PaymentCallbackRequest(
                1L,
                "sepay",
                "2023-01-01 12:00:00",
                "123456789",
                null,
                BigDecimal.valueOf(150000),
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                "CODE",
                "Transfer for booking",
                initResponse.transactionNo(),
                "body",
                BigDecimal.valueOf(150000),
                BigDecimal.ZERO,
                BigDecimal.valueOf(150000), // transferAmount exactly matching standard price in test
                "IN"
        );

        paymentService.handleCallback(callbackRequest, "test-token");

        Payment payment = entityManager.createQuery("SELECT p FROM Payment p WHERE p.transactionNo = :transactionNo", Payment.class)
                .setParameter("transactionNo", initResponse.transactionNo())
                .getSingleResult();
        assertEquals(Status.SUCCESS, payment.getStatus());

        Booking dbBooking = entityManager.createQuery("SELECT b FROM Booking b WHERE b.id = :id", Booking.class)
                .setParameter("id", booking.bookingId())
                .getSingleResult();
        assertEquals(Status.SUCCESS, dbBooking.getStatus());
    }

    @Test
    void handleCallback_invalidSignature_throwsException() {
        BookingResponse booking = bookingService.createBooking(userId,
                new BookingRequest(showtimeId, List.of(seatId), List.of()));
        PaymentInitRequest initRequest = new PaymentInitRequest(PaymentMethod.SEPAY, null);
        PaymentInitResponse initResponse = paymentService.initPayment(userId, booking.bookingId(), initRequest);

        paymentGatewayClient.setSignatureResult(false);

        PaymentCallbackRequest callbackRequest = new PaymentCallbackRequest(
                1L,
                "sepay",
                "2023-01-01 12:00:00",
                "123456789",
                null,
                BigDecimal.valueOf(150000),
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                "CODE",
                "Transfer for booking",
                initResponse.transactionNo(),
                "body",
                BigDecimal.valueOf(150000),
                BigDecimal.ZERO,
                BigDecimal.valueOf(150000),
                "IN"
        );

        assertThrows(BookingException.class, () -> paymentService.handleCallback(callbackRequest, "invalid-token"));

        Payment payment = entityManager.createQuery("SELECT p FROM Payment p WHERE p.transactionNo = :transactionNo", Payment.class)
                .setParameter("transactionNo", initResponse.transactionNo())
                .getSingleResult();
        assertEquals(Status.PENDING, payment.getStatus());

        Booking dbBooking = entityManager.createQuery("SELECT b FROM Booking b WHERE b.id = :id", Booking.class)
                .setParameter("id", booking.bookingId())
                .getSingleResult();
        assertEquals(Status.PENDING, dbBooking.getStatus());
    }

    @Test
    void initPayment_multipleAttempts_shouldReuseExistingPendingPayment() {
        BookingResponse booking = bookingService.createBooking(userId,
                new BookingRequest(showtimeId, List.of(seatId), List.of()));

        // Lần đầu vào trang: tạo mới Payment
        PaymentInitResponse initResponse1 = paymentService.initPayment(userId, booking.bookingId(),
                new PaymentInitRequest(PaymentMethod.SEPAY, null));

        // Lần thứ 2 (StrictMode / re-render): phải trả về cùng transactionNo
        PaymentInitResponse initResponse2 = paymentService.initPayment(userId, booking.bookingId(),
                new PaymentInitRequest(PaymentMethod.SEPAY, null));

        assertEquals(initResponse1.transactionNo(), initResponse2.transactionNo(),
                "Lần gọi thứ 2 không được tạo Payment mới — phải tái sử dụng Payment PENDING đã có");

        List<Payment> payments = entityManager.createQuery("SELECT p FROM Payment p WHERE p.booking.id = :bookingId", Payment.class)
                .setParameter("bookingId", booking.bookingId())
                .getResultList();
        assertEquals(1, payments.size(), "Chỉ được có 1 Payment record cho booking");
    }

    @Test
    void initPayment_withRegenerate_shouldCreateNewPayment() {
        BookingResponse booking = bookingService.createBooking(userId,
                new BookingRequest(showtimeId, List.of(seatId), List.of()));

        // Lần đầu: tạo Payment bình thường
        PaymentInitResponse initResponse1 = paymentService.initPayment(userId, booking.bookingId(),
                new PaymentInitRequest(PaymentMethod.SEPAY, null));

        // User bấm "Tạo lại mã" (regenerate=true): phải tạo Payment mới
        PaymentInitResponse initResponse2 = paymentService.initPayment(userId, booking.bookingId(),
                new PaymentInitRequest(PaymentMethod.SEPAY, true));

        org.junit.jupiter.api.Assertions.assertNotEquals(initResponse1.transactionNo(), initResponse2.transactionNo(),
                "Khi regenerate=true phải tạo transactionNo mới");

        List<Payment> payments = entityManager.createQuery("SELECT p FROM Payment p WHERE p.booking.id = :bookingId", Payment.class)
                .setParameter("bookingId", booking.bookingId())
                .getResultList();
        assertEquals(2, payments.size());
    }

    @TestConfiguration
    static class PaymentTestConfig {
        @Bean
        @Primary
        TestPaymentGatewayClient paymentGatewayClient() {
            return new TestPaymentGatewayClient();
        }
    }

    static class TestPaymentGatewayClient implements PaymentGatewayClient {

        private boolean signatureResult = true;
        private PaymentRedirect paymentRedirect = new PaymentRedirect("https://sandbox", 900);

        void setSignatureResult(boolean signatureResult) {
            this.signatureResult = signatureResult;
        }

        void setPaymentRedirect(PaymentRedirect paymentRedirect) {
            this.paymentRedirect = paymentRedirect;
        }

        @Override
        public PaymentRedirect initCheckout(Payment payment) {
            return paymentRedirect;
        }

        @Override
        public boolean verifySignature(String payload, String signature) {
            return signatureResult;
        }
    }
}
