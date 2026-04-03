import {
  Stack,
  Text,
  Paper,
  Title,
  Loader,
  Image,
  Group,
  Divider,
  Button,
  ThemeIcon,
  Box,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { usePayment } from '../hooks/usePayment';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/api-client';
import { notifications } from '@mantine/notifications';
import { IconClockX } from '@tabler/icons-react';

type Props = {
  bookingId: string;
  totalPrice: number;
  isExpired?: boolean;
  onPaymentSuccess?: () => void;
};

export function PaymentForm({ bookingId, totalPrice, isExpired = false, onPaymentSuccess }: Props) {
  const [qrUrl, setQrUrl] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();
  const { mutate: pay, isPending } = usePayment();

  const generateQRCode = () => {
    if (isExpired) return;
    pay(bookingId, {
      onSuccess: (res) => {
        setQrUrl(res.data.paymentUrl);
      },
    });
  };

  useEffect(() => {
    if (bookingId && !qrUrl && !isPending && !isExpired) {
      generateQRCode();
    }
  }, [bookingId, qrUrl, isPending, isExpired]);

  // Dừng polling khi đã hết hạn
  useEffect(() => {
    if (!qrUrl || isRedirecting || isExpired) return;

    const interval = setInterval(() => {
      apiClient
        .get(`/bookings/${bookingId}/payments/status?t=${Date.now()}`)
        .then((res) => {
          const isSuccess = (res as any).data ?? res;
          if (isSuccess === true) {
            clearInterval(interval);
            setIsRedirecting(true);
            notifications.show({
              title: 'Thành công',
              message: 'Hệ thống đã nhận được thanh toán!',
              color: 'green',
            });
            setTimeout(() => {
              onPaymentSuccess?.();
            }, 1000);
          }
        })
        .catch(() => {});
    }, 5000);

    return () => clearInterval(interval);
  }, [bookingId, qrUrl, isRedirecting, navigate, isExpired]);

  const handleManualConfirm = () => {
    setIsRedirecting(true);
    apiClient
      .get(`/bookings/${bookingId}/payments/status?t=${Date.now()}`)
      .then((res) => {
        const isSuccess = (res as any).data ?? res;
        if (isSuccess === true) {
          notifications.show({
            title: 'Thành công',
            message: 'Đã xác nhận thanh toán!',
            color: 'green',
          });
          setTimeout(() => {
            onPaymentSuccess?.();
          }, 1500);
        } else {
          setIsRedirecting(false);
          notifications.show({
            title: 'Chưa nhận được thanh toán',
            message:
              'Hệ thống chưa ghi nhận giao dịch. Vui lòng kiểm tra nội dung chuyển khoản!',
            color: 'red',
          });
        }
      })
      .catch(() => {
        setIsRedirecting(false);
        notifications.show({
          title: 'Lỗi',
          message: 'Không thể kiểm tra trạng thái thanh toán lúc này.',
          color: 'red',
        });
      });
  };

  // ── UI HẾT HẠN ────────────────────────────────────────────────
  if (isExpired) {
    return (
      <Paper
        p="xl"
        radius="lg"
        bg="#0f172a"
        ta="center"
        style={{ border: '2px solid #475569', color: 'white', minHeight: 400 }}
      >
        <Stack align="center" gap="xl" h="100%" justify="center" py="xl">
          <ThemeIcon size={80} radius="xl" color="gray.7" variant="filled">
            <IconClockX size={44} />
          </ThemeIcon>

          <Box>
            <Title order={3} c="gray.3" mb="xs">
              Đơn hàng đã hết hạn
            </Title>
            <Text c="gray.5" size="sm" maw={320} mx="auto">
              Thời gian giữ ghế của bạn đã hết. Đơn hàng này đã bị hủy tự
              động và ghế đã được nhả ra.
            </Text>
          </Box>

          <Stack gap="sm" w="100%">
            <Button
              color="yellow"
              size="md"
              radius="md"
              fullWidth
              onClick={() => navigate('/phim')}
            >
              Chọn suất chiếu khác
            </Button>
            <Button
              variant="subtle"
              color="gray"
              size="sm"
              onClick={() => navigate('/')}
            >
              Về trang chủ
            </Button>
          </Stack>
        </Stack>
      </Paper>
    );
  }

  // ── UI BÌNH THƯỜNG ─────────────────────────────────────────────
  return (
    <Paper
      p="xl"
      radius="lg"
      bg="#0f172a"
      ta="center"
      style={{ border: '2px solid #e11d48', color: 'white', minHeight: 400 }}
    >
      <Stack align="center" gap="xl" h="100%" justify="center">
        {!qrUrl ? (
          <Stack align="center">
            <Loader color="yellow" size="xl" />
            <Text c="gray.4" fw={700}>
              ĐANG TẠO MÃ THANH TOÁN...
            </Text>
          </Stack>
        ) : (
          <>
            <Title order={3} c="white" style={{ letterSpacing: '1px' }}>
              QUÉT MÃ VIETQR ĐỂ XÁC NHẬN
            </Title>

            <Paper
              p="sm"
              bg="white"
              radius="md"
              style={{ boxShadow: '0 0 30px rgba(225, 29, 72, 0.3)' }}
            >
              <Image src={qrUrl} w={300} alt="VietQR" />
            </Paper>

            <Stack gap="xs" w="100%">
              <Group gap="xs" justify="center">
                <Text size="xl" fw={800} c="yellow.5">
                  {totalPrice.toLocaleString('vi-VN')}₫
                </Text>
              </Group>

              {isRedirecting ? (
                <Group gap="xs" justify="center">
                  <Loader color="green" size="xs" />
                  <Text c="green.4" fw={700}>
                    ĐÃ NHẬN THANH TOÁN!
                  </Text>
                </Group>
              ) : (
                <Stack gap="md" w="100%">
                  <Text
                    c="gray.5"
                    size="sm"
                    fw={600}
                    style={{ fontStyle: 'italic' }}
                  >
                    Vui lòng quét mã trên ứng dụng ngân hàng của bạn
                  </Text>
                  <Button
                    color="yellow"
                    size="lg"
                    fullWidth
                    radius="md"
                    onClick={handleManualConfirm}
                    loading={isRedirecting}
                  >
                    TÔI ĐÃ CHUYỂN TIỀN XONG
                  </Button>
                  <Button
                    variant="subtle"
                    color="gray.4"
                    onClick={generateQRCode}
                    loading={isPending}
                  >
                    Mã lỗi/Giao dịch nghi ngờ? Tạo lại mã thanh toán
                  </Button>
                </Stack>
              )}
            </Stack>

            <Divider w="100%" color="gray.8" style={{ borderStyle: 'dashed' }} />

            <Text size="xs" c="gray.6">
              Vui lòng nhấn xác nhận sau khi quét mã thành công.
            </Text>
          </>
        )}
      </Stack>
    </Paper>
  );
}
