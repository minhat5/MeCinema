package com.mecinema.mecinema.mapper.impl;

import com.mecinema.mecinema.mapper.RoomMapper;
import com.mecinema.mecinema.model.dto.rooms.RoomDto;
import com.mecinema.mecinema.model.entity.Room;
import org.springframework.stereotype.Component;

@Component
public class RoomMapperImpl implements RoomMapper {
    
    @Override
    public RoomDto toDto(Room room) {
        if (room == null) {
            return null;
        }
        
        return RoomDto.builder()
                .id(room.getId())
                .cinemaId(room.getCinema().getId())
                .cinemaName(room.getCinema().getName())
                .name(room.getName())
                .createdAt(room.getCreatedAt())
                .updatedAt(room.getUpdatedAt())
                .build();
    }
    
    @Override
    public Room toEntity(RoomDto roomDto) {
        if (roomDto == null) {
            return null;
        }
        
        Room room = new Room();
        room.setId(roomDto.getId());
        room.setName(roomDto.getName());
        return room;
    }
}

