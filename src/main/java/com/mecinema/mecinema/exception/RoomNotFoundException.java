package com.mecinema.mecinema.exception;

// Exception khi phòng chiếu không tìm thấy
public class RoomNotFoundException extends RuntimeException {
    public RoomNotFoundException(String message) {
        super(message);
    }
    
    public RoomNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}

