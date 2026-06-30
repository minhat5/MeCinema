package com.mecinema.mecinema.service.support;

import com.mecinema.mecinema.config.BookingProperties;
import com.mecinema.mecinema.exception.BookingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class SeatSelectionValidatorTest {

    private SeatSelectionValidator validator;

    @BeforeEach
    void setUp() {
        BookingProperties bookingProperties = new BookingProperties();
        bookingProperties.getSelection().setMaxSeats(5);
        validator = new SeatSelectionValidator(null, null, bookingProperties);
    }

    @Test
    void validateSelection_whenSeatIdsIsNull_throwsBookingException() {
        assertThatThrownBy(() -> validator.validateSelection(null))
                .isInstanceOf(BookingException.class)
                .hasMessage("Seat selection cannot be empty");
    }

    @Test
    void validateSelection_whenSeatIdsIsEmpty_throwsBookingException() {
        assertThatThrownBy(() -> validator.validateSelection(List.of()))
                .isInstanceOf(BookingException.class)
                .hasMessage("Seat selection cannot be empty");
    }

    @Test
    void validateSelection_whenSeatIdsContainDuplicates_throwsBookingException() {
        assertThatThrownBy(() -> validator.validateSelection(List.of(1L, 1L)))
                .isInstanceOf(BookingException.class)
                .hasMessage("Seat selection contains duplicates");
    }

    @Test
    void validateSelection_whenSeatCountExceedsMaxSeats_throwsBookingException() {
        assertThatThrownBy(() -> validator.validateSelection(List.of(1L, 2L, 3L, 4L, 5L, 6L)))
                .isInstanceOf(BookingException.class)
                .hasMessage("Seat selection exceeds maximum limit");
    }

    @Test
    void validateSelection_whenSeatSelectionIsValid_doesNotThrowException() {
        assertThatCode(() -> validator.validateSelection(List.of(1L, 2L)))
                .doesNotThrowAnyException();
    }
}
