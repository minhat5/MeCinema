package com.mecinema.mecinema.repo;

import com.mecinema.mecinema.model.entity.Showtime;
import com.mecinema.mecinema.model.enumtype.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    @Query("SELECT s FROM Showtime s WHERE s.movie.id = :movieId ORDER BY s.startTime ASC")
    List<Showtime> findByMovieId(@Param("movieId") Long movieId);
    @Query("SELECT s FROM Showtime s WHERE s.room.id = :roomId ORDER BY s.startTime ASC")
    List<Showtime> findByRoomId(@Param("roomId") Long roomId);
    @Query("SELECT s FROM Showtime s WHERE s.startTime >= :startDate AND s.endTime <= :endDate ORDER BY s.startTime ASC")
    List<Showtime> findShowtimesBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    @Query("SELECT s FROM Showtime s WHERE s.movie.id = :movieId AND s.startTime >= :startDate AND s.endTime <= :endDate ORDER BY s.startTime ASC")
    List<Showtime> findConflictingShowtimes(@Param("roomId") Long roomId, 
                                             @Param("startTime") LocalDateTime startTime, 
                                             @Param("endTime") LocalDateTime endTime);
    @Query("SELECT s FROM Showtime s JOIN s.room r WHERE r.cinema.id = :cinemaId ORDER BY s.startTime ASC")
    Page<Showtime> findByCinemaId(@Param("cinemaId") Long cinemaId, Pageable pageable);
    @Query("SELECT s FROM Showtime s WHERE s.startTime BETWEEN :now AND :weekLater ORDER BY s.startTime ASC")
    Page<Showtime> findUpcomingShowtimes(@Param("now") LocalDateTime now, @Param("weekLater") LocalDateTime weekLater, Pageable pageable);
    @Query("""
    select (count(b) > 0)
    from Booking b
    join b.showtime s
    where s.movie.id = :movieId
      and b.status = :status
""")
    boolean existsBookingByMovieAndStatus(@Param("movieId") Long movieId,
                                          @Param("status") Status status);

    @Query("""
    select (count(s) > 0)
    from Showtime s
    where s.movie.id = :movieId
      and s.startTime between :now and :threshold
""")
    boolean existsShowtimeStartingSoon(@Param("movieId") Long movieId,
                                       @Param("now") LocalDateTime now,
                                       @Param("threshold") LocalDateTime threshold);
}

