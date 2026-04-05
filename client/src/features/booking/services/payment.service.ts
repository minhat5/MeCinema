/**
 * payment.service.ts
 * Chịu trách nhiệm DUY NHẤT: các API call liên quan đến Payment.
 * Tách khỏi booking.service vì Payment là bounded context riêng.
 */
import apiClient from '@/lib/api-client';
import type { ApiResponse } from '@shared/index';

export const createPaymentApi = async (
  bookingId: string,
  regenerate = false,
): Promise<ApiResponse<{ paymentUrl: string; paymentId: number }>> => {
  const res = await apiClient.post(`/bookings/${bookingId}/payments`, { method: 'SEPAY', regenerate });
  const data = (res as any).data || res;
  return {
    data: { paymentUrl: data.paymentUrl, paymentId: data.paymentId },
  } as any;
};

export const checkPaymentStatusApi = async (bookingId: string, paymentId?: number): Promise<boolean> => {
  const params = new URLSearchParams({ t: String(Date.now()) });
  if (paymentId) params.set('paymentId', String(paymentId));
  const res = await apiClient.get(`/bookings/${bookingId}/payments/status?${params.toString()}`);
  const isSuccess = (res as any).data ?? res;
  return isSuccess === true;
};
