package com.mecinema.mecinema.payment.impl;

import com.mecinema.mecinema.config.PaymentGatewayProperties;
import com.mecinema.mecinema.model.entity.Payment;
import com.mecinema.mecinema.payment.PaymentGatewayClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SePayGatewayClient implements PaymentGatewayClient {

    private final PaymentGatewayProperties properties;
    private final RestTemplate restTemplate = new RestTemplate();

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

    @Override
    public boolean checkPaymentStatusAPI(String transactionNo, BigDecimal expectedAmount) {
        String apiToken = properties.getApiToken();
        if (apiToken == null || apiToken.isBlank()) {
            return false;
        }

        try {
            String url = "https://my.sepay.vn/userapi/transactions/list";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + apiToken);
            headers.set("Content-Type", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                if (body.get("transactions") instanceof List) {
                    List<Map<String, Object>> transactions = (List<Map<String, Object>>) body.get("transactions");

                    for (Map<String, Object> tx : transactions) {
                        String content = String.valueOf(tx.get("transaction_content"));
                        String amountInStr = String.valueOf(tx.get("amount_in"));
                        if (content != null && content.contains(transactionNo)) {
                            BigDecimal amountIn = new BigDecimal(amountInStr);
                            if (amountIn.compareTo(expectedAmount) >= 0) {
                                return true; // Payment found and valid
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            // Log error in real env
            e.printStackTrace();
        }

        return false;
    }
}
