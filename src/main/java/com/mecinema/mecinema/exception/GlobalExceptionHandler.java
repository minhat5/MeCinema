package com.mecinema.mecinema.exception;

import com.mecinema.mecinema.model.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    //Xử lý RoomNotFoundException
    @ExceptionHandler(RoomNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleRoomNotFoundException(
            RoomNotFoundException ex,
            WebRequest request) {
        
        log.warn("RoomNotFoundException: {}", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(
                        HttpStatus.NOT_FOUND.value(),
                        ex.getMessage(),
                        null
                )
        );
    }
    
    //Xử lý CinemaNotFoundException
    @ExceptionHandler(CinemaNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleCinemaNotFoundException(
            CinemaNotFoundException ex,
            WebRequest request) {
        
        log.warn("CinemaNotFoundException: {}", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ApiResponse<>(
                        HttpStatus.NOT_FOUND.value(),
                        ex.getMessage(),
                        null
                )
        );
    }
    
    //Xử lý validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationException(
            MethodArgumentNotValidException ex,
            WebRequest request) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        log.warn("Validation error: {}", errors);
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                new ApiResponse<>(
                        HttpStatus.BAD_REQUEST.value(),
                        "Dữ liệu không hợp lệ",
                        errors
                )
        );
    }
    
    //Xử lý IllegalStateException
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalStateException(
            IllegalStateException ex,
            WebRequest request) {
        
        log.warn("IllegalStateException: {}", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                new ApiResponse<>(
                        HttpStatus.BAD_REQUEST.value(),
                        ex.getMessage(),
                        null
                )
        );
    }
    
    //Xử lý các exception khác
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGlobalException(
            Exception ex,
            WebRequest request) {
        
        log.error("Unexpected exception: ", ex);
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiResponse<>(
                        HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        "Đã xảy ra lỗi hệ thống",
                        null
                )
        );
    }
}

