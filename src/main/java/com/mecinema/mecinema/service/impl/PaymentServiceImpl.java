package com.mecinema.mecinema.service.impl;

import com.mecinema.mecinema.exception.BookingException;
import com.mecinema.mecinema.exception.ResourceNotFoundException;
import com.mecinema.mecinema.model.dto.payment.PaymentCallbackRequest;
import com.mecinema.mecinema.model.dto.payment.PaymentInitRequest;
import com.mecinema.mecinema.model.dto.payment.PaymentInitResponse;
import com.mecinema.mecinema.model.entity.Booking;
import com.mecinema.mecinema.model.entity.Payment;
import com.mecinema.mecinema.model.enumtype.Status;
import com.mecinema.mecinema.payment.PaymentGatewayClient;
import com.mecinema.mecinema.repo.BookingRepository;
import com.mecinema.mecinema.repo.PaymentRepository;
import com.mecinema.mecinema.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentGatewayClient paymentGatewayClient;

    @Override
    @Transactional
    public PaymentInitResponse initPayment(Long userId, Long bookingId, PaymentInitRequest request) {
        Booking booking = bookingRepository.findByIdAndUserId(bookingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() == Status.SUCCESS) {
            throw new BookingException("Booking already paid");
        } else if (booking.getStatus() == Status.FAILED) {
            throw new BookingException("Booking has expired or failed. Please create a new booking.");
        }

        // Idempotency: nếu đã có Payment PENDING cho booking này thì tái sử dụng nó.
        // Điều này ngăn React StrictMode (mount 2 lần) hoặc user double-click tạo ra
        // nhiều Payment record khác nhau, khiến polling check sai transactionNo.
        boolean isRegenerateRequest = request.regenerate() != null && request.regenerate();
        if (!isRegenerateRequest) {
            Optional<Payment> existingPending = paymentRepository.findFirstByBookingIdOrderByCreatedAtDesc(bookingId);
            if (existingPending.isPresent() && existingPending.get().getStatus() == Status.PENDING) {
                Payment existing = existingPending.get();
                var redirect = paymentGatewayClient.initCheckout(existing);
                Instant expiresAt = Instant.now().plusSeconds(redirect.expiresInSeconds());
                return new PaymentInitResponse(
                        bookingId,
                        existing.getId(),
                        existing.getTransactionNo(),
                        existing.getPaymentMethod(),
                        existing.getStatus(),
                        redirect.paymentUrl(),
                        expiresAt
                );
            }
        }

        // Tạo Payment mới (lần đầu hoặc khi user bấm "Tạo lại mã")
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setPaymentMethod(request.method());
        payment.setStatus(Status.PENDING);

        // Generate a short transaction number (e.g. BKG123-A1B2C) to avoid truncation by banks
        String shortUid = UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase();
        payment.setTransactionNo("BKG" + bookingId + shortUid);

        Payment saved = paymentRepository.save(payment);
        var redirect = paymentGatewayClient.initCheckout(saved);
        Instant expiresAt = Instant.now().plusSeconds(redirect.expiresInSeconds());

        return new PaymentInitResponse(
                bookingId,
                saved.getId(),
                saved.getTransactionNo(),
                saved.getPaymentMethod(),
                saved.getStatus(),
                redirect.paymentUrl(),
                expiresAt
        );
    }

    @Override
    @Transactional
    public void handleCallback(PaymentCallbackRequest request, String token) {

        boolean verified = paymentGatewayClient.verifySignature("", token);
        if (!verified) {
            throw new BookingException("Invalid payment signature");
        }

        String transactionNo = request.referenceCode(); // SePay maps content/reference as des
        Payment payment = paymentRepository.findByTransactionNo(transactionNo)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (payment.getStatus() == Status.SUCCESS) {
            return; // Already processed
        }

        Booking booking = payment.getBooking();
        
        // If booking is already failed (e.g. timeout), log it. Money must be refunded manually.
        if (booking.getStatus() == Status.FAILED && request.transferAmount().compareTo(booking.getTotalPrice()) >= 0) {
            payment.setStatus(Status.SUCCESS);
            // Do not change booking status to SUCCESS to avoid double-booking the same seat!
            return;
        }

        // Add additional logic: In sepay, we must check if amount_in >= booking price. (Transfer amount may be less due to fee configuration).
        if (request.transferAmount().compareTo(payment.getBooking().getTotalPrice()) < 0) {
            payment.setStatus(Status.FAILED);
            // Khách chuyển thiếu tiền -> Code chỉ đánh rớt giao dịch Payment này. 
            // KHÔNG chuyển Booking thành FAILED ở đây để giữ ghế (Booking vẫn PENDING) cho đến khi Cron job 10 phút quét.
        } else {
            payment.setStatus(Status.SUCCESS);
            booking.setStatus(Status.SUCCESS);
        }
    }

    @Override
    @Transactional
    public boolean checkPaymentStatusAPI(Long bookingId, Long paymentId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() == Status.SUCCESS) {
            return true;
        }

        if (booking.getStatus() == Status.FAILED) {
            return false;
        }

        // Nếu có paymentId cụ thể → check đúng record đó (tránh race condition khi tạo 2 record cùng lúc)
        // Nếu không có → fallback tìm record mới nhất (backward compatible)
        Payment payment;
        if (paymentId != null) {
            payment = paymentRepository.findById(paymentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        } else {
            payment = paymentRepository.findFirstByBookingIdOrderByCreatedAtDesc(bookingId)
                    .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking"));
        }

        if (payment.getStatus() == Status.SUCCESS) {
            return true;
        }

        boolean verified = paymentGatewayClient.checkPaymentStatusAPI(payment.getTransactionNo(), booking.getTotalPrice());

        if (verified) {
            payment.setStatus(Status.SUCCESS);
            booking.setStatus(Status.SUCCESS);
            return true;
        }

        return false;
    }
}
