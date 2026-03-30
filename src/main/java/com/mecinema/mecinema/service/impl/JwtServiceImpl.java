package com.mecinema.mecinema.service.impl;

import com.mecinema.mecinema.service.JwtService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
public class JwtServiceImpl implements JwtService {
    private final Key key;
    private final long expSeconds;

    public JwtServiceImpl(
            @Value("${app.security.jwt-secret}") String secret,
            @Value("${app.security.jwt-exp-seconds}") long expSeconds
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expSeconds = expSeconds;
    }

    @Override
    public String generate(String subject, Map<String, Object> claims) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(subject)
                .claims(claims)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(expSeconds)))
                .signWith(key)
                .compact();
    }

    @Override
    public String getSubject(String token) {
        return Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
}