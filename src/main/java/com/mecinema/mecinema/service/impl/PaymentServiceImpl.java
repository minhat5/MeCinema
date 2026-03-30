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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

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
        }

        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseGet(Payment::new);
        payment.setBooking(booking);
        payment.setPaymentMethod(request.method());
        payment.setStatus(Status.PENDING);
        payment.setTransactionNo(UUID.randomUUID().toString());
        payment.setPaymentTime(LocalDateTime.now());

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

        // Add additional logic: In sepay, we must check if amount_in >= booking price. (Transfer amount may be less due to fee configuration).
        if (request.transferAmount().compareTo(payment.getBooking().getTotalPrice()) < 0) {
            payment.setStatus(Status.FAILED);
        } else {
            payment.setStatus(Status.SUCCESS);
        }

        payment.setPaymentTime(LocalDateTime.now());

        Booking booking = payment.getBooking();
        if (payment.getStatus() == Status.SUCCESS) {
            booking.setStatus(Status.SUCCESS);
        } else {
            booking.setStatus(Status.FAILED);
        }
    }
}
