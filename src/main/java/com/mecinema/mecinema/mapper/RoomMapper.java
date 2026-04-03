package com.mecinema.mecinema.mapper;

import com.mecinema.mecinema.model.dto.RoomDto;
import com.mecinema.mecinema.model.entity.Room;

// Interface Mapper cho Room Entity
public interface RoomMapper {
    RoomDto toDto(Room room);
    Room toEntity(RoomDto roomDto);
}

