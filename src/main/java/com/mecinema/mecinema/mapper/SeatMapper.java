package com.mecinema.mecinema.mapper;

import com.mecinema.mecinema.model.dto.seats.SeatDto;
import com.mecinema.mecinema.model.entity.Seat;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SeatMapper {

    public SeatDto toDto(Seat seat) {
        if (seat == null) {
            return null;
        }
        return SeatDto.builder()
                .id(seat.getId())
                .rowSymbol(seat.getRowSymbol())
                .seatNumber(seat.getSeatNumber())
                .type(seat.getType())
                .build();
    }

    public List<SeatDto> toDtoList(List<Seat> seats) {
        return seats.stream()
                .map(this::toDto)
                .toList();
    }

    public Seat toEntity(SeatDto dto) {
        if (dto == null) {
            return null;
        }
        Seat seat = new Seat();
        seat.setId(dto.getId());
        seat.setRowSymbol(dto.getRowSymbol());
        seat.setSeatNumber(dto.getSeatNumber());
        seat.setType(dto.getType());
        return seat;
    }
}

