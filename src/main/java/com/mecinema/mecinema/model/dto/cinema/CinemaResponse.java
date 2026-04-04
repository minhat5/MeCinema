package com.mecinema.mecinema.model.dto.cinema;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CinemaResponse {
    private Long id;
    private String name;
    private String address;
    private String hotline;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

