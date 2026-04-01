package com.mecinema.mecinema.service.impl;

import com.mecinema.mecinema.model.dto.adminuser.AdminSaveUserRequest;
import com.mecinema.mecinema.model.dto.user.UpdateUserRequest;
import com.mecinema.mecinema.model.entity.User;
import com.mecinema.mecinema.model.enumtype.RoleUser;
import com.mecinema.mecinema.repo.RoleRepository;
import com.mecinema.mecinema.repo.UserRepository;
import com.mecinema.mecinema.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Page<User> findAll(Pageable pageable) {
        return userRepo.findAll(pageable);
    }

    @Override
    public void delete(Long id) {
        User user = userRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng"));
        if(user.getRole().getName().equals(RoleUser.ADMIN)) {
            throw new RuntimeException("Không thể xoá tài khoản Admin");
        }
        userRepo.deleteById(id);
    }

    @Override
    public User findById(Long id) {
        return userRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng"));
    }

    @Override
    public User findByEmail(String email) {
        return userRepo.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng"));
    }

    @Override
    public Page<User> findByKeyword(String keyword, Pageable pageable) {
        return userRepo.findAll((root, query, cb) -> {
            String likePattern = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("email")), likePattern),
                    cb.like(cb.lower(root.get("fullName")), likePattern)
            );
        }, pageable);
    }

    @Override
    public Page<User> findByRole(RoleUser role, Pageable pageable) {
        return userRepo.findAll((root, query, cb) -> cb.equal(root.get("role").get("name"), role), pageable);
    }

    @Override
    public User createUser(AdminSaveUserRequest user) {
        User existingUser = userRepo.findByEmail(user.email()).orElse(null);
        if(existingUser != null) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }
        User newUser = new User();
        newUser.setFullName(user.fullName());
        newUser.setEmail(user.email());
        newUser.setPhone(user.phone());
        newUser.setPassword(passwordEncoder.encode(user.password()));
        newUser.setRole(roleRepo.findByName(user.role()));
        return userRepo.save(newUser);
    }

    @Override
    public User updateUser(Long id, AdminSaveUserRequest user) {
        User updateUser = userRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng"));
        if(!updateUser.getEmail().equals(user.email())) {
            User existingUser = userRepo.findByEmail(user.email()).orElse(null);
            if(existingUser != null) {
                throw new IllegalArgumentException("Email đã tồn tại");
            }
            updateUser.setEmail(user.email());
        }
        updateUser.setFullName(user.fullName());
        updateUser.setPhone(user.phone());
        if(user.password() != null && !user.password().isEmpty()) {
            updateUser.setPassword(passwordEncoder.encode(user.password()));
        }
        updateUser.setRole(roleRepo.findByName(user.role()));
        return userRepo.save(updateUser);
    }

    @Override
    public User authed(Authentication authentication) {
        if (authentication == null) {
            throw new SecurityException("Unauthenticated");
        }
        return userRepo.findByEmail(authentication.getName()).orElseThrow(() -> new EntityNotFoundException("Unauthenticated"));
    }

    @Override
    public User saveUser(Authentication authentication, Long id, UpdateUserRequest user) {
        User me = authed(authentication);
        if(!me.getId().equals(id)) {
            throw new SecurityException("Không có quyền cập nhật thông tin người dùng khác");
        }
        User updateUser = userRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy người dùng"));
        updateUser.setFullName(user.fullName());
        updateUser.setPhone(user.phone());
        return userRepo.save(updateUser);
    }
}
