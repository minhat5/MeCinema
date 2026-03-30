package com.mecinema.mecinema.payment;

import com.mecinema.mecinema.model.entity.Payment;

public interface PaymentGatewayClient {

    PaymentRedirect initCheckout(Payment payment);

    boolean verifySignature(String payload, String signature);

    record PaymentRedirect(String paymentUrl, long expiresInSeconds) {
    }
}

