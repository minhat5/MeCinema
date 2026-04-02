import { z } from 'zod';
import type { ApiResponse } from './types/api.type';
import type { User } from './schemas/user.schema';
export interface LoginInput {
  email: string;
  password: string;
}
export interface RegisterInput {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone?: string;
}
export interface AuthResponseData {
  token?: string;
  user?: User;
}
export const loginSchema = z.object({
  email: z.string().email('Email khong hop le'),
  password: z.string().min(1, 'Mat khau khong duoc de trong'),
});
export const registerSchema = z
  .object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    fullName: z.string().min(1, 'Họ tên không được để trống'),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu xác nhận không khớp',
  });
export type { ApiResponse, User };

export const SEAT_TYPE = {
  NORMAL: 'NORMAL',
  VIP: 'VIP',
  SWEETBOX: 'SWEETBOX',
} as const;

export const PRICE_MULTIPLIER: Record<string, number> = {
  [SEAT_TYPE.NORMAL]: 1,
  [SEAT_TYPE.VIP]: 1.2,
  [SEAT_TYPE.SWEETBOX]: 2,
};

export interface SeatConfig {
  seatId: string;
  row: string;
  column: number;
  type: string;
  isActive: boolean;
}

export interface SeatSelection {
  seatId: string;
  row: string;
  column: number;
  type: string;
  price: number;
}

export interface BookingType {
  _id: string;
  userId: string;
  showtimeId: unknown;
  roomId: unknown;
  cinemaId: unknown;
  tickets: unknown[];
  foods: unknown[];
  totalPrice: number;
  status: string;
  createdAt: string;
}

export interface CreateBooking {
  showtimeId: string;
  seats: SeatSelection[];
}

export interface RoomType {
  _id: string;
  name: string;
  seats: SeatConfig[];
}

export interface ShowtimeType {
  _id: string;
  movieId: unknown;
  cinemaId: unknown;
  roomId: unknown;
  startTime: string;
  endTime: string;
  price: number;
}

export interface PaginationMeta {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  itemsPerPage: number;
}
export interface MovieType {
  _id: string;
  title: string;
  poster: string;
}
