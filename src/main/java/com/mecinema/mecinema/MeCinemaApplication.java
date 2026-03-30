package com.mecinema.mecinema;

import com.mecinema.mecinema.config.PaymentGatewayProperties;
import com.mecinema.mecinema.config.BookingProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
@EnableConfigurationProperties({PaymentGatewayProperties.class, BookingProperties.class})
public class MeCinemaApplication {
    public static void main(String[] args) {
        SpringApplication.run(MeCinemaApplication.class, args);
    }
}
