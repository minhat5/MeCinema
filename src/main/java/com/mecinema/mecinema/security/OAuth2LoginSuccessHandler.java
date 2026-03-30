package com.mecinema.mecinema.security;

import com.mecinema.mecinema.model.dto.AuthRes;
import com.mecinema.mecinema.service.AuthService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final AuthService authService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        log.info("OAuth2 login successful, user email: {}", email);
        AuthRes authRes = authService.processOAuth2User(email, name);

        String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:5000/Mecinema/login")
                .queryParam("token", authRes.token())
                .queryParam("email", authRes.email())
                .queryParam("name", authRes.fullName())
                .queryParam("role", authRes.role())
                .queryParam("id", authRes.id())
                .queryParam("phone", authRes.phone())
                .build().encode().toUriString();

        response.sendRedirect(redirectUrl);
    }
}