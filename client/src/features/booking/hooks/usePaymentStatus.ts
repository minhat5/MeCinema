/**
 * usePaymentStatus.ts
 * Hook chịu trách nhiệm DUY NHẤT: quản lý trạng thái polling thanh toán.
 * PaymentForm.tsx chỉ cần dùng hook này, không cần biết chi tiết polling.
 */
import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { checkPaymentStatusApi } from '../services/payment.service';

interface UsePaymentStatusOptions {
  bookingId: string;
  qrUrl: string;
  isExpired: boolean;
  onSuccess?: () => void;
}

export function usePaymentStatus({
  bookingId,
  qrUrl,
  isExpired,
  onSuccess,
}: UsePaymentStatusOptions) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Auto-polling mỗi 3 giây
  useEffect(() => {
    if (!qrUrl || isRedirecting || isExpired) return;

    const interval = setInterval(async () => {
      try {
        const isSuccess = await checkPaymentStatusApi(bookingId);
        if (isSuccess) {
          clearInterval(interval);
          setIsRedirecting(true);
          notifications.show({
            title: 'Thành công',
            message: 'Hệ thống đã nhận được thanh toán!',
            color: 'green',
          });
          setTimeout(() => onSuccess?.(), 1000);
        }
      } catch {
        // silent — sẽ retry ở interval tiếp theo
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [bookingId, qrUrl, isRedirecting, isExpired]);

  // Manual check khi user nhấn "Tôi đã chuyển tiền xong"
  const checkManually = async () => {
    setIsRedirecting(true);
    try {
      const isSuccess = await checkPaymentStatusApi(bookingId);
      if (isSuccess) {
        notifications.show({
          title: 'Thành công',
          message: 'Đã xác nhận thanh toán!',
          color: 'green',
        });
        setTimeout(() => onSuccess?.(), 1500);
      } else {
        setIsRedirecting(false);
        notifications.show({
          title: 'Chưa nhận được thanh toán',
          message: 'Hệ thống chưa ghi nhận giao dịch. Vui lòng kiểm tra nội dung chuyển khoản!',
          color: 'red',
        });
      }
    } catch {
      setIsRedirecting(false);
      notifications.show({
        title: 'Lỗi kết nối',
        message: 'Không thể kiểm tra trạng thái thanh toán lúc này.',
        color: 'red',
      });
    }
  };

  return { isRedirecting, checkManually };
}
