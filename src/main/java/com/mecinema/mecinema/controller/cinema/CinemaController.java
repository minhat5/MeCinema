package com.mecinema.mecinema.controller.cinema;

import com.mecinema.mecinema.exception.CinemaNotFoundException;
import com.mecinema.mecinema.model.dto.cinema.CinemaApiResponse;
import com.mecinema.mecinema.service.CinemaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/movie/cinemas")
@RequiredArgsConstructor
public class CinemaController {

    private final CinemaService cinemaService;

    @GetMapping
    public ResponseEntity<?> getAllCinemas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            log.info("Fetching all cinemas - page: {}, size: {}", page, size);
            Pageable pageable = PageRequest.of(page, size);
            var cinemas = cinemaService.findAll(pageable);
            return ResponseEntity.ok(CinemaApiResponse.success(cinemas, "Fetched all cinemas successfully"));
        } catch (Exception e) {
            log.error("Error fetching cinemas", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CinemaApiResponse.internalError("Error fetching cinemas: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCinemaById(@PathVariable Long id) {
        try {
            log.info("Fetching cinema with id: {}", id);
            var cinema = cinemaService.findById(id);
            return ResponseEntity.ok(CinemaApiResponse.success(cinema, "Cinema retrieved successfully"));
        } catch (CinemaNotFoundException e) {
            log.warn("Cinema not found with id: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(CinemaApiResponse.notFound(e.getMessage()));
        } catch (Exception e) {
            log.error("Error fetching cinema", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CinemaApiResponse.internalError("Error fetching cinema: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchCinemas(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            log.info("Searching cinemas with keyword: {}", q);
            Pageable pageable = PageRequest.of(page, size);
            var cinemas = cinemaService.search(q, pageable);
            return ResponseEntity.ok(CinemaApiResponse.success(cinemas, "Search completed successfully"));
        } catch (Exception e) {
            log.error("Error searching cinemas", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CinemaApiResponse.internalError("Error searching cinemas: " + e.getMessage()));
        }
    }
}


