package com.mecinema.mecinema.service.impl;

import com.mecinema.mecinema.model.dto.LoginReq;
import com.mecinema.mecinema.model.dto.AuthRes;
import com.mecinema.mecinema.model.dto.RegisterReq;
import com.mecinema.mecinema.model.entity.User;
import com.mecinema.mecinema.model.enumtype.RoleUser;
import com.mecinema.mecinema.repo.RoleRepository;
import com.mecinema.mecinema.repo.UserRepository;
import com.mecinema.mecinema.service.AuthService;
import com.mecinema.mecinema.service.JwtService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Transactional
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final ObjectProvider<AuthenticationManager> amProvider;
    private final JwtService jwtService;

    @Override
    public void register(RegisterReq registerReq) {
        if(userRepo.existsByEmail(registerReq.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

         if(!registerReq.getPassword().equals(registerReq.getPassword())) {
             throw new RuntimeException("Passwords không khớp");
         }

        User user = new User();
        user.setEmail(registerReq.getEmail());
        user.setPassword(passwordEncoder.encode(registerReq.getPassword()));
        user.setFullName(registerReq.getFullName());
        user.setRole(roleRepo.findByName(RoleUser.CUSTOMER));
        user.setPhone(registerReq.getPhone());
        userRepo.save(user);
    }

    @Override
    public AuthRes login(LoginReq loginReq) {
        AuthenticationManager am = amProvider.getObject();
        Authentication a = am.authenticate(new UsernamePasswordAuthenticationToken(loginReq.email(), loginReq.password()));
        User user = userRepo.findByEmail(loginReq.email()).orElseThrow();

        Map<String, Object> claims = Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "role", user.getRole().getName(),
                "phone", user.getPhone()
        );
        String token = jwtService.generate(loginReq.email(), claims);
        return new AuthRes(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole().getName(), user.getPhone());
    }

    @Override
    public AuthRes processOAuth2User(String email, String name) {
        User user = userRepo.findByEmail(email)
                .orElseGet(() -> createOAuth2User(email, name));
        Map<String, Object> claims = Map.of(
                "role", user.getRole().getName(),
                "name", user.getFullName(),
                "id", user.getId()
        );
        String token = jwtService.generate(user.getEmail(), claims);
        return new AuthRes(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole().getName(), user.getPhone());
    }

    private User createOAuth2User(String email, String name) {
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setFullName(name);
        newUser.setRole(roleRepo.findByName(RoleUser.CUSTOMER));
        newUser.setPassword(null);
        newUser.setPhone(null);
        return userRepo.save(newUser);
    }
}
