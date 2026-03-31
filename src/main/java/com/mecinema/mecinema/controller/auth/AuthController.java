package com.mecinema.mecinema.controller.auth;

import com.mecinema.mecinema.model.dto.auth.AuthRes;
import com.mecinema.mecinema.model.dto.auth.LoginReq;
import com.mecinema.mecinema.model.dto.auth.RegisterReq;
import com.mecinema.mecinema.model.entity.User;
import com.mecinema.mecinema.service.AuthService;
import com.mecinema.mecinema.service.JwtService;
import com.mecinema.mecinema.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterReq registerReq) {
        authService.register(registerReq);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginReq loginReq) {
        AuthRes authRes = authService.login(loginReq);
        ResponseCookie responseCookie = ResponseCookie.from("AUTH_TOKEN", authRes.token())
                .path("/")
                .httpOnly(true)
                .sameSite("Lax")
                .maxAge(7 * 24 * 60 * 60)
                .build();
        return ResponseEntity.ok().header("Set-Cookie", responseCookie.toString()).build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String authHeader) {
        String email = null;
        try {
            if(authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).build();
            }
            String token = authHeader.substring(7);
            email = jwtService.getSubject(token);
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
        if(email == null) {
            return ResponseEntity.status(401).build();
        }

        try {
            return ResponseEntity.ok(userService.findByEmail(email));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
