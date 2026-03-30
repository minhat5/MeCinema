package com.mecinema.mecinema.payment.impl;

import com.mecinema.mecinema.config.PaymentGatewayProperties;
import com.mecinema.mecinema.model.entity.Payment;
import com.mecinema.mecinema.payment.PaymentGatewayClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class SePayGatewayClient implements PaymentGatewayClient {

    private final PaymentGatewayProperties properties;

    @Override
    public PaymentRedirect initCheckout(Payment payment) {
        String bankId = properties.getBankId();
        String accountNumber = properties.getAccountNumber();
        String template = properties.getTemplate();
        BigDecimal amount = payment.getBooking().getTotalPrice();
        String description = payment.getTransactionNo(); // Use transaction No as description

        // Generate VietQR/SePay link
        String paymentUrl = String.format(
                "https://qr.sepay.vn/img?bank=%s&acc=%s&template=%s&amount=%s&des=%s",
                bankId,
                accountNumber,
                template,
                amount.toBigInteger().toString(),
                URLEncoder.encode(description, StandardCharsets.UTF_8)
        );

        long expiresInSeconds = properties.getExpiryMinutes() * 60;
        return new PaymentRedirect(paymentUrl, expiresInSeconds);
    }

    @Override
    public boolean verifySignature(String payload, String signature) {
        // SePay usually passes webhook token in headers or body to verify.
        // We compare the provided signature against our configured token.
        if (properties.getWebhookToken() == null || properties.getWebhookToken().isEmpty()) {
            return false; // Not configured
        }
        return properties.getWebhookToken().equals(signature);
    }
}

