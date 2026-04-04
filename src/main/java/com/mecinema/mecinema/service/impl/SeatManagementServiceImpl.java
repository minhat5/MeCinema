package com.mecinema.mecinema.service.impl;

import com.mecinema.mecinema.exception.RoomNotFoundException;
import com.mecinema.mecinema.exception.ResourceNotFoundException;
import com.mecinema.mecinema.mapper.SeatMapper;
import com.mecinema.mecinema.model.dto.seats.*;
import com.mecinema.mecinema.model.entity.Room;
import com.mecinema.mecinema.model.entity.Seat;
import com.mecinema.mecinema.model.enumtype.SeatType;
import com.mecinema.mecinema.repo.RoomRepository;
import com.mecinema.mecinema.repo.SeatRepository;
import com.mecinema.mecinema.service.SeatManagementService;
import com.mecinema.mecinema.service.support.SeatValidationService;
import com.mecinema.mecinema.service.support.SeatLayoutBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SeatManagementServiceImpl implements SeatManagementService {

    private final SeatRepository seatRepository;
    private final RoomRepository roomRepository;
    private final SeatMapper seatMapper;
    private final SeatValidationService seatValidationService;
    private final SeatLayoutBuilder seatLayoutBuilder;

    @Override
    public SeatDto createSeat(CreateSeatDto createSeatDto) {
        // Validate room exists
        Room room = roomRepository.findById(createSeatDto.getRoomId())
                .orElseThrow(() -> new RoomNotFoundException(
                        "Phòng chiếu với ID: " + createSeatDto.getRoomId() + " không tồn tại"));

        // Validate seat doesn't already exist
        seatValidationService.validateSeatUniqueness(
                createSeatDto.getRoomId(),
                createSeatDto.getRowSymbol(),
                createSeatDto.getSeatNumber()
        );

        // Create and save seat
        Seat seat = new Seat();
        seat.setRoom(room);
        seat.setRowSymbol(createSeatDto.getRowSymbol());
        seat.setSeatNumber(createSeatDto.getSeatNumber());
        seat.setType(createSeatDto.getType());

        Seat savedSeat = seatRepository.save(seat);
        return seatMapper.toDto(savedSeat);
    }

    @Override
    public List<SeatDto> createSeatsInBulk(BulkCreateSeatsDto bulkCreateSeatsDto) {
        // Validate room exists
        Room room = roomRepository.findById(bulkCreateSeatsDto.getRoomId())
                .orElseThrow(() -> new RoomNotFoundException(
                        "Phòng chiếu với ID: " + bulkCreateSeatsDto.getRoomId() + " không tồn tại"));

        List<Seat> seatsToCreate = new ArrayList<>();
        
        // Create seats for the range
        for (int seatNum = bulkCreateSeatsDto.getStartSeatNumber(); 
             seatNum <= bulkCreateSeatsDto.getEndSeatNumber(); seatNum++) {
            
            // Validate each seat uniqueness
            seatValidationService.validateSeatUniqueness(
                    bulkCreateSeatsDto.getRoomId(),
                    bulkCreateSeatsDto.getRowSymbol(),
                    seatNum
            );

            Seat seat = new Seat();
            seat.setRoom(room);
            seat.setRowSymbol(bulkCreateSeatsDto.getRowSymbol());
            seat.setSeatNumber(seatNum);
            seat.setType(bulkCreateSeatsDto.getType());
            seatsToCreate.add(seat);
        }

        // Save all seats
        List<Seat> savedSeats = seatRepository.saveAll(seatsToCreate);
        return seatMapper.toDtoList(savedSeats);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SeatDto> getSeatsByRoom(Long roomId, Pageable pageable) {
        // Validate room exists
        validateRoomExists(roomId);

        List<Seat> allSeats = seatRepository.findByRoomIdOrderByRowSymbolAscSeatNumberAsc(roomId);
        List<SeatDto> seatDtos = allSeats.stream()
                .map(seatMapper::toDto)
                .toList();
        
        List<SeatDto> pageContent = seatDtos.stream()
                .skip(pageable.getOffset())
                .limit(pageable.getPageSize())
                .toList();

        return new org.springframework.data.domain.PageImpl<>(
                pageContent,
                pageable,
                seatDtos.size()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public SeatMapLayoutDto getSeatMapLayout(Long roomId) {
        // Validate room exists
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException(
                        "Phòng chiếu với ID: " + roomId + " không tồn tại"));

        List<Seat> seats = seatRepository.findByRoomIdOrderByRowSymbolAscSeatNumberAsc(roomId);
        
        return seatLayoutBuilder.buildLayout(room, seats);
    }

    @Override
    @Transactional(readOnly = true)
    public SeatDto getSeatById(Long seatId) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Ghế với ID: " + seatId + " không tồn tại"));
        return seatMapper.toDto(seat);
    }

    @Override
    public SeatDto updateSeat(Long seatId, UpdateSeatDto updateSeatDto) {
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Ghế với ID: " + seatId + " không tồn tại"));

        // Update seat type
        seat.setType(updateSeatDto.getType());
        
        Seat updatedSeat = seatRepository.save(seat);
        return seatMapper.toDto(updatedSeat);
    }

    @Override
    public void deleteSeat(Long seatId) {
        if (!seatRepository.existsById(seatId)) {
            throw new ResourceNotFoundException(
                    "Ghế với ID: " + seatId + " không tồn tại");
        }
        seatRepository.deleteById(seatId);
    }

    @Override
    public void deleteAllSeatsByRoom(Long roomId) {
        // Validate room exists
        validateRoomExists(roomId);

        List<Seat> seats = seatRepository.findByRoomIdOrderByRowSymbolAscSeatNumberAsc(roomId);
        seatRepository.deleteAll(seats);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean seatExists(Long roomId, String rowSymbol, Integer seatNumber) {
        return seatRepository.existsByRoomIdAndRowSymbolAndSeatNumber(roomId, rowSymbol, seatNumber);
    }

    private void validateRoomExists(Long roomId) {
        if (!roomRepository.existsById(roomId)) {
            throw new RoomNotFoundException(
                    "Phòng chiếu với ID: " + roomId + " không tồn tại");
        }
    }
}

