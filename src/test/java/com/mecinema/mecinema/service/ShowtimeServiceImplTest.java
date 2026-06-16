package com.mecinema.mecinema.service;

import com.mecinema.mecinema.model.dto.showtimes.ShowtimeDTO;
import com.mecinema.mecinema.model.dto.showtimes.UpdateShowtimeRequest;
import com.mecinema.mecinema.model.entity.Cinema;
import com.mecinema.mecinema.model.entity.Movie;
import com.mecinema.mecinema.model.entity.Room;
import com.mecinema.mecinema.model.entity.Showtime;
import com.mecinema.mecinema.model.enumtype.Status;
import com.mecinema.mecinema.repo.BookingRepository;
import com.mecinema.mecinema.repo.MovieRepository;
import com.mecinema.mecinema.repo.RoomRepository;
import com.mecinema.mecinema.repo.ShowtimeRepository;
import com.mecinema.mecinema.service.impl.ShowtimeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ShowtimeServiceImplTest {

    @Mock
    private ShowtimeRepository showtimeRepository;

    @Mock
    private BookingRepository bookingRepository;

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
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @BeforeEach
    void setUp() {
        movie = movie(1L, "Doraemon");
        cinema = cinema(1L, "MeCinema District 1");
        room = room(1L, cinema, "Room 1");
        startTime = LocalDateTime.now().plusDays(1);
        endTime = startTime.plusHours(2);
        showtime = showtime(10L, movie, room, startTime, endTime, BigDecimal.valueOf(90000));
    }

    @Test
    void updateShowtime_whenOnlyBasePriceProvided_updatesPriceWithoutTimeValidationOrConflictCheck() {
        UpdateShowtimeRequest request = UpdateShowtimeRequest.builder()
                .basePrice(BigDecimal.valueOf(120000))
                .build();

        when(showtimeRepository.findById(10L)).thenReturn(Optional.of(showtime));
        when(showtimeRepository.save(showtime)).thenReturn(showtime);

        ShowtimeDTO result = showtimeService.updateShowtime(10L, request);

        assertThat(result.getBasePrice()).isEqualByComparingTo("120000");
        assertThat(result.getStartTime()).isEqualTo(startTime);
        assertThat(result.getEndTime()).isEqualTo(endTime);
        verify(showtimeRepository, never()).findConflictingShowtimes(any(), any(), any());
        verify(roomRepository, never()).findById(any());
    }

    @Test
    void updateShowtime_whenStartAndEndTimeProvided_updatesTimeAndIgnoresCurrentShowtimeConflict() {
        LocalDateTime newStart = LocalDateTime.now().plusDays(2);
        LocalDateTime newEnd = newStart.plusHours(2);
        UpdateShowtimeRequest request = UpdateShowtimeRequest.builder()
                .startTime(newStart)
                .endTime(newEnd)
                .build();

        when(showtimeRepository.findById(10L)).thenReturn(Optional.of(showtime));
        when(showtimeRepository.findConflictingShowtimes(room.getId(), newStart, newEnd))
                .thenReturn(List.of(showtime));
        when(showtimeRepository.save(showtime)).thenReturn(showtime);

        ShowtimeDTO result = showtimeService.updateShowtime(10L, request);

        assertThat(result.getStartTime()).isEqualTo(newStart);
        assertThat(result.getEndTime()).isEqualTo(newEnd);
        verify(showtimeRepository).save(showtime);
    }

    @Test
    void updateShowtime_whenAnotherShowtimeConflicts_throwsAndDoesNotSave() {
        LocalDateTime newStart = LocalDateTime.now().plusDays(2);
        LocalDateTime newEnd = newStart.plusHours(2);
        Showtime conflictingShowtime = showtime(11L, movie, room, newStart.plusMinutes(30), newEnd, BigDecimal.valueOf(90000));
        UpdateShowtimeRequest request = UpdateShowtimeRequest.builder()
                .startTime(newStart)
                .endTime(newEnd)
                .build();

        when(showtimeRepository.findById(10L)).thenReturn(Optional.of(showtime));
        when(showtimeRepository.findConflictingShowtimes(room.getId(), newStart, newEnd))
                .thenReturn(List.of(showtime, conflictingShowtime));

        assertThatThrownBy(() -> showtimeService.updateShowtime(10L, request))
                .isInstanceOf(RuntimeException.class);

        verify(showtimeRepository, never()).save(any());
    }

    @Test
    void updateShowtime_whenStartTimeAfterEndTime_throwsAndDoesNotCheckConflict() {
        LocalDateTime newStart = LocalDateTime.now().plusDays(2);
        UpdateShowtimeRequest request = UpdateShowtimeRequest.builder()
                .startTime(newStart.plusHours(2))
                .endTime(newStart)
                .build();

        when(showtimeRepository.findById(10L)).thenReturn(Optional.of(showtime));

        assertThatThrownBy(() -> showtimeService.updateShowtime(10L, request))
                .isInstanceOf(RuntimeException.class);

        verify(showtimeRepository, never()).findConflictingShowtimes(any(), any(), any());
        verify(showtimeRepository, never()).save(any());
    }

    @Test
    void updateShowtime_whenRoomChangesWithinSameCinema_updatesRoomAndChecksConflict() {
        Room targetRoom = room(2L, cinema, "Room 2");
        UpdateShowtimeRequest request = UpdateShowtimeRequest.builder()
                .roomId(targetRoom.getId())
                .build();

        when(showtimeRepository.findById(10L)).thenReturn(Optional.of(showtime));
        when(roomRepository.findById(targetRoom.getId())).thenReturn(Optional.of(targetRoom));
        when(showtimeRepository.findConflictingShowtimes(targetRoom.getId(), startTime, endTime))
                .thenReturn(List.of());
        when(showtimeRepository.save(showtime)).thenReturn(showtime);

        ShowtimeDTO result = showtimeService.updateShowtime(10L, request);

        assertThat(result.getRoomId()).isEqualTo(targetRoom.getId());
        assertThat(result.getRoomName()).isEqualTo("Room 2");
        verify(bookingRepository, never()).existsByShowtimeIdAndStatusIn(any(), any());
    }

    @Test
    void updateShowtime_whenRoomChangesToDifferentCinemaWithBookings_throwsAndDoesNotSave() {
        Room targetRoom = room(3L, cinema(2L, "MeCinema District 2"), "Room 3");
        UpdateShowtimeRequest request = UpdateShowtimeRequest.builder()
                .roomId(targetRoom.getId())
                .build();

        when(showtimeRepository.findById(10L)).thenReturn(Optional.of(showtime));
        when(roomRepository.findById(targetRoom.getId())).thenReturn(Optional.of(targetRoom));
        when(bookingRepository.existsByShowtimeIdAndStatusIn(10L, Set.of(Status.PENDING, Status.SUCCESS)))
                .thenReturn(true);

        assertThatThrownBy(() -> showtimeService.updateShowtime(10L, request))
                .isInstanceOf(RuntimeException.class);

        verify(showtimeRepository, never()).findConflictingShowtimes(any(), any(), any());
        verify(showtimeRepository, never()).save(any());
    }

    @Test
    void updateShowtime_whenRoomChangesToDifferentCinemaWithoutBookings_updatesRoom() {
        Room targetRoom = room(3L, cinema(2L, "MeCinema District 2"), "Room 3");
        UpdateShowtimeRequest request = UpdateShowtimeRequest.builder()
                .roomId(targetRoom.getId())
                .build();

        when(showtimeRepository.findById(10L)).thenReturn(Optional.of(showtime));
        when(roomRepository.findById(targetRoom.getId())).thenReturn(Optional.of(targetRoom));
        when(bookingRepository.existsByShowtimeIdAndStatusIn(10L, Set.of(Status.PENDING, Status.SUCCESS)))
                .thenReturn(false);
        when(showtimeRepository.findConflictingShowtimes(targetRoom.getId(), startTime, endTime))
                .thenReturn(List.of());
        when(showtimeRepository.save(showtime)).thenReturn(showtime);

        ShowtimeDTO result = showtimeService.updateShowtime(10L, request);

        assertThat(result.getRoomId()).isEqualTo(targetRoom.getId());
        assertThat(result.getCinemaId()).isEqualTo(2L);
        assertThat(result.getCinemaName()).isEqualTo("MeCinema District 2");
    }

    @Test
    void updateShowtime_whenShowtimeDoesNotExist_throwsAndDoesNotSave() {
        when(showtimeRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> showtimeService.updateShowtime(999L, UpdateShowtimeRequest.builder().build()))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("999");

        verify(showtimeRepository, never()).save(any());
    }

    @Test
    void updateShowtime_savesMutatedShowtimeEntity() {
        LocalDateTime newStart = LocalDateTime.now().plusDays(3);
        LocalDateTime newEnd = newStart.plusMinutes(90);
        Room targetRoom = room(2L, cinema, "Room 2");
        UpdateShowtimeRequest request = UpdateShowtimeRequest.builder()
                .roomId(targetRoom.getId())
                .startTime(newStart)
                .endTime(newEnd)
                .basePrice(BigDecimal.valueOf(150000))
                .build();

        when(showtimeRepository.findById(10L)).thenReturn(Optional.of(showtime));
        when(roomRepository.findById(targetRoom.getId())).thenReturn(Optional.of(targetRoom));
        when(showtimeRepository.findConflictingShowtimes(targetRoom.getId(), newStart, newEnd))
                .thenReturn(List.of());
        when(showtimeRepository.save(any(Showtime.class))).thenAnswer(invocation -> invocation.getArgument(0));

        showtimeService.updateShowtime(10L, request);

        ArgumentCaptor<Showtime> captor = ArgumentCaptor.forClass(Showtime.class);
        verify(showtimeRepository).save(captor.capture());
        Showtime savedShowtime = captor.getValue();

        assertThat(savedShowtime.getId()).isEqualTo(10L);
        assertThat(savedShowtime.getRoom()).isSameAs(targetRoom);
        assertThat(savedShowtime.getStartTime()).isEqualTo(newStart);
        assertThat(savedShowtime.getEndTime()).isEqualTo(newEnd);
        assertThat(savedShowtime.getBasePrice()).isEqualByComparingTo("150000");
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
