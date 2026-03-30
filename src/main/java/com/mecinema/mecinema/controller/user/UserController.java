package com.mecinema.mecinema.controller.user;

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

    private User authed(Authentication authentication) {
        if (authentication == null) {
            throw new SecurityException("Unauthenticated");
        }
        return userService.findByEmail(authentication.getName());
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        try {
            User me = authed(authentication);
            if(me == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(me);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("{id}")
    public ResponseEntity<?> update(Authentication authentication, @PathVariable Long id, @RequestBody User user) {
        try {
            User me = authed(authentication);
            if(me == null) {
                return ResponseEntity.notFound().build();
            }

            if(!me.getId().equals(id)) {
                return ResponseEntity.status(403).body("Forbidden");
            }

            User updateUser = userService.save(user);
            return ResponseEntity.ok(updateUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
