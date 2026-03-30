package com.mecinema.mecinema.service;

import com.mecinema.mecinema.model.dto.payment.PaymentCallbackRequest;
import com.mecinema.mecinema.model.dto.payment.PaymentInitRequest;
import com.mecinema.mecinema.model.dto.payment.PaymentInitResponse;

public interface PaymentService {
    PaymentInitResponse initPayment(Long userId, Long bookingId, PaymentInitRequest request);

    void handleCallback(PaymentCallbackRequest request, String token);
}
