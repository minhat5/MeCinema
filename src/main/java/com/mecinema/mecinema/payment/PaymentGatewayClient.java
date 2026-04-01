package com.mecinema.mecinema.payment;

import com.mecinema.mecinema.model.entity.Payment;

public interface PaymentGatewayClient {

    PaymentRedirect initCheckout(Payment payment);

    boolean verifySignature(String payload, String signature);

    default boolean checkPaymentStatusAPI(String transactionNo, java.math.BigDecimal expectedAmount) {
        return false;
    }

    record PaymentRedirect(String paymentUrl, long expiresInSeconds) {
    }
}
