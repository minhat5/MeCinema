package com.mecinema.mecinema.controller.admin;

import com.mecinema.mecinema.service.CinemaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cinemas")
@RequiredArgsConstructor
public class AdminCinemaController {

  private final CinemaService cinemaService;

  @GetMapping
  public ResponseEntity<?> getAllCinemas(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "100") int limit) {

    Pageable pageable = PageRequest.of(page, limit);
    Page<?> cinemas = cinemaService.findAll(pageable);

    return ResponseEntity.ok(cinemas);
  }
}
