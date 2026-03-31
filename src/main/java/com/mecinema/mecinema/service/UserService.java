package com.mecinema.mecinema.service;

import com.mecinema.mecinema.model.dto.adminuser.AdminSaveUserRequest;
import com.mecinema.mecinema.model.dto.user.UpdateUserRequest;
import com.mecinema.mecinema.model.entity.User;
import com.mecinema.mecinema.model.enumtype.RoleUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

public interface UserService {
    Page<User> findAll(Pageable pageable);
    void delete(Long id);
    User findById(Long id);
    User findByEmail(String email);
    Page<User> findByKeyword(String keyword, Pageable pageable);
    Page<User> findByRole(RoleUser role, Pageable pageable);
    User createUser(AdminSaveUserRequest user);
    User updateUser(Long id, AdminSaveUserRequest user);
    User authed(Authentication authentication);
    User saveUser(Authentication authentication, Long id, UpdateUserRequest user);
}
