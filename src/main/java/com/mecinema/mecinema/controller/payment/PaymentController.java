package com.mecinema.mecinema.controller.payment;

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
import com.mecinema.mecinema.security.CurrentUser;
import com.mecinema.mecinema.security.CustomUserDetails;

@RestController
@RequiredArgsConstructor
@Validated
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/api/bookings/{id}/payments")
    public ResponseEntity<PaymentInitResponse> initPayment(
            @CurrentUser CustomUserDetails userDetails,
            @PathVariable("id") Long id,
            @Valid @RequestBody PaymentInitRequest request) {
        PaymentInitResponse response = paymentService.initPayment(userDetails.getId(), id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/api/payments/callback")
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
