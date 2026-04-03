package com.mecinema.mecinema.repo.impl;

import com.mecinema.mecinema.model.entity.Room;
import com.mecinema.mecinema.repo.RoomRepositoryExtended;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

//Implementation của RoomRepositoryExtended
@Repository
public class RoomRepositoryExtendedImpl implements RoomRepositoryExtended {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public Page<Room> findByCinema(Long cinemaId, Pageable pageable) {
        // Lấy danh sách phòng theo chi nhánh
        List<Room> rooms = entityManager.createQuery(
                "SELECT r FROM Room r WHERE r.cinema.id = :cinemaId", Room.class)
                .setParameter("cinemaId", cinemaId)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();
        
        // Lấy tổng số phòng
        Long total = (Long) entityManager.createQuery(
                "SELECT COUNT(r) FROM Room r WHERE r.cinema.id = :cinemaId")
                .setParameter("cinemaId", cinemaId)
                .getSingleResult();
        
        return new PageImpl<>(rooms, pageable, total);
    }
    
    @Override
    public boolean hasUpcomingShowtimes(Long roomId) {
        Long count = (Long) entityManager.createQuery(
                "SELECT COUNT(s) FROM Showtime s WHERE s.room.id = :roomId AND s.startTime > :now")
                .setParameter("roomId", roomId)
                .setParameter("now", LocalDateTime.now())
                .getSingleResult();
        
        return count > 0;
    }
}

