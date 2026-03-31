package com.mecinema.mecinema.controller.user;

import com.mecinema.mecinema.model.dto.user.UpdateUserRequest;
import com.mecinema.mecinema.model.entity.User;
import com.mecinema.mecinema.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/user")
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        try {
            User me = userService.authed(authentication);
            return ResponseEntity.ok(me);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(Authentication authentication, @PathVariable Long id, @RequestBody UpdateUserRequest user) {
        try {
            return ResponseEntity.ok(userService.saveUser(authentication, id, user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
