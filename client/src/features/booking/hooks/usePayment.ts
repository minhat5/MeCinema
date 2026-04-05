import { useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { createPaymentApi } from '../services/payment.service';

export const usePayment = () => {
  return useMutation({
    mutationFn: ({ bookingId, regenerate = false }: { bookingId: string; regenerate?: boolean }) =>
      createPaymentApi(bookingId, regenerate),

    onError: (error: Error) => {
      notifications.show({
        title: 'Lỗi thanh toán',
        message: error.message || 'Không thể tạo yêu cầu thanh toán',
        color: 'red',
      });
    },
  });
};
