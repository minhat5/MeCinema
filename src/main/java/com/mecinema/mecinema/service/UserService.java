package com.mecinema.mecinema.service;

import com.mecinema.mecinema.model.entity.Role;
import com.mecinema.mecinema.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    Page<User> findAll(Pageable pageable);
    User save(User user);
    void delete(Long id);
    User findById(Long id);
    User findByEmail(String email);
    Page<User> findByKeyword(String keyword, Pageable pageable);
    Page<User> findByRole(Role role, Pageable pageable);
}
