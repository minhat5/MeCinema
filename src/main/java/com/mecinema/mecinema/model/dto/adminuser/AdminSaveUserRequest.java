package com.mecinema.mecinema.model.dto.adminuser;

import com.mecinema.mecinema.model.enumtype.RoleUser;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AdminSaveUserRequest(
        @Email(message = "Email không đúng định dạng") @NotBlank(message = "Email không được để trống") String email,
        @NotBlank(message = "Họ tên không được để trống") String fullName,
        String phone,
        @NotBlank(message = "Role không được để trống") RoleUser role,
        @NotBlank(message = "Mật khẩu không được để trống") String password
) {
}
