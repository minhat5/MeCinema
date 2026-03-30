package com.mecinema.mecinema.model.dto.payment;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public record PaymentCallbackRequest(
        @JsonProperty("id") Long id,
        @JsonProperty("gateway") String gateway,
        @JsonProperty("transactionDate") String transactionDate,
        @JsonProperty("accountNumber") String accountNumber,
        @JsonProperty("subAccount") String subAccount,
        @JsonProperty("amountIn") BigDecimal amountIn,
        @JsonProperty("amountOut") BigDecimal amountOut,
        @JsonProperty("accumulated") BigDecimal accumulated,
        @JsonProperty("code") String code,
        @JsonProperty("transactionContent") String transactionContent,
        @JsonProperty("referenceCode") String referenceCode,
        @JsonProperty("body") String body,
        @JsonProperty("amount_in") BigDecimal amount_in,
        @JsonProperty("amount_out") BigDecimal amount_out,
        @JsonProperty("transferAmount") BigDecimal transferAmount,
        @JsonProperty("transferType") String transferType
) {
}
