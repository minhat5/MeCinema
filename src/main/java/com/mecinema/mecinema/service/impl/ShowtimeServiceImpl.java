package com.mecinema.mecinema.service.impl;

import com.mecinema.mecinema.model.dto.CreateShowtimeRequest;
import com.mecinema.mecinema.model.dto.PaginatedResponse;
import com.mecinema.mecinema.model.dto.ShowtimeDTO;
import com.mecinema.mecinema.model.dto.UpdateShowtimeRequest;
import com.mecinema.mecinema.model.entity.Movie;
import com.mecinema.mecinema.model.entity.Room;
import com.mecinema.mecinema.model.entity.Showtime;
import com.mecinema.mecinema.repo.MovieRepository;
import com.mecinema.mecinema.repo.RoomRepository;
import com.mecinema.mecinema.repo.ShowtimeRepository;
import com.mecinema.mecinema.service.ShowtimeService;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
@Builder
public class ShowtimeServiceImpl implements ShowtimeService {
    
    private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;
    
    @Override
    @Transactional(readOnly = true)
    public ShowtimeDTO getShowtimeById(Long id) {
        log.info("Fetching showtime with id: {}", id);
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Showtime not found with id: {}", id);
                    return new RuntimeException("Lịch chiếu không tồn tại với ID: " + id);
                });
        return convertToDTO(showtime);
    }
    
    @Override
    public ShowtimeDTO createShowtime(CreateShowtimeRequest request) {
        log.info("Creating new showtime for movie: {} and room: {}", request.getMovieId(), request.getRoomId());
        
        // Validate time
        validateShowtimeTime(request.getStartTime(), request.getEndTime());
        
        // Fetch movie
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> {
                    log.error("Movie not found with id: {}", request.getMovieId());
                    return new RuntimeException("Bộ phim không tồn tại với ID: " + request.getMovieId());
                });
        
        // Fetch room
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> {
                    log.error("Room not found with id: {}", request.getRoomId());
                    return new RuntimeException("Phòng chiếu không tồn tại với ID: " + request.getRoomId());
                });
        
        // Check for conflicting showtimes
        List<Showtime> conflicts = showtimeRepository.findConflictingShowtimes(
                room.getId(), 
                request.getStartTime(), 
                request.getEndTime()
        );
        
        if (!conflicts.isEmpty()) {
            log.warn("Conflict detected: Room {} already has showtime(s) during this period", room.getId());
            throw new RuntimeException("Phòng chiếu đã có lịch chiếu trong thời gian này. Vui lòng chọn thời gian khác.");
        }
        
        // Create showtime
        Showtime showtime = Showtime.builder()
                .movie(movie)
                .room(room)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .basePrice(request.getBasePrice())
                .build();
        
        showtime = showtimeRepository.save(showtime);
        log.info("Showtime created successfully with id: {}", showtime.getId());
        
        return convertToDTO(showtime);
    }
    
    @Override
    public ShowtimeDTO updateShowtime(Long id, UpdateShowtimeRequest request) {
        log.info("Updating showtime with id: {}", id);
        
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Showtime not found with id: {}", id);
                    return new RuntimeException("Lịch chiếu không tồn tại với ID: " + id);
                });
        
        // Update startTime if provided
        if (request.getStartTime() != null) {
            showtime.setStartTime(request.getStartTime());
        }
        
        // Update endTime if provided
        if (request.getEndTime() != null) {
            showtime.setEndTime(request.getEndTime());
        }
        
        // Update basePrice if provided
        if (request.getBasePrice() != null) {
            showtime.setBasePrice(request.getBasePrice());
        }
        
        // Validate time if either time was updated
        if (request.getStartTime() != null || request.getEndTime() != null) {
            validateShowtimeTime(showtime.getStartTime(), showtime.getEndTime());
            
            // Check for conflicting showtimes (excluding current showtime)
            List<Showtime> conflicts = showtimeRepository.findConflictingShowtimes(
                    showtime.getRoom().getId(), 
                    showtime.getStartTime(), 
                    showtime.getEndTime()
            );
            
            conflicts = conflicts.stream()
                    .filter(s -> !s.getId().equals(id))
                    .collect(Collectors.toList());
            
            if (!conflicts.isEmpty()) {
                log.warn("Conflict detected during update: Room {} has conflicting showtimes", showtime.getRoom().getId());
                throw new RuntimeException("Phòng chiếu đã có lịch chiếu trong thời gian này. Vui lòng chọn thời gian khác.");
            }
        }
        
        showtime = showtimeRepository.save(showtime);
        log.info("Showtime updated successfully with id: {}", id);
        
        return convertToDTO(showtime);
    }
    
    @Override
    public void deleteShowtime(Long id) {
        log.info("Deleting showtime with id: {}", id);
        
        if (!showtimeRepository.existsById(id)) {
            log.error("Showtime not found with id: {}", id);
            throw new RuntimeException("Lịch chiếu không tồn tại với ID: " + id);
        }
        
        showtimeRepository.deleteById(id);
        log.info("Showtime deleted successfully with id: {}", id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ShowtimeDTO> getShowtimesByMovie(Long movieId) {
        log.info("Fetching all showtimes for movie: {}", movieId);
        
        // Verify movie exists
        if (!movieRepository.existsById(movieId)) {
            log.error("Movie not found with id: {}", movieId);
            throw new RuntimeException("Bộ phim không tồn tại với ID: " + movieId);
        }
        
        List<Showtime> showtimes = showtimeRepository.findByMovieId(movieId);
        return showtimes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ShowtimeDTO> getShowtimesByRoom(Long roomId) {
        log.info("Fetching all showtimes for room: {}", roomId);
        
        // Verify room exists
        if (!roomRepository.existsById(roomId)) {
            log.error("Room not found with id: {}", roomId);
            throw new RuntimeException("Phòng chiếu không tồn tại với ID: " + roomId);
        }
        
        List<Showtime> showtimes = showtimeRepository.findByRoomId(roomId);
        return showtimes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public PaginatedResponse<ShowtimeDTO> getShowtimesByCinema(Long cinemaId, Pageable pageable) {
        log.info("Fetching showtimes for cinema: {} with pagination", cinemaId);
        
        Page<Showtime> page = showtimeRepository.findByCinemaId(cinemaId, pageable);
        
        List<ShowtimeDTO> content = page.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return PaginatedResponse.<ShowtimeDTO>builder()
                .content(content)
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public PaginatedResponse<ShowtimeDTO> getUpcomingShowtimes(Pageable pageable) {
        log.info("Fetching upcoming showtimes");
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime weekLater = now.plusWeeks(1);
        
        Page<Showtime> page = showtimeRepository.findUpcomingShowtimes(now, weekLater, pageable);
        
        List<ShowtimeDTO> content = page.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return PaginatedResponse.<ShowtimeDTO>builder()
                .content(content)
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ShowtimeDTO> getShowtimesOfDay(LocalDate date) {
        log.info("Fetching showtimes for date: {}", date);
        
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        
        List<Showtime> showtimes = showtimeRepository.findShowtimesBetween(startOfDay, endOfDay);
        
        return showtimes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public PaginatedResponse<ShowtimeDTO> getAllShowtimes(Pageable pageable) {
        log.info("Fetching all showtimes with pagination");
        
        Page<Showtime> page = showtimeRepository.findAll(pageable);
        
        List<ShowtimeDTO> content = page.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return PaginatedResponse.<ShowtimeDTO>builder()
                .content(content)
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();
    }
    
    /**
     * Convert Showtime entity to ShowtimeDTO
     */
    private ShowtimeDTO convertToDTO(Showtime showtime) {
        return ShowtimeDTO.builder()
                .id(showtime.getId())
                .movieId(showtime.getMovie().getId())
                .movieTitle(showtime.getMovie().getTitle())
                .roomId(showtime.getRoom().getId())
                .roomName(showtime.getRoom().getName())
                .cinemaId(showtime.getRoom().getCinema().getId())
                .cinemaName(showtime.getRoom().getCinema().getName())
                .startTime(showtime.getStartTime())
                .endTime(showtime.getEndTime())
                .basePrice(showtime.getBasePrice())
                .createdAt(showtime.getCreatedAt())
                .updatedAt(showtime.getUpdatedAt())
                .build();
    }
    
    /**
     * Validate showtime time
     */
    private void validateShowtimeTime(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime == null || endTime == null) {
            throw new RuntimeException("Thời gian bắt đầu và kết thúc không được để trống");
        }
        
        if (!startTime.isBefore(endTime)) {
            throw new RuntimeException("Thời gian bắt đầu phải trước thời gian kết thúc");
        }
        
        if (startTime.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Thời gian bắt đầu không được ở quá khứ");
        }
        
        // Check duration (should be between 30 minutes and 5 hours)
        long durationMinutes = java.time.temporal.ChronoUnit.MINUTES.between(startTime, endTime);
        if (durationMinutes < 30 || durationMinutes > 300) {
            throw new RuntimeException("Thời lượng lịch chiếu phải từ 30 phút đến 5 giờ");
        }
    }
}

