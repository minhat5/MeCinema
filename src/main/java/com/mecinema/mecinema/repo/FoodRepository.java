package com.mecinema.mecinema.repo;

import com.mecinema.mecinema.model.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodRepository extends JpaRepository<Food, Long> {
}

