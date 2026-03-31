package com.mecinema.mecinema.service;

import com.mecinema.mecinema.model.dto.auth.LoginReq;
import com.mecinema.mecinema.model.dto.auth.AuthRes;
import com.mecinema.mecinema.model.dto.auth.RegisterReq;

public interface AuthService {
    void register(RegisterReq registerReq);
    AuthRes login(LoginReq loginReq);
    AuthRes processOAuth2User(String email, String name);
}
