package com.mecinema.mecinema.service.support;

import com.mecinema.mecinema.exception.BookingException;
import com.mecinema.mecinema.exception.ResourceNotFoundException;
import com.mecinema.mecinema.model.dto.booking.BookingRequest;
import com.mecinema.mecinema.model.entity.Booking;
import com.mecinema.mecinema.model.entity.BookingFood;
import com.mecinema.mecinema.model.entity.Food;
import com.mecinema.mecinema.repo.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class FoodSelectionService {

    private final FoodRepository foodRepository;

    public Set<BookingFood> buildBookingFoods(Booking booking, BookingRequest request) {
        if (request.foods() == null || request.foods().isEmpty()) {
            return new LinkedHashSet<>();
        }

        Map<Long, Integer> foodQuantity = request.foods().stream()
                .collect(Collectors.toMap(BookingRequest.FoodSelection::foodId, BookingRequest.FoodSelection::quantity, Integer::sum));

        List<Food> foods = foodRepository.findAllById(foodQuantity.keySet());
        if (foods.size() != foodQuantity.size()) {
            throw new ResourceNotFoundException("Food selection contains invalid items");
        }

        return foods.stream().map(food -> {
            if (Boolean.FALSE.equals(food.getIsActive())) {
                throw new BookingException("Food item is not available: " + food.getName());
            }
            BookingFood bookingFood = new BookingFood();
            bookingFood.setBooking(booking);
            bookingFood.setFood(food);
            bookingFood.setQuantity(foodQuantity.get(food.getId()));
            bookingFood.setPrice(food.getPrice());
            return bookingFood;
        }).collect(Collectors.toCollection(LinkedHashSet::new));
    }
}

