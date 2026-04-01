package com.mecinema.mecinema.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "payment.sepay")
public class PaymentGatewayProperties {

    private String bankId;
    private String accountNumber;
    private String template;
    private String webhookToken;
    private String apiToken;
    private long expiryMinutes = 15;

    public String getBankId() {
        return bankId;
    }

    public void setBankId(String bankId) {
        this.bankId = bankId;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    public String getWebhookToken() {
        return webhookToken;
    }

    public void setWebhookToken(String webhookToken) {
        this.webhookToken = webhookToken;
    }

    public String getApiToken() {
        return apiToken;
    }

    public void setApiToken(String apiToken) {
        this.apiToken = apiToken;
    }

    public long getExpiryMinutes() {
        return expiryMinutes;
    }

    public void setExpiryMinutes(long expiryMinutes) {
        this.expiryMinutes = expiryMinutes;
    }
}
