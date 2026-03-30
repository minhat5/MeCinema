package com.mecinema.mecinema.service;

import com.mecinema.mecinema.model.dto.LoginReq;
import com.mecinema.mecinema.model.dto.AuthRes;
import com.mecinema.mecinema.model.dto.RegisterReq;
import org.springframework.stereotype.Service;

public interface AuthService {
    void register(RegisterReq registerReq);
    AuthRes login(LoginReq loginReq);
    AuthRes processOAuth2User(String email, String name);
}
