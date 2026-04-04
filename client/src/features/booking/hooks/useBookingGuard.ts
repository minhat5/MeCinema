/**
 * useBookingGuard.ts
 * Hook chịu trách nhiệm DUY NHẤT: bảo vệ người dùng khi rời trang trong lúc thanh toán.
 * BookingConfirmPage chỉ gọi hook này, không cần biết chi tiết blocking logic.
 */
import { useState, useEffect, useRef } from 'react';
import { useBlocker } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { cancelBookingApi } from '../services/booking.service';

interface UseBookingGuardOptions {
  bookingId: string;
  isExpired: boolean;
}

export function useBookingGuard({ bookingId, isExpired }: UseBookingGuardOptions) {
  const isPaidRef = useRef(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Chặn điều hướng trong app (React Router)
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    const isLeavingPage = currentLocation.pathname !== nextLocation.pathname;
    return isLeavingPage && !isExpired && !isPaidRef.current;
  });

  // Chặn đóng tab / refresh browser
  useEffect(() => {
    if (isExpired || isPaidRef.current) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isExpired]);

  // Hủy booking và giải phóng ghế khi hết hạn
  const handleExpire = () => {
    cancelBookingApi(bookingId).catch(() => {});
    notifications.show({
      title: 'Đơn hàng đã hết hạn',
      message: 'Bạn đã quá thời gian thanh toán. Ghế đã được nhả ra tự động.',
      color: 'red',
      autoClose: 8000,
    });
  };

  // User xác nhận rời trang → hủy booking → tiếp tục navigate
  const handleConfirmLeave = async () => {
    setIsCancelling(true);
    await cancelBookingApi(bookingId).catch(() => {});
    setIsCancelling(false);
    blocker.proceed?.();
  };

  // User chọn ở lại
  const handleStay = () => blocker.reset?.();

  // Đánh dấu đã thanh toán (ref đồng bộ) → blocker sẽ không chặn navigate nữa
  const markPaid = () => { isPaidRef.current = true; };

  return {
    blocker,
    isCancelling,
    handleExpire,
    handleConfirmLeave,
    handleStay,
    markPaid,
  };
}
