package com.mecinema.mecinema.repo;

import com.mecinema.mecinema.model.entity.Seat;
import java.util.Collection;
import java.util.List;

public interface SeatRepositoryExtended {
    List<Seat> findAllByIdForUpdate(Collection<Long> seatIds);
    
    List<Seat> findByRoomIdAndRowSymbolAndSeatNumber(Long roomId, String rowSymbol, Integer seatNumber);
    
    boolean existsByRoomIdAndRowSymbolAndSeatNumber(Long roomId, String rowSymbol, Integer seatNumber);
}