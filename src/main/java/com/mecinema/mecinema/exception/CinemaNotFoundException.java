package com.mecinema.mecinema.exception;

// Exception khi chi nhánh không tìm thấy
public class CinemaNotFoundException extends RuntimeException {
    public CinemaNotFoundException(String message) {
        super(message);
    }
    
    public CinemaNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

