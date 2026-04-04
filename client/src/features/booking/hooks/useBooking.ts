import type { CreateBooking } from '@shared/index';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBookingApi,
  getBookingDetailApi,
} from '../services/booking.service';
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBooking) => createBookingApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seats'] });
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
    onError: () => {
      // Làm mới seatMap ngay khi đặt vé thất bại để hiển thị ghế đã bị đặt
      queryClient.invalidateQueries({ queryKey: ['seats'] });
    },
  });
};
export const useBookingDetail = (id: string) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBookingDetailApi(id).then((res) => res.data),
    enabled: !!id,
  });
};
