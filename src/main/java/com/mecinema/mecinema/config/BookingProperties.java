package com.mecinema.mecinema.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import lombok.Getter;
import lombok.Setter;

@ConfigurationProperties(prefix = "mecinema.booking")
@Getter
@Setter
public class BookingProperties {
    private Pending pending = new Pending();
    private Selection selection = new Selection();

    @Getter
    @Setter
    public static class Pending {
        private int expiryMinutes = 2;
    }

    @Getter
    @Setter
    public static class Selection {
        private int maxSeats = 10;
    }
}

