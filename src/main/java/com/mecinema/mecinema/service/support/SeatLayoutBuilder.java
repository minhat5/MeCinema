package com.mecinema.mecinema.service.support;

import com.mecinema.mecinema.model.dto.seats.SeatDto;
import com.mecinema.mecinema.model.dto.seats.SeatMapLayoutDto;
import com.mecinema.mecinema.model.entity.Room;
import com.mecinema.mecinema.model.entity.Seat;
import com.mecinema.mecinema.model.enumtype.SeatType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeatLayoutBuilder {

    /**
     * Build a seat map layout for a room
     */
    public SeatMapLayoutDto buildLayout(Room room, List<Seat> seats) {
        List<SeatDto> seatDtos = seats.stream()
                .map(this::mapSeatToDto)
                .collect(Collectors.toList());

        Set<String> rowSymbols = extractRowSymbols(seats);
        Integer maxSeatNumber = findMaxSeatNumber(seats);

        SeatMapLayoutDto.SeatLayoutStats stats = calculateStats(seats);

        return SeatMapLayoutDto.builder()
                .roomId(room.getId())
                .roomName(room.getName())
                .rowSymbols(rowSymbols)
                .maxSeatNumberPerRow(maxSeatNumber)
                .seats(seatDtos)
                .stats(stats)
                .build();
    }

    private SeatDto mapSeatToDto(Seat seat) {
        return SeatDto.builder()
                .id(seat.getId())
                .rowSymbol(seat.getRowSymbol())
                .seatNumber(seat.getSeatNumber())
                .type(seat.getType())
                .build();
    }

    private Set<String> extractRowSymbols(List<Seat> seats) {
        return seats.stream()
                .map(Seat::getRowSymbol)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private Integer findMaxSeatNumber(List<Seat> seats) {
        return seats.stream()
                .map(Seat::getSeatNumber)
                .max(Integer::compareTo)
                .orElse(0);
    }

    private SeatMapLayoutDto.SeatLayoutStats calculateStats(List<Seat> seats) {
        long totalSeats = seats.size();
        long normalSeats = seats.stream()
                .filter(s -> s.getType() == SeatType.NORMAL)
                .count();
        long vipSeats = seats.stream()
                .filter(s -> s.getType() == SeatType.VIP)
                .count();
        long sweetboxSeats = seats.stream()
                .filter(s -> s.getType() == SeatType.SWEETBOX)
                .count();

        return SeatMapLayoutDto.SeatLayoutStats.builder()
                .totalSeats((int) totalSeats)
                .normalSeats((int) normalSeats)
                .vipSeats((int) vipSeats)
                .sweetboxSeats((int) sweetboxSeats)
                .build();
    }
}

