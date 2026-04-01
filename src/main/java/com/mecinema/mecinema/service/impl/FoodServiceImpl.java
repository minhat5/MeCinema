package com.mecinema.mecinema.service.impl;

import com.mecinema.mecinema.model.entity.Food;
import com.mecinema.mecinema.model.enumtype.FoodType;
import com.mecinema.mecinema.repo.FoodRepository;
import com.mecinema.mecinema.service.FoodService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FoodServiceImpl implements FoodService {
    private final FoodRepository foodRepository;

    @Override
    public Page<Food> findAll(Pageable pageable) {
        return foodRepository.findAll(pageable);
    }

    @Override
    public Food create(Food food) {
        return foodRepository.save(food);
    }

    @Override
    public Food update(Long id, Food food) {
        Food updatingFood = foodRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy món ăn với id: " + id));
        updatingFood.setName(food.getName());
        updatingFood.setPrice(food.getPrice());
        updatingFood.setType(food.getType());
        updatingFood.setDescription(food.getDescription());
        updatingFood.setImageUrl(food.getImageUrl());
        updatingFood.setIsActive(food.getIsActive());
        return foodRepository.save(updatingFood);
    }

    @Override
    public void delete(Long id) {
        if (!foodRepository.existsById(id)) {
            throw new EntityNotFoundException("Không tìm thấy món ăn với id: " + id);
        }
        foodRepository.deleteById(id);
    }

    @Override
    public Food findById(Long id) {
        return foodRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Không tìm thấy món ăn với id: " + id));
    }

    @Override
    public Page<Food> search(String name, FoodType type, Boolean isActive, Pageable pageable) {
        return foodRepository.findAll((root, query, criteriaBuilder) -> {
            var predicates = criteriaBuilder.conjunction();
            if (name != null && !name.isEmpty()) {
                predicates = criteriaBuilder.and(predicates, criteriaBuilder.like(root.get("name"), "%" + name + "%"));
            }
            if (type != null) {
                predicates = criteriaBuilder.and(predicates, criteriaBuilder.equal(root.get("type"), type));
            }
            if (isActive != null) {
                predicates = criteriaBuilder.and(predicates, criteriaBuilder.equal(root.get("isActive"), isActive));
            }
            return predicates;
        }, pageable);
    }
}
