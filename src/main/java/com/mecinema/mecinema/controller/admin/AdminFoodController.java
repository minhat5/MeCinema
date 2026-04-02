package com.mecinema.mecinema.controller.admin;

import com.mecinema.mecinema.model.entity.Food;
import com.mecinema.mecinema.model.enumtype.FoodType;
import com.mecinema.mecinema.service.FoodService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/foods")
@PreAuthorize("hasRole('ADMIN')")
public class AdminFoodController {
    private final FoodService foodService;

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        Pageable pageable = PageRequest.of(page, size, Sort.by("id"));
        return ResponseEntity.ok(foodService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFood(@PathVariable Long id){
        try {
            return ResponseEntity.ok(foodService.findById(id));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Food food){
        try{
            return ResponseEntity.ok(foodService.create(food));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Food food){
        try {
            return ResponseEntity.ok(foodService.update(id, food));
        } catch(EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        try {
            foodService.delete(id);
            return ResponseEntity.ok("Xóa món ăn thành công");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String name,
                                        @RequestParam FoodType type,
                                        @RequestParam Boolean isActive,
                                        @RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "10") int size){
        Pageable pageable = PageRequest.of(page, size, Sort.by("id"));
        return ResponseEntity.ok(foodService.search(name, type, isActive, pageable));
    }
}
