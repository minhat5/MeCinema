import { z } from 'zod';

export const createRoomSchema = z.object({
  cinemaId: z.number().positive('ID chi nhánh phải là số dương'),
  name: z
    .string()
    .min(1, 'Tên phòng không được để trống')
    .max(100, 'Tên phòng tối đa 100 ký tự'),
});

export const updateRoomSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên phòng không được để trống')
    .max(100, 'Tên phòng tối đa 100 ký tự')
    .optional(),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;

