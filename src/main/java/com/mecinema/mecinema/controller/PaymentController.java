package com.mecinema.mecinema.controller;

import com.mecinema.mecinema.model.dto.payment.PaymentCallbackRequest;
import com.mecinema.mecinema.model.dto.payment.PaymentInitRequest;
import com.mecinema.mecinema.model.dto.payment.PaymentInitResponse;
import com.mecinema.mecinema.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Validated
public class PaymentController {

    private static final String USER_HEADER = "X-User-Id";

    private final PaymentService paymentService;

    @PostMapping("/bookings/{bookingId}/init")
    public ResponseEntity<PaymentInitResponse> initPayment(
            @RequestHeader(USER_HEADER) Long userId,
            @PathVariable Long bookingId,
            @Valid @RequestBody PaymentInitRequest request) {
        PaymentInitResponse response = paymentService.initPayment(userId, bookingId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/callback")
    public ResponseEntity<Void> callback(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody PaymentCallbackRequest request) {

        // Pass header token explicitly as signature since Sepay validates via authorization token header
        String token = "";
        if (authHeader != null && authHeader.startsWith("Apikey ")) {
            token = authHeader.substring(7);
        } else if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        paymentService.handleCallback(request, token);
        return ResponseEntity.ok().build();
    }
}
