package com.mecinema.mecinema.service.impl;

import com.mecinema.mecinema.model.entity.Role;
import com.mecinema.mecinema.model.entity.User;
import com.mecinema.mecinema.model.enumtype.RoleUser;
import com.mecinema.mecinema.repo.UserRepo;
import com.mecinema.mecinema.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Page<User> findAll(Pageable pageable) {
        return userRepo.findAll(pageable);
    }

    @Override
    public User save(User user) {
        if(user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepo.save(user);
    }

    @Override
    public void delete(Long id) {
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        if(user.getRole().getName().equals(RoleUser.ADMIN)) {
            throw new RuntimeException("Không thể xoá tài khoản Admin");
        }
        userRepo.deleteById(id);
    }

    @Override
    public User findById(Long id) {
        return userRepo.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }

    @Override
    public User findByEmail(String email) {
        return userRepo.findByEmail(email).orElse(null);
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
    public Page<User> findByRole(Role role, Pageable pageable) {
        return userRepo.findAll((root, query, cb) -> cb.equal(root.get("role"), role), pageable);
    }
}
