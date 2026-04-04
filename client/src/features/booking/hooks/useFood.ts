import { useQuery } from '@tanstack/react-query';
import {
  getAvailableFoodsApi,
} from '../services/food.service';

/**
 * Hook để lấy danh sách đồ ăn có sẵn
 * Dùng trong booking workflow - hiển thị menu đồ ăn
 */
export const useAvailableFoods = (
  page: number = 0,
  size: number = 20,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['available-foods', page, size],
    queryFn: () =>
      getAvailableFoodsApi(page, size).then(
        (res) => res.data || res,
      ),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
