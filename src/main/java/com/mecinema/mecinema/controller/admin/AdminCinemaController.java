package com.mecinema.mecinema.controller.admin;

import com.mecinema.mecinema.exception.CinemaNotFoundException;
import com.mecinema.mecinema.model.dto.cinema.CinemaApiResponse;
import com.mecinema.mecinema.model.dto.cinema.CinemaRequest;
import com.mecinema.mecinema.model.dto.cinema.UpdateCinemaRequest;
import com.mecinema.mecinema.service.CinemaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/cinemas")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCinemaController {

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

    @PostMapping
    public ResponseEntity<?> createCinema(@Valid @RequestBody CinemaRequest request) {
        try {
            log.info("Creating cinema: {}", request.getName());
            var createdCinema = cinemaService.create(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(CinemaApiResponse.created(createdCinema, "Cinema created successfully"));
        } catch (Exception e) {
            log.error("Error creating cinema", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(CinemaApiResponse.badRequest("Error creating cinema: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCinema(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCinemaRequest request) {
        try {
            log.info("Updating cinema with id: {}", id);
            var updatedCinema = cinemaService.update(id, request);
            return ResponseEntity.ok(CinemaApiResponse.success(updatedCinema, "Cinema updated successfully"));
        } catch (CinemaNotFoundException e) {
            log.warn("Cinema not found with id: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(CinemaApiResponse.notFound(e.getMessage()));
        } catch (Exception e) {
            log.error("Error updating cinema", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(CinemaApiResponse.badRequest("Error updating cinema: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCinema(@PathVariable Long id) {
        try {
            log.info("Deleting cinema with id: {}", id);
            cinemaService.delete(id);
            return ResponseEntity.ok(CinemaApiResponse.success(null, "Cinema deleted successfully"));
        } catch (CinemaNotFoundException e) {
            log.warn("Cinema not found with id: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(CinemaApiResponse.notFound(e.getMessage()));
        } catch (Exception e) {
            log.error("Error deleting cinema", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CinemaApiResponse.internalError("Error deleting cinema: " + e.getMessage()));
        }
    }
}
