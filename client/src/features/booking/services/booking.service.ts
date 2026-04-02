import apiClient from '@/lib/api-client';
import type {
  ApiResponse,
  BookingType,
  CreateBooking,
  RoomType,
  ShowtimeType,
  PaginationMeta,
} from '@shared/index';

export const getSeatMapApi = async (
  showtimeId: string,
): Promise<
  ApiResponse<{
    showtime: ShowtimeType & { roomId: RoomType };
    bookedSeatIds: string[];
  }>
> => {
  const [showtimeRes, seatsRes] = await Promise.all([
    apiClient.get(`/showtimes/${showtimeId}`),
    apiClient.get(`/bookings/showtimes/${showtimeId}/seats`),
  ]);

  const st = (showtimeRes as any).data;
  const seatsData = (seatsRes as any).data || seatsRes; // Some API responses wrap in data

  const backendSeats = seatsData?.seats || [];

  const mappedSeats = backendSeats.map((s: any) => ({
    seatId: String(s.seatId),
    row: s.rowSymbol || 'A',
    column: s.seatNumber || 1,
    type: s.seatType === 'STANDARD' ? 'NORMAL' : (s.seatType?.toUpperCase() || 'NORMAL'),
    isActive: true,
  }));

  const bookedSeatIds = backendSeats
    .filter((s: any) => s.status && s.status !== 'AVAILABLE')
    .map((s: any) => String(s.seatId));

  const showtime: any = {
    _id: String(st.id),
    movieId: { _id: String(st.movieId), title: st.movieTitle },
    cinemaId: { _id: String(st.cinemaId), name: st.cinemaName },
    roomId: {
      _id: String(st.roomId),
      name: st.roomName,
      seats: mappedSeats,
    },
    startTime: st.startTime ? String(st.startTime).replace(' ', 'T') : '',
    endTime: st.endTime ? String(st.endTime).replace(' ', 'T') : '',
    price: 60000, // mock base price as backend might not return it directly here
  };

  return {
    data: {
      showtime,
      bookedSeatIds,
    },
  } as any;
};

export const createBookingApi = async (
  data: CreateBooking,
): Promise<ApiResponse<BookingType>> => {
  // Map frontend CreateBooking payload to Backend BookingRequest
  const payLoad = {
    showtimeId: Number((data as any).showtimeId),
    seatIds: (data as any).seats.map((s: any) => Number(s.seatId)),
    foods: [], // Food selection not yet implemented in frontend payload
  };
  const res = await apiClient.post('/bookings', payLoad);
  const responseData = (res as any).data || res;
  return {
    data: {
      ...responseData,
      _id: String(responseData.bookingId || responseData.id || ''),
    },
  } as any;
};

export const getMyBookingApi = async (query?: {
  page?: number;
  limit?: number;
}): Promise<ApiResponse<{ bookings: BookingType[]; meta: PaginationMeta }>> => {
  const result = await apiClient.get('/bookings/me', {
    params: {
      page: query?.page ? query.page - 1 : 0,
      size: query?.limit || 10,
    },
  });
  const pageData = (result as any).data || result;

  const mappedBookings = (pageData.content || []).map((res: any) => {
    const mappedShowtime = {
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

    const mappedTickets = (res.seats || []).map((s: any, idx: number) => ({
      _id: String(s.seatId),
      row: s.rowSymbol || 'A',
      col: s.seatNumber || 1,
      ticketCode: `TKT-${res.bookingId}-${idx}`,
    }));

    const mappedSeats = (res.seats || []).map((s: any) => ({
      seatId: String(s.seatId),
      row: s.rowSymbol || 'A',
      column: s.seatNumber || 1,
      type: s.seatType === 'STANDARD' ? 'NORMAL' : (s.seatType?.toUpperCase() || 'NORMAL'),
      price: s.price || 0,
    }));

    return {
      _id: String(res.bookingId),
      status: res.bookingStatus || 'PENDING',
      totalPrice: res.totalPrice,
      createdAt: res.bookingTime,
      showtimeId: mappedShowtime,
      tickets: mappedTickets,
      seats: mappedSeats,
    };
  });

  return {
    data: {
      bookings: mappedBookings,
      meta: {
        currentPage: (pageData.number || 0) + 1,
        totalItems: pageData.totalElements || 0,
        totalPages: pageData.totalPages || 1,
        itemsPerPage: pageData.size || 10,
      },
    },
  } as any;
};

export const getBookingDetailApi = async (
  id: string,
): Promise<ApiResponse<BookingType>> => {
  const backendRes = await apiClient.get(`/bookings/${id}`);
  const res = (backendRes as any).data || backendRes;

  const mappedShowtime = {
    _id: String(res.showtime?.showtimeId),
    startTime: res.showtime?.startTime,
    endTime: res.showtime?.endTime,
    movieId: {
      _id: 'unknown',
      title: res.showtime?.movieTitle,
      poster: 'https://placehold.co/400x600?text=Movie', // Mock poster since backend BookingResponse lacks it
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

  const mappedTickets = (res.seats || []).map((s: any, idx: number) => ({
    _id: String(s.seatId),
    row: s.rowSymbol || 'A',
    col: s.seatNumber || 1,
    ticketCode: `TKT-${res.bookingId}-${idx}`,
  }));

  const mappedSeats = (res.seats || []).map((s: any) => ({
    seatId: String(s.seatId),
    row: s.rowSymbol || 'A',
    column: s.seatNumber || 1,
    type: s.seatType === 'STANDARD' ? 'NORMAL' : (s.seatType?.toUpperCase() || 'NORMAL'),
    price: s.price || 0,
  }));

  const mappedBooking = {
    _id: String(res.bookingId),
    status: res.bookingStatus || 'PENDING',
    totalPrice: res.totalPrice,
    createdAt: res.bookingTime,
    showtimeId: mappedShowtime,
    tickets: mappedTickets,
    seats: mappedSeats,
  };

  return {
    data: mappedBooking,
  } as any;
};

export const createPaymentApi = async (
  bookingId: string,
): Promise<ApiResponse<{ paymentUrl: string }>> => {
  const res = await apiClient.post(
    `/bookings/${bookingId}/payments`,
    { method: 'SEPAY' },
  );
  const data = (res as any).data || res;
  return {
    data: {
      paymentUrl: data.paymentUrl,
    },
  } as any;
};

export const cancelBookingApi = (
  id: string,
): Promise<ApiResponse<BookingType>> => {
  return apiClient.delete(`/bookings/${id}`); // Assuming backend uses delete or has no cancel endpoint explicitly defined yet.
};
