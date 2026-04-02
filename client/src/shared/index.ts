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
