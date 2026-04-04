package com.mecinema.mecinema.model.dto;

import com.mecinema.mecinema.model.enumtype.FoodType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodDTO implements Serializable {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    private FoodType type;
    private Boolean isActive;
    private String createdAt;
    private String updatedAt;
}

