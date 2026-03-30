package com.mecinema.mecinema.repo;

import com.mecinema.mecinema.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}

