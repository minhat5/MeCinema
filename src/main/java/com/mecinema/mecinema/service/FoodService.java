package com.mecinema.mecinema.service;

import com.mecinema.mecinema.model.entity.Food;
import com.mecinema.mecinema.model.enumtype.FoodType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FoodService {
    Page<Food> findAll(Pageable pageable);
    Food create(Food food);
    Food update(Long id, Food food);
    void delete(Long id);
    Food findById(Long id);
    Page<Food> search(String name, FoodType type, Boolean isActive, Pageable pageable);
}
