package com.mecinema.mecinema.config;

import com.mecinema.mecinema.model.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    
    /**
     * Handle validation errors
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ApiResponse<Map<String, String>> response = new ApiResponse<>(
                HttpStatus.BAD_REQUEST.value(),
                "Lỗi xác thực dữ liệu",
                errors
        );
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    
    /**
     * Handle business logic exceptions
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<String>> handleRuntimeException(RuntimeException ex) {
        log.error("RuntimeException occurred: {}", ex.getMessage(), ex);
        
        ApiResponse<String> response = new ApiResponse<>(
                HttpStatus.BAD_REQUEST.value(),
                ex.getMessage(),
                null
        );
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    
    /**
     * Handle all other exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleGeneralException(Exception ex) {
        log.error("Exception occurred: {}", ex.getMessage(), ex);
        
        ApiResponse<String> response = new ApiResponse<>(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Đã xảy ra lỗi: " + ex.getMessage(),
                null
        );
        
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

