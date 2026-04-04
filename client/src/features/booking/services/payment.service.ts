/**
 * payment.service.ts
 * Chịu trách nhiệm DUY NHẤT: các API call liên quan đến Payment.
 * Tách khỏi booking.service vì Payment là bounded context riêng.
 */
import apiClient from '@/lib/api-client';
import type { ApiResponse } from '@shared/index';

export const createPaymentApi = async (
  bookingId: string,
): Promise<ApiResponse<{ paymentUrl: string }>> => {
  const res = await apiClient.post(`/bookings/${bookingId}/payments`, { method: 'SEPAY' });
  const data = (res as any).data || res;
  return {
    data: { paymentUrl: data.paymentUrl },
  } as any;
};

export const checkPaymentStatusApi = async (bookingId: string): Promise<boolean> => {
  const res = await apiClient.get(`/bookings/${bookingId}/payments/status?t=${Date.now()}`);
  const isSuccess = (res as any).data ?? res;
  return isSuccess === true;
};
