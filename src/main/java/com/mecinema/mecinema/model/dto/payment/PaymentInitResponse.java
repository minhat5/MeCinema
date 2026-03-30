package com.mecinema.mecinema.model.dto.payment;

import com.mecinema.mecinema.model.enumtype.PaymentMethod;
import com.mecinema.mecinema.model.enumtype.Status;

import java.time.Instant;

public record PaymentInitResponse(
        Long bookingId,
        Long paymentId,
        String transactionNo,
        PaymentMethod method,
        Status status,
        String paymentUrl,
        Instant expiresAt
) {
}

