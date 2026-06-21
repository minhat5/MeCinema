package com.mecinema.mecinema.service;

import com.mecinema.mecinema.exception.RoomNotFoundException;
import com.mecinema.mecinema.exception.BookingException;
import com.mecinema.mecinema.mapper.SeatMapper;
import com.mecinema.mecinema.model.dto.seats.BulkCreateSeatsDto;
import com.mecinema.mecinema.model.dto.seats.SeatDto;
import com.mecinema.mecinema.model.entity.Room;
import com.mecinema.mecinema.model.entity.Seat;
import com.mecinema.mecinema.model.enumtype.SeatType;
import com.mecinema.mecinema.repo.RoomRepository;
import com.mecinema.mecinema.repo.SeatRepository;
import com.mecinema.mecinema.service.impl.SeatManagementServiceImpl;
import com.mecinema.mecinema.service.support.SeatLayoutBuilder;
import com.mecinema.mecinema.service.support.SeatValidationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SeatManagementServiceImplTest {

    @Mock
    private SeatRepository seatRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private SeatMapper seatMapper;

    @Mock
    private SeatValidationService seatValidationService;

    @Mock
    private SeatLayoutBuilder seatLayoutBuilder;

    @InjectMocks
    private SeatManagementServiceImpl seatManagementService;

    private Room room;

    @BeforeEach
    void setUp() {
        room = new Room();
        room.setId(1L);
        room.setName("Phòng số 1");
    }

    /**
     * TC_WBT_001 (Bao phủ Path 1):
     * Gửi yêu cầu tạo ghế hàng loạt với Room ID không tồn tại.
     * Mong đợi: Ném ra ngoại lệ RoomNotFoundException.
     */
    @Test
    void createSeatsInBulk_path1_roomNotFound_throwsRoomNotFoundException() {
        // Arrange
        BulkCreateSeatsDto dto = BulkCreateSeatsDto.builder()
                .roomId(999L)
                .rowSymbol("A")
                .startSeatNumber(1)
                .endSeatNumber(10)
                .type(SeatType.NORMAL)
                .build();

        when(roomRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> seatManagementService.createSeatsInBulk(dto))
                .isInstanceOf(RoomNotFoundException.class)
                .hasMessageContaining("Phòng chiếu với ID: 999 không tồn tại");

        // Verify
        verify(roomRepository, times(1)).findById(999L);
        verify(seatValidationService, never()).validateSeatUniqueness(any(), any(), any());
        verify(seatRepository, never()).saveAll(anyList());
    }

    /**
     * TC_WBT_002 (Bao phủ Path 2):
     * Gửi yêu cầu với khoảng số ghế bắt đầu lớn hơn số ghế kết thúc (start > end).
     * Mong đợi: Vòng lặp không chạy, lưu danh sách trống và trả về danh sách rỗng.
     */
    @Test
    void createSeatsInBulk_path2_startGreaterThanEnd_returnsEmptyList() {
        // Arrange
        BulkCreateSeatsDto dto = BulkCreateSeatsDto.builder()
                .roomId(1L)
                .rowSymbol("B")
                .startSeatNumber(5)
                .endSeatNumber(2) // 5 > 2
                .type(SeatType.NORMAL)
                .build();

        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        when(seatRepository.saveAll(Collections.emptyList())).thenReturn(Collections.emptyList());
        when(seatMapper.toDtoList(Collections.emptyList())).thenReturn(Collections.emptyList());

        // Act
        List<SeatDto> result = seatManagementService.createSeatsInBulk(dto);

        // Assert
        assertThat(result).isEmpty();

        // Verify
        verify(roomRepository, times(1)).findById(1L);
        verify(seatValidationService, never()).validateSeatUniqueness(any(), any(), any());
        verify(seatRepository, times(1)).saveAll(Collections.emptyList());
        verify(seatMapper, times(1)).toDtoList(Collections.emptyList());
    }

    /**
     * TC_WBT_003 (Bao phủ Path 3):
     * Phát hiện ghế bị trùng lặp khi chạy vòng lặp (gọi validate ném ra BookingException).
     * Mong đợi: Ném ra ngoại lệ BookingException và dừng lại lập tức.
     */
    @Test
    void createSeatsInBulk_path3_seatAlreadyExists_throwsBookingException() {
        // Arrange
        BulkCreateSeatsDto dto = BulkCreateSeatsDto.builder()
                .roomId(1L)
                .rowSymbol("C")
                .startSeatNumber(1)
                .endSeatNumber(3)
                .type(SeatType.NORMAL)
                .build();

        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        
        // Mock validate cho ghế 1 thành công
        doNothing().when(seatValidationService).validateSeatUniqueness(1L, "C", 1);
        // Mock validate cho ghế 2 thất bại (ném BookingException)
        doThrow(new BookingException("Ghế hàng C số 2 đã tồn tại trong phòng này"))
                .when(seatValidationService).validateSeatUniqueness(1L, "C", 2);

        // Act & Assert
        assertThatThrownBy(() -> seatManagementService.createSeatsInBulk(dto))
                .isInstanceOf(BookingException.class)
                .hasMessageContaining("Ghế hàng C số 2 đã tồn tại trong phòng này");

        // Verify
        verify(roomRepository, times(1)).findById(1L);
        verify(seatValidationService, times(1)).validateSeatUniqueness(1L, "C", 1);
        verify(seatValidationService, times(1)).validateSeatUniqueness(1L, "C", 2);
        verify(seatValidationService, never()).validateSeatUniqueness(1L, "C", 3);
        verify(seatRepository, never()).saveAll(anyList());
    }

    /**
     * TC_WBT_004 (Bao phủ Path 4):
     * Giao dịch thành công với danh sách ghế hợp lệ.
     * Mong đợi: Tạo các đối tượng ghế, lưu và trả về danh sách DTO tương ứng.
     */
    @Test
    void createSeatsInBulk_path4_success_returnsCreatedSeats() {
        // Arrange
        BulkCreateSeatsDto dto = BulkCreateSeatsDto.builder()
                .roomId(1L)
                .rowSymbol("D")
                .startSeatNumber(1)
                .endSeatNumber(3)
                .type(SeatType.VIP)
                .build();

        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        
        doNothing().when(seatValidationService).validateSeatUniqueness(1L, "D", 1);
        doNothing().when(seatValidationService).validateSeatUniqueness(1L, "D", 2);
        doNothing().when(seatValidationService).validateSeatUniqueness(1L, "D", 3);

        List<Seat> savedSeats = new ArrayList<>();
        for (int i = 1; i <= 3; i++) {
            Seat seat = new Seat();
            seat.setRoom(room);
            seat.setRowSymbol("D");
            seat.setSeatNumber(i);
            seat.setType(SeatType.VIP);
            savedSeats.add(seat);
        }

        when(seatRepository.saveAll(anyList())).thenReturn(savedSeats);

        List<SeatDto> dtoList = new ArrayList<>();
        for (int i = 1; i <= 3; i++) {
            SeatDto seatDto = new SeatDto();
            seatDto.setId((long) i);
            seatDto.setRowSymbol("D");
            seatDto.setSeatNumber(i);
            seatDto.setType(SeatType.VIP);
            dtoList.add(seatDto);
        }
        when(seatMapper.toDtoList(savedSeats)).thenReturn(dtoList);

        // Act
        List<SeatDto> result = seatManagementService.createSeatsInBulk(dto);

        // Assert
        assertThat(result).hasSize(3);
        assertThat(result.get(0).getRowSymbol()).isEqualTo("D");
        assertThat(result.get(0).getSeatNumber()).isEqualTo(1);
        assertThat(result.get(0).getType()).isEqualTo(SeatType.VIP);

        // Verify
        verify(roomRepository, times(1)).findById(1L);
        verify(seatValidationService, times(1)).validateSeatUniqueness(1L, "D", 1);
        verify(seatValidationService, times(1)).validateSeatUniqueness(1L, "D", 2);
        verify(seatValidationService, times(1)).validateSeatUniqueness(1L, "D", 3);
        verify(seatRepository, times(1)).saveAll(anyList());
        verify(seatMapper, times(1)).toDtoList(savedSeats);
    }
}
