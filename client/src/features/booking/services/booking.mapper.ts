/**
 * booking.mapper.ts
 * Chịu trách nhiệm DUY NHẤT: transform backend BookingResponse → frontend shape.
 * Không import UI, không gọi API.
 */

// ── Seat type helpers ────────────────────────────────────────────────────────
export function mapSeatType(seatType: string): string {
  return seatType === 'STANDARD' ? 'NORMAL' : (seatType?.toUpperCase() || 'NORMAL');
}

// ── Sub-object mappers ────────────────────────────────────────────────────────
export function mapShowtime(res: any) {
  return {
    _id: String(res.showtime?.showtimeId),
    startTime: res.showtime?.startTime,
    endTime: res.showtime?.endTime,
    movieId: {
      _id: 'unknown',
      title: res.showtime?.movieTitle,
      poster: 'https://placehold.co/400x600?text=Movie',
    },
    roomId: {
      _id: String(res.showtime?.roomId),
      name: res.showtime?.roomName,
    },
    cinemaId: {
      _id: String(res.showtime?.cinemaId),
      name: res.showtime?.cinemaName,
    },
  };
}

export function mapSeats(res: any) {
  return (res.seats || []).map((s: any) => ({
    seatId: String(s.seatId),
    row: s.rowSymbol || 'A',
    column: s.seatNumber || 1,
    type: mapSeatType(s.seatType),
    price: Number(s.price) || 0,
  }));
}

export function mapTickets(res: any) {
  return (res.seats || []).map((s: any, idx: number) => ({
    _id: String(s.seatId),
    row: s.rowSymbol || 'A',
    col: s.seatNumber || 1,
    ticketCode: `TKT-${res.bookingId}-${idx}`,
  }));
}

export function mapFoods(res: any) {
  return (res.foods || []).map((f: any) => ({
    foodId: Number(f.foodId),
    name: f.name || '',
    quantity: f.quantity || 1,
    price: Number(f.price) || 0,
  }));
}

// ── Root mapper ───────────────────────────────────────────────────────────────
export function mapBookingResponse(res: any) {
  return {
    _id: String(res.bookingId),
    status: res.bookingStatus || 'PENDING',
    totalPrice: res.totalPrice,
    createdAt: res.bookingTime,
    showtimeId: mapShowtime(res),
    tickets: mapTickets(res),
    seats: mapSeats(res),
    foods: mapFoods(res),
  };
}
