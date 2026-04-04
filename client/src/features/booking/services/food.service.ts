import apiClient from '@/lib/api-client';
import type { ApiResponse } from '@shared/index';

const unwrapApiData = <T>(res: unknown): T => {
  if (res && typeof res === 'object' && 'data' in (res as Record<string, unknown>)) {
    return (res as { data: T }).data;
  }
  return res as T;
};

export interface FoodType {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  type: 'FOOD' | 'DRINK' | 'COMBO';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FoodResponse {
  content: FoodType[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

//Lấy danh sách tất cả đồ ăn có sẵn
export const getAvailableFoodsApi = async (
  page: number = 0,
  size: number = 20,
): Promise<ApiResponse<FoodResponse>> => {
  const res = await apiClient.get<FoodResponse>(`/public/foods/available`, {
    params: {
      page,
      size,
    },
  });
  return {
    success: true,
    data: unwrapApiData<FoodResponse>(res),
  };
};
