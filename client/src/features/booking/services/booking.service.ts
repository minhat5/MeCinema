/**
 * booking.service.ts
 * Chịu trách nhiệm DUY NHẤT: API calls liên quan đến Booking.
 * Data transformation được delegate sang booking.mapper.ts.
 * Payment API được tách sang payment.service.ts.
 */
import apiClient from '@/lib/api-client';
import type {
  ApiResponse,
  BookingType,
  CreateBooking,
  RoomType,
  ShowtimeType,
  PaginationMeta,
} from '@shared/index';
import { mapBookingResponse, mapSeatType } from './booking.mapper';

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
  const seatsData = (seatsRes as any).data || seatsRes;
  const backendSeats = seatsData?.seats || [];

  const mappedSeats = backendSeats.map((s: any) => ({
    seatId: String(s.seatId),
    row: s.rowSymbol || 'A',
    column: s.seatNumber || 1,
    type: mapSeatType(s.seatType),
    isActive: true,
  }));

  const bookedSeatIds = backendSeats
    .filter((s: any) => s.status && s.status !== 'AVAILABLE')
    .map((s: any) => String(s.seatId));

  const showtime: any = {
    _id: String(st.id),
    movieId: { _id: String(st.movieId), title: st.movieTitle },
    cinemaId: { _id: String(st.cinemaId), name: st.cinemaName },
    roomId: { _id: String(st.roomId), name: st.roomName, seats: mappedSeats },
    startTime: st.startTime ? String(st.startTime).replace(' ', 'T') : '',
    endTime: st.endTime ? String(st.endTime).replace(' ', 'T') : '',
    price: Number(st.basePrice) || 60000,
  };

  return { data: { showtime, bookedSeatIds } } as any;
};

export const createBookingApi = async (
  data: CreateBooking,
): Promise<ApiResponse<BookingType>> => {
  const payload = {
    showtimeId: Number((data as any).showtimeId),
    seatIds: (data as any).seats.map((s: any) => Number(s.seatId)),
    foods: (data as any).foods || [],
  };
  const res = await apiClient.post('/bookings', payload);
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

  const mappedBookings = (pageData.content || []).map((res: any) =>
    mapBookingResponse(res),
  );

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
  return { data: mapBookingResponse(res) } as any;
};

export const cancelBookingApi = (
  id: string,
): Promise<ApiResponse<BookingType>> => {
  return apiClient.delete(`/bookings/${id}`);
};
