package com.mecinema.mecinema;

import com.mecinema.mecinema.config.PaymentGatewayProperties;
import com.mecinema.mecinema.config.BookingProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties({PaymentGatewayProperties.class, BookingProperties.class})
public class MeCinemaApplication {
    public static void main(String[] args) {
        SpringApplication.run(MeCinemaApplication.class, args);
        System.out.println(new BCryptPasswordEncoder().encode("123456"));
    }

}
