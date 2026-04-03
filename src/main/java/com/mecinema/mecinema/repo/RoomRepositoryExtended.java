package com.mecinema.mecinema.repo;

import com.mecinema.mecinema.model.entity.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

//Repository mở rộng cho Room Entity
public interface RoomRepositoryExtended {
    
    //Tìm các phòng theo chi nhánh
    Page<Room> findByCinema(Long cinemaId, Pageable pageable);
    
    // Kiểm tra xem phòng có suất chiếu sắp tới không
    boolean hasUpcomingShowtimes(Long roomId);
}

