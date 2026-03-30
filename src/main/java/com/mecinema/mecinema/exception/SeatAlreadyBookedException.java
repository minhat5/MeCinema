package com.mecinema.mecinema.exception;

public class SeatAlreadyBookedException extends BookingException {
    public SeatAlreadyBookedException(String message) {
        super(message);
    }
}

