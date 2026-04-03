package com.mecinema.mecinema.model.dto.cinema;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CinemaRequest {
    @NotBlank(message = "Cinema name is required")
    private String name;

    @NotBlank(message = "Cinema address is required")
    private String address;

    @NotBlank(message = "Cinema hotline is required")
    private String hotline;
}

