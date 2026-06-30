package com.mecinema.mecinema.service;

import com.mecinema.mecinema.exception.BookingException;
import com.mecinema.mecinema.exception.ResourceNotFoundException;
import com.mecinema.mecinema.mapper.BookingMapper;
import com.mecinema.mecinema.model.entity.Booking;
import com.mecinema.mecinema.model.enumtype.Status;
import com.mecinema.mecinema.repo.BookingRepository;
import com.mecinema.mecinema.repo.PaymentRepository;
import com.mecinema.mecinema.repo.ShowtimeRepository;
import com.mecinema.mecinema.repo.UserRepository;
import com.mecinema.mecinema.service.impl.BookingServiceImpl;
import com.mecinema.mecinema.service.support.BookingFactory;
import com.mecinema.mecinema.service.support.FoodSelectionService;
import com.mecinema.mecinema.service.support.TicketSelectionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

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

    /**
     * TC_WBT_005 (Bao phủ Path 1):
     * Hủy đặt vé thất bại do Booking ID không tồn tại hoặc không khớp User ID.
     * Mong đợi: Ném ra ngoại lệ ResourceNotFoundException.
     */
    @Test
    void cancelBooking_path1_bookingNotFound_throwsResourceNotFoundException() {
        // Arrange
        Long userId = 10L;
        Long bookingId = 999L;

        when(bookingRepository.findByIdAndUserId(bookingId, userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> bookingService.cancelBooking(userId, bookingId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Booking not found");

        // Verify
        verify(bookingRepository, times(1)).findByIdAndUserId(bookingId, userId);
    }

    /**
     * TC_WBT_006 (Bao phủ Path 2):
     * Hủy đặt vé thất bại do Booking đã ở trạng thái SUCCESS.
     * Mong đợi: Ném ra ngoại lệ BookingException.
     */
    @Test
    void cancelBooking_path2_bookingSuccess_throwsBookingException() {
        // Arrange
        Long userId = 10L;
        Long bookingId = 1L;

        Booking booking = new Booking();
        booking.setId(bookingId);
        booking.setStatus(Status.SUCCESS);

        when(bookingRepository.findByIdAndUserId(bookingId, userId)).thenReturn(Optional.of(booking));

        // Act & Assert
        assertThatThrownBy(() -> bookingService.cancelBooking(userId, bookingId))
                .isInstanceOf(BookingException.class)
                .hasMessageContaining("Cannot cancel a completed booking.");

        // Verify
        verify(bookingRepository, times(1)).findByIdAndUserId(bookingId, userId);
        assertThat(booking.getStatus()).isEqualTo(Status.SUCCESS);
    }

    /**
     * TC_WBT_007 (Bao phủ Path 3):
     * Hủy đặt vé đã bị hủy/thất bại trước đó (FAILED).
     * Mong đợi: Trả về sớm (return), không làm gì thêm, trạng thái giữ nguyên là FAILED.
     */
    @Test
    void cancelBooking_path3_bookingAlreadyFailed_doesNothing() {
        // Arrange
        Long userId = 10L;
        Long bookingId = 2L;

        Booking booking = new Booking();
        booking.setId(bookingId);
        booking.setStatus(Status.FAILED);

        when(bookingRepository.findByIdAndUserId(bookingId, userId)).thenReturn(Optional.of(booking));

        // Act
        bookingService.cancelBooking(userId, bookingId);

        // Assert / Verify
        verify(bookingRepository, times(1)).findByIdAndUserId(bookingId, userId);
        assertThat(booking.getStatus()).isEqualTo(Status.FAILED);
    }

    /**
     * TC_WBT_008 (Bao phủ Path 4):
     * Hủy đặt vé thành công khi đơn đang ở trạng thái PENDING.
     * Mong đợi: Trạng thái của Booking chuyển thành FAILED.
     */
    @Test
    void cancelBooking_path4_bookingPending_updatesStatusToFailed() {
        // Arrange
        Long userId = 10L;
        Long bookingId = 3L;

        Booking booking = new Booking();
        booking.setId(bookingId);
        booking.setStatus(Status.PENDING);

        when(bookingRepository.findByIdAndUserId(bookingId, userId)).thenReturn(Optional.of(booking));

        // Act
        bookingService.cancelBooking(userId, bookingId);

        // Assert / Verify
        verify(bookingRepository, times(1)).findByIdAndUserId(bookingId, userId);
        assertThat(booking.getStatus()).isEqualTo(Status.FAILED);
    }
}
