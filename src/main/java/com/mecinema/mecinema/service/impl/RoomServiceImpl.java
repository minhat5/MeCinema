package com.mecinema.mecinema.service.impl;

import com.mecinema.mecinema.exception.CinemaNotFoundException;
import com.mecinema.mecinema.exception.RoomNotFoundException;
import com.mecinema.mecinema.mapper.RoomMapper;
import com.mecinema.mecinema.model.dto.rooms.CreateRoomDto;
import com.mecinema.mecinema.model.dto.rooms.RoomDto;
import com.mecinema.mecinema.model.dto.rooms.UpdateRoomDto;
import com.mecinema.mecinema.model.entity.Cinema;
import com.mecinema.mecinema.model.entity.Room;
import com.mecinema.mecinema.repo.CinemaRepository;
import com.mecinema.mecinema.repo.RoomRepository;
import com.mecinema.mecinema.repo.RoomRepositoryExtended;
import com.mecinema.mecinema.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomServiceImpl implements RoomService {
    
    private final RoomRepository roomRepository;
    private final RoomRepositoryExtended roomRepositoryExtended;
    private final CinemaRepository cinemaRepository;
    private final RoomMapper roomMapper;
    
    @Override
    public RoomDto createRoom(CreateRoomDto createRoomDto) {
        // Kiểm tra chi nhánh có tồn tại không
        Cinema cinema = cinemaRepository.findById(createRoomDto.getCinemaId())
                .orElseThrow(() -> new CinemaNotFoundException(
                        "Chi nhánh với ID: " + createRoomDto.getCinemaId() + " không tồn tại"));
        
        Room room = new Room();
        room.setCinema(cinema);
        room.setName(createRoomDto.getName());
        
        // Lưu vào database
        Room savedRoom = roomRepository.save(room);
        
        return roomMapper.toDto(savedRoom);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<RoomDto> getRoomsByCinema(Long cinemaId, Pageable pageable) {
        // Kiểm tra chi nhánh có tồn tại không
        if (!cinemaRepository.existsById(cinemaId)) {
            throw new CinemaNotFoundException(
                    "Chi nhánh với ID: " + cinemaId + " không tồn tại");
        }
        
        // Lấy danh sách phòng theo chi nhánh (phân trang)
        Page<Room> rooms = roomRepositoryExtended.findByCinema(cinemaId, pageable);
        
        return rooms.map(roomMapper::toDto);
    }
    
    @Override
    @Transactional(readOnly = true)
    public RoomDto getRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException(
                        "Phòng chiếu với ID: " + roomId + " không tồn tại"));
        
        return roomMapper.toDto(room);
    }
    
    @Override
    public RoomDto updateRoom(Long roomId, UpdateRoomDto updateRoomDto) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException(
                        "Phòng chiếu với ID: " + roomId + " không tồn tại"));
        
        if (updateRoomDto.getName() != null && !updateRoomDto.getName().isBlank()) {
            room.setName(updateRoomDto.getName());
        }
        
        Room updatedRoom = roomRepository.save(room);
        
        return roomMapper.toDto(updatedRoom);
    }
    
    @Override
    public void deleteRoom(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RoomNotFoundException(
                        "Phòng chiếu với ID: " + roomId + " không tồn tại"));
        
        // Kiểm tra phòng có suất chiếu sắp tới không
        if (roomRepositoryExtended.hasUpcomingShowtimes(roomId)) {
            throw new IllegalStateException(
                    "Không thể xóa phòng vì còn suất chiếu sắp tới");
        }
        
        roomRepository.delete(room);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long roomId) {
        return roomRepository.existsById(roomId);
    }
}

