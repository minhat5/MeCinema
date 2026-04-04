import apiClient from '@/lib/api-client';
import type { ApiResponse } from '@shared/index';

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
    data: res.data,
  };
};

// Lấy danh sách tất cả đồ ăn (phân trang)
export const getAllFoodsApi = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = 'id',
): Promise<ApiResponse<FoodResponse>> => {
  const res = await apiClient.get<FoodResponse>(`/public/foods`, {
    params: {
      page,
      size,
      sortBy,
    },
  });
  return {
    success: true,
    data: res.data,
  };
};

//Lấy chi tiết một đồ ăn theo ID
export const getFoodByIdApi = async (id: number): Promise<ApiResponse<FoodType>> => {
  const res = await apiClient.get<FoodType>(`/public/foods/${id}`);
  return {
    success: true,
    data: res.data,
  };
};

// Tìm kiếm đồ ăn theo tên, loại và trạng thái
export const searchFoodsApi = async (
  name?: string,
  type?: 'FOOD' | 'DRINK' | 'COMBO',
  isActive: boolean = true,
  page: number = 0,
  size: number = 10,
): Promise<ApiResponse<FoodResponse>> => {
  const params: any = {
    page,
    size,
    isActive,
  };
  
  if (name) params.name = name;
  if (type) params.type = type;

  const res = await apiClient.get<FoodResponse>(`/public/foods/search`, { params });
  return {
    success: true,
    data: res.data,
  };
};

//Lấy danh sách đồ ăn theo loại
export const getFoodsByTypeApi = async (
  type: 'FOOD' | 'DRINK' | 'COMBO',
  page: number = 0,
  size: number = 10,
): Promise<ApiResponse<FoodResponse>> => {
  const res = await apiClient.get<FoodResponse>(`/public/foods/by-type/${type}`, {
    params: {
      page,
      size,
    },
  });
  return {
    success: true,
    data: res.data,
  };
};

