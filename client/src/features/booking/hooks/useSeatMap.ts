import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getSeatMapApi } from '../services/booking.service';

export const useSeatMap = (showtimeId: string) => {
  return useQuery({
    queryKey: ['seats', showtimeId],
    queryFn: () => getSeatMapApi(showtimeId).then((res) => res.data),
    staleTime: 0,           // Luôn coi là stale để invalidation có hiệu lực ngay
    refetchInterval: 15 * 1000, // Poll mỗi 15s để cập nhật ghế bị đặt bởi người khác
    enabled: !!showtimeId,
    placeholderData: keepPreviousData,
  });
};
