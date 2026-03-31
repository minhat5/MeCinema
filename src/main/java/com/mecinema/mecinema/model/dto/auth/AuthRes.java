package com.mecinema.mecinema.model.dto.auth;

import com.mecinema.mecinema.model.enumtype.RoleUser;

public record AuthRes(
        String token, Long id, String email, String fullName, RoleUser role, String phone
) {
}
