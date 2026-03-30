package com.mecinema.mecinema.service;

import org.springframework.stereotype.Service;

import java.util.Map;

public interface JwtService {
    String generate(String subject, Map<String, Object> claims);
    String getSubject(String token);
}
