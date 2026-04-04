package com.mecinema.mecinema.mapper;

import com.mecinema.mecinema.model.dto.FoodDTO;
import com.mecinema.mecinema.model.entity.Food;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
public class FoodMapper {
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public FoodDTO toDTO(Food food) {
        if (food == null) {
            return null;
        }

        return FoodDTO.builder()
                .id(food.getId())
                .name(food.getName())
                .description(food.getDescription())
                .price(food.getPrice() != null ? food.getPrice().doubleValue() : null)
                .imageUrl(food.getImageUrl())
                .type(food.getType())
                .isActive(food.getIsActive())
                .createdAt(food.getCreatedAt() != null ? food.getCreatedAt().format(DATE_FORMAT) : null)
                .updatedAt(food.getUpdatedAt() != null ? food.getUpdatedAt().format(DATE_FORMAT) : null)
                .build();
    }

    public Food toEntity(FoodDTO dto) {
        if (dto == null) {
            return null;
        }

        Food food = new Food();
        food.setId(dto.getId());
        food.setName(dto.getName());
        food.setDescription(dto.getDescription());
        food.setPrice(dto.getPrice() != null ? java.math.BigDecimal.valueOf(dto.getPrice()) : null);
        food.setImageUrl(dto.getImageUrl());
        food.setType(dto.getType());
        food.setIsActive(dto.getIsActive());
        return food;
    }
}

