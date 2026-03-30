package com.mecinema.mecinema.model.dto.payment;

import com.mecinema.mecinema.model.enumtype.PaymentMethod;
import jakarta.validation.constraints.NotNull;

public record PaymentInitRequest(@NotNull PaymentMethod method) {
}

