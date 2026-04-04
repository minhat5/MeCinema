package com.mecinema.mecinema.controller.food;

import com.mecinema.mecinema.mapper.FoodMapper;
import com.mecinema.mecinema.model.dto.FoodDTO;
import com.mecinema.mecinema.model.entity.Food;
import com.mecinema.mecinema.model.enumtype.FoodType;
import com.mecinema.mecinema.service.FoodService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public/foods")
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class FoodController {
    private final FoodService foodService;
    private final FoodMapper foodMapper;

    //Lấy danh sách đồ ăn đang có sẵn (active only)
    @GetMapping("/available")
    public ResponseEntity<Page<FoodDTO>> getAvailableFoods(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("name"));
            Page<Food> foods = foodService.search("", null, true, pageable);
            log.info("Found {} available foods on page {}", foods.getNumberOfElements(), page);
            
            Page<FoodDTO> foodDTOs = foods.map(foodMapper::toDTO);
            return ResponseEntity.ok(foodDTOs);
        } catch (Exception e) {
            log.error("Error fetching available foods", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Tìm kiếm đồ ăn theo tên, loại và trạng thái
    @GetMapping("/search")
    public ResponseEntity<Page<FoodDTO>> searchFoods(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) FoodType type,
            @RequestParam(required = false, defaultValue = "true") Boolean isActive,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("id"));
            
            if ((name == null || name.isEmpty()) && type == null) {
                Page<Food> foods = foodService.search("", null, isActive, pageable);
                return ResponseEntity.ok(foods.map(foodMapper::toDTO));
            }
            
            Page<Food> foods = foodService.search(
                    name != null ? name : "",
                    type,
                    isActive,
                    pageable
            );
            return ResponseEntity.ok(foods.map(foodMapper::toDTO));
        } catch (Exception e) {
            log.error("Error searching foods", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Lấy danh sách đồ ăn theo loại (FOOD, DRINK, COMBO)
    @GetMapping("/by-type/{type}")
    public ResponseEntity<Page<FoodDTO>> getFoodsByType(
            @PathVariable FoodType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("name"));
            Page<Food> foods = foodService.search("", type, true, pageable);
            return ResponseEntity.ok(foods.map(foodMapper::toDTO));
        } catch (Exception e) {
            log.error("Error fetching foods by type", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //Lấy danh sách tất cả đồ ăn có sẵn (phân trang)
    @GetMapping
    public ResponseEntity<Page<FoodDTO>> getAllFoods(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
            Page<Food> foods = foodService.findAll(pageable);
            return ResponseEntity.ok(foods.map(foodMapper::toDTO));
        } catch (Exception e) {
            log.error("Error fetching all foods", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Lấy chi tiết một đồ ăn theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getFoodById(@PathVariable Long id) {
        try {
            Food food = foodService.findById(id);
            return ResponseEntity.ok(foodMapper.toDTO(food));
        } catch (Exception e) {
            log.error("Food not found with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy đồ ăn với ID: " + id);
        }
    }
}

