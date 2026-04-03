/**
 * Room Types
 * Types definition cho Room Management Feature
 */

// DTO từ Backend
export interface RoomDto {
  id: number;
  cinemaId: number;
  cinemaName?: string;
  name: string;
  totalSeats?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Frontend Model
export interface Room extends RoomDto {
  // Các field thêm từ frontend nếu cần
}

// Cinema Option cho Select
export interface CinemaOption {
  id: number;
  name: string;
  city?: string;
}

// Request/Response Types
export interface CreateRoomRequest {
  cinemaId: number;
  name: string;
}

export interface UpdateRoomRequest {
  name?: string;
}

export interface RoomListResponse {
  content?: RoomDto[];
  number?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
}

// UI Table Row Type
export interface RoomTableRow extends RoomDto {
  // Thêm các field UI nếu cần
}

// Filter
export interface RoomFilter {
  page?: number;
  limit?: number;
  cinemaId?: string | number;
  search?: string;
}

