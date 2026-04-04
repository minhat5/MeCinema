package com.mecinema.mecinema.model.dto.cinema;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CinemaApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private String error;
    private int statusCode;

    public static <T> CinemaApiResponse<T> success(T data, String message) {
        return CinemaApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .statusCode(200)
                .build();
    }

    public static <T> CinemaApiResponse<T> created(T data, String message) {
        return CinemaApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .statusCode(201)
                .build();
    }

    public static <T> CinemaApiResponse<T> error(String error, int statusCode) {
        return CinemaApiResponse.<T>builder()
                .success(false)
                .error(error)
                .statusCode(statusCode)
                .build();
    }

    public static <T> CinemaApiResponse<T> notFound(String error) {
        return error(error, 404);
    }

    public static <T> CinemaApiResponse<T> badRequest(String error) {
        return error(error, 400);
    }

    public static <T> CinemaApiResponse<T> internalError(String error) {
        return error(error, 500);
    }
}

