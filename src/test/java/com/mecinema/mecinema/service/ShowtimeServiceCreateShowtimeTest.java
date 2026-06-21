package com.mecinema.mecinema.service;

import com.mecinema.mecinema.model.dto.showtimes.CreateShowtimeRequest;
import com.mecinema.mecinema.model.dto.showtimes.ShowtimeDTO;
import com.mecinema.mecinema.model.entity.Cinema;
import com.mecinema.mecinema.model.entity.Movie;
import com.mecinema.mecinema.model.entity.Room;
import com.mecinema.mecinema.model.entity.Showtime;
import com.mecinema.mecinema.repo.MovieRepository;
import com.mecinema.mecinema.repo.RoomRepository;
import com.mecinema.mecinema.repo.ShowtimeRepository;
import com.mecinema.mecinema.service.impl.ShowtimeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShowtimeServiceCreateShowtimeTest {

    @Mock
    private ShowtimeRepository showtimeRepository;

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private ShowtimeServiceImpl showtimeService;

    private Movie movie;
    private Cinema cinema;
    private Room room;
    private Showtime showtime;

    @BeforeEach
    void setUp() {
        movie = movie(1L, "Doraemon");
        cinema = cinema(1L, "MeCinema District 1");
        room = room(1L, cinema, "Room 1");
        showtime = showtime(10L, movie, room, LocalDateTime.now().plusDays(1), LocalDateTime.now().plusDays(1).plusHours(2), BigDecimal.valueOf(90000));
    }

    /**
     * TC_WBT_009 (Bao phủ Path 1):
     * Thất bại do thời gian start/end null.
     */
    @Test
    void createShowtime_path1_timeNull_throwsRuntimeException() {
        CreateShowtimeRequest request = CreateShowtimeRequest.builder()
                .movieId(1L)
                .roomId(1L)
                .startTime(null)
                .endTime(LocalDateTime.now().plusDays(1))
                .basePrice(BigDecimal.valueOf(90000))
                .build();

        assertThatThrownBy(() -> showtimeService.createShowtime(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("không được để trống");
    }

    /**
     * TC_WBT_010 (Bao phủ Path 2):
     * Thất bại do thời gian start >= end.
     */
    @Test
    void createShowtime_path2_startTimeAfterEndTime_throwsRuntimeException() {
        LocalDateTime start = LocalDateTime.now().plusDays(1).plusHours(2);
        LocalDateTime end = LocalDateTime.now().plusDays(1);
        CreateShowtimeRequest request = CreateShowtimeRequest.builder()
                .movieId(1L)
                .roomId(1L)
                .startTime(start)
                .endTime(end)
                .basePrice(BigDecimal.valueOf(90000))
                .build();

        assertThatThrownBy(() -> showtimeService.createShowtime(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("phải trước thời gian kết thúc");
    }

    /**
     * TC_WBT_011 (Bao phủ Path 3):
     * Thất bại do thời gian start ở quá khứ.
     */
    @Test
    void createShowtime_path3_startTimeInPast_throwsRuntimeException() {
        LocalDateTime start = LocalDateTime.now().minusHours(1);
        LocalDateTime end = LocalDateTime.now().plusHours(1);
        CreateShowtimeRequest request = CreateShowtimeRequest.builder()
                .movieId(1L)
                .roomId(1L)
                .startTime(start)
                .endTime(end)
                .basePrice(BigDecimal.valueOf(90000))
                .build();

        assertThatThrownBy(() -> showtimeService.createShowtime(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("không được ở quá khứ");
    }

    /**
     * TC_WBT_012 (Bao phủ Path 4):
     * Thất bại do thời lượng suất chiếu không hợp lệ (Dưới 30m hoặc trên 5h).
     */
    @Test
    void createShowtime_path4_invalidDuration_throwsRuntimeException() {
        LocalDateTime start = LocalDateTime.now().plusDays(1);
        LocalDateTime end = start.plusMinutes(20); // duration = 20 minutes (too short)
        CreateShowtimeRequest request = CreateShowtimeRequest.builder()
                .movieId(1L)
                .roomId(1L)
                .startTime(start)
                .endTime(end)
                .basePrice(BigDecimal.valueOf(90000))
                .build();

        assertThatThrownBy(() -> showtimeService.createShowtime(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("phải từ 30 phút đến 5 giờ");
    }

    /**
     * TC_WBT_013 (Bao phủ Path 5):
     * Thất bại do phim ID không tồn tại.
     */
    @Test
    void createShowtime_path5_movieNotFound_throwsRuntimeException() {
        LocalDateTime start = LocalDateTime.now().plusDays(1);
        LocalDateTime end = start.plusHours(2);
        CreateShowtimeRequest request = CreateShowtimeRequest.builder()
                .movieId(999L)
                .roomId(1L)
                .startTime(start)
                .endTime(end)
                .basePrice(BigDecimal.valueOf(90000))
                .build();

        when(movieRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> showtimeService.createShowtime(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Bộ phim không tồn tại với ID: 999");
    }

    /**
     * TC_WBT_014 (Bao phủ Path 6):
     * Thất bại do phòng chiếu ID không tồn tại.
     */
    @Test
    void createShowtime_path6_roomNotFound_throwsRuntimeException() {
        LocalDateTime start = LocalDateTime.now().plusDays(1);
        LocalDateTime end = start.plusHours(2);
        CreateShowtimeRequest request = CreateShowtimeRequest.builder()
                .movieId(1L)
                .roomId(888L)
                .startTime(start)
                .endTime(end)
                .basePrice(BigDecimal.valueOf(90000))
                .build();

        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));
        when(roomRepository.findById(888L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> showtimeService.createShowtime(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Phòng chiếu không tồn tại với ID: 888");
    }

    /**
     * TC_WBT_015 (Bao phủ Path 7):
     * Thất bại do trùng lịch chiếu (Conflicting showtimes).
     */
    @Test
    void createShowtime_path7_conflictingShowtimes_throwsRuntimeException() {
        LocalDateTime start = LocalDateTime.now().plusDays(1);
        LocalDateTime end = start.plusHours(2);
        CreateShowtimeRequest request = CreateShowtimeRequest.builder()
                .movieId(1L)
                .roomId(1L)
                .startTime(start)
                .endTime(end)
                .basePrice(BigDecimal.valueOf(90000))
                .build();

        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        when(showtimeRepository.findConflictingShowtimes(1L, start, end))
                .thenReturn(List.of(showtime)); // Conflicting showtime found

        assertThatThrownBy(() -> showtimeService.createShowtime(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Phòng chiếu đã có lịch chiếu trong thời gian này");
    }

    /**
     * TC_WBT_016 (Bao phủ Path 8):
     * Tạo suất chiếu thành công.
     */
    @Test
    void createShowtime_path8_success_returnsCreatedShowtime() {
        LocalDateTime start = LocalDateTime.now().plusDays(1);
        LocalDateTime end = start.plusHours(2);
        CreateShowtimeRequest request = CreateShowtimeRequest.builder()
                .movieId(1L)
                .roomId(1L)
                .startTime(start)
                .endTime(end)
                .basePrice(BigDecimal.valueOf(90000))
                .build();

        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        when(showtimeRepository.findConflictingShowtimes(1L, start, end))
                .thenReturn(List.of());
        when(showtimeRepository.save(any(Showtime.class))).thenAnswer(invocation -> {
            Showtime s = invocation.getArgument(0);
            s.setId(100L);
            return s;
        });

        ShowtimeDTO result = showtimeService.createShowtime(request);

        assertThat(result.getId()).isEqualTo(100L);
        assertThat(result.getMovieId()).isEqualTo(1L);
        assertThat(result.getRoomId()).isEqualTo(1L);
        assertThat(result.getStartTime()).isEqualTo(start);
        assertThat(result.getEndTime()).isEqualTo(end);
        assertThat(result.getBasePrice()).isEqualByComparingTo("90000");

        verify(showtimeRepository, times(1)).save(any(Showtime.class));
    }

    private static Showtime showtime(
            Long id,
            Movie movie,
            Room room,
            LocalDateTime startTime,
            LocalDateTime endTime,
            BigDecimal basePrice
    ) {
        Showtime showtime = new Showtime();
        showtime.setId(id);
        showtime.setMovie(movie);
        showtime.setRoom(room);
        showtime.setStartTime(startTime);
        showtime.setEndTime(endTime);
        showtime.setBasePrice(basePrice);
        return showtime;
    }

    private static Movie movie(Long id, String title) {
        Movie movie = new Movie();
        movie.setId(id);
        movie.setTitle(title);
        movie.setDurationMinutes(120);
        return movie;
    }

    private static Room room(Long id, Cinema cinema, String name) {
        Room room = new Room();
        room.setId(id);
        room.setCinema(cinema);
        room.setName(name);
        return room;
    }

    private static Cinema cinema(Long id, String name) {
        Cinema cinema = new Cinema();
        cinema.setId(id);
        cinema.setName(name);
        cinema.setAddress("123 Nguyen Hue");
        cinema.setHotline("0900000000");
        return cinema;
    }
}
