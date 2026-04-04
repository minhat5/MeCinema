import { useQuery, useQueries } from '@tanstack/react-query';
import {
  getAvailableFoodsApi,
  getAllFoodsApi,
  getFoodByIdApi,
  searchFoodsApi,
  getFoodsByTypeApi,
  type FoodResponse,
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

/**
 * Hook để lấy danh sách tất cả đồ ăn (phân trang)
 */
export const useAllFoods = (
  page: number = 0,
  size: number = 10,
  sortBy: string = 'id',
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['all-foods', page, size, sortBy],
    queryFn: () =>
      getAllFoodsApi(page, size, sortBy).then(
        (res) => res.data || res,
      ),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để lấy chi tiết một đồ ăn
 */
export const useFoodDetail = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['food', id],
    queryFn: () => getFoodByIdApi(id).then((res) => res.data || res),
    enabled: !!id && enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook để tìm kiếm đồ ăn
 */
export const useSearchFoods = (
  name?: string,
  type?: 'FOOD' | 'DRINK' | 'COMBO',
  isActive: boolean = true,
  page: number = 0,
  size: number = 10,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['search-foods', name, type, isActive, page, size],
    queryFn: () =>
      searchFoodsApi(name, type, isActive, page, size).then(
        (res) => res.data || res,
      ),
    enabled,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

/**
 * Hook để lấy danh sách đồ ăn theo loại
 */
export const useFoodsByType = (
  type?: 'FOOD' | 'DRINK' | 'COMBO',
  page: number = 0,
  size: number = 10,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['foods-by-type', type, page, size],
    queryFn: () => {
      if (!type) {
        return Promise.resolve({
          content: [],
          totalElements: 0,
          totalPages: 0,
          size,
          number: page,
          last: true,
          first: true,
          numberOfElements: 0,
          empty: true,
        } as FoodResponse);
      }
      return getFoodsByTypeApi(type, page, size).then(
        (res) => res.data || res,
      );
    },
    enabled: !!type && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook để lấy chi tiết của nhiều đồ ăn cùng lúc
 * Dùng khi cần hiển thị danh sách ID của những đồ ăn đã chọn
 */
export const useFoodsDetail = (ids: number[] = []) => {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: ['food', id],
      queryFn: () => getFoodByIdApi(id).then((res) => res.data || res),
      staleTime: 10 * 60 * 1000,
    })),
  });
};

