import { useParams, Link, useBlocker, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  Container,
  Grid,
  Title,
  Text,
  Loader,
  Center,
  Box,
  Breadcrumbs,
  Anchor,
  Modal,
  Stack,
  Button,
  Group,
  ThemeIcon,
} from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useBookingDetail } from '../hooks/useBooking';
import { PaymentForm } from '../components/PaymentForm';
import { BookingSummary } from '../components/BookingSummary';
import { cancelBookingApi } from '../services/booking.service';
import type { ShowtimeType, RoomType } from '@shared/index';
import { notifications } from '@mantine/notifications';
import { BookingTimer } from '../components/BookingTimer';

export default function BookingConfirmPage() {
  const { bookingId } = useParams();
  const { data: booking, isLoading } = useBookingDetail(bookingId!);
  const [isExpired, setIsExpired] = useState(false);
  const isPaidRef = useRef(false); // dùng ref thay state để cập nhật đồng bộ
  const navigate = useNavigate();
  const [isCancelling, setIsCancelling] = useState(false);

  // Chặn điều hướng khi đang trong quá trình thanh toán
  // KHÔNG chặn khi: đã hết hạn, đã thanh toán thành công
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    const isLeavingPage = currentLocation.pathname !== nextLocation.pathname;
    return isLeavingPage && !isExpired && !isPaidRef.current;
  });

  // Chặn đóng tab / refresh browser (chỉ khi chưa hết hạn và chưa thanh toán)
  useEffect(() => {
    if (isExpired || isPaidRef.current) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isExpired]);

  if (isLoading || !booking) {
    return (
      <Center h="70vh" bg="#020617">
        <Loader color="yellow" size="xl" />
      </Center>
    );
  }

  const handleExpire = () => {
    cancelBookingApi(bookingId!).catch(() => {});
    setIsExpired(true);
    notifications.show({
      title: 'Đơn hàng đã hết hạn',
      message: 'Bạn đã quá thời gian thanh toán. Ghế đã được nhả ra tự động.',
      color: 'red',
      autoClose: 8000,
    });
  };

  // Người dùng xác nhận hủy trong modal
  const handleConfirmLeave = async () => {
    setIsCancelling(true);
    await cancelBookingApi(bookingId!).catch(() => {});
    setIsCancelling(false);
    blocker.proceed?.();
  };

  // Người dùng chọn ở lại
  const handleStay = () => {
    blocker.reset?.();
  };

  // Thanh toán thành công — đánh dấu ref đồng bộ rồi navigate ngay
  const handlePaymentSuccess = () => {
    isPaidRef.current = true; // đồng bộ, blocker thấy ngay lập tức
    navigate(`/booking/result/${bookingId}`);
  };

  return (
    <Box bg="slate.950" mih="100vh" py="xl">
      {/* Modal xác nhận thoát */}
      <Modal
        opened={blocker.state === 'blocked'}
        onClose={handleStay}
        withCloseButton={false}
        centered
        radius="lg"
        size="sm"
        styles={{
          content: {
            background: '#0f172a',
            border: '1px solid rgba(255,255,255,0.1)',
          },
          overlay: { backdropFilter: 'blur(4px)' },
        }}
      >
        <Stack align="center" gap="lg" py="md">
          <ThemeIcon size={64} radius="xl" color="orange.7" variant="light">
            <IconAlertTriangle size={36} />
          </ThemeIcon>

          <Box ta="center">
            <Title order={3} c="white" mb={8}>
              Bạn muốn hủy đặt vé?
            </Title>
            <Text c="gray.4" size="sm">
              Nếu rời khỏi trang này, đơn hàng sẽ bị hủy và{' '}
              <Text component="span" c="orange.4" fw={700}>
                ghế sẽ được nhả ra ngay lập tức
              </Text>
              .
            </Text>
          </Box>

          <Group w="100%" grow>
            <Button
              variant="default"
              color="gray"
              radius="md"
              onClick={handleStay}
              disabled={isCancelling}
              styles={{ root: { borderColor: 'rgba(255,255,255,0.15)', color: '#e2e8f0' } }}
            >
              Ở lại thanh toán
            </Button>
            <Button
              color="red"
              radius="md"
              loading={isCancelling}
              onClick={handleConfirmLeave}
            >
              Hủy đặt vé
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Container size="xl">
        <Breadcrumbs mb="xl">
          <Anchor component={Link} to="/" c="gray.5">
            TRANG CHỦ
          </Anchor>
          <Text size="xs" c="yellow.5" fw={700}>
            THANH TOÁN
          </Text>
        </Breadcrumbs>

        <Title order={2} c="white" mb="xl">
          Xác nhận đơn hàng
        </Title>

        {!isExpired && (
          <Box w={200} mb="xl">
            <BookingTimer
              expiresAt={
                new Date(
                  new Date(booking.createdAt).getTime() + 2 * 60 * 1000,
                )
              }
              onExpire={handleExpire}
            />
          </Box>
        )}

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <PaymentForm
              bookingId={booking._id}
              totalPrice={booking.totalPrice}
              isExpired={isExpired}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            <BookingSummary
              showtime={
                booking.showtimeId as unknown as ShowtimeType & {
                  roomId: RoomType;
                }
              }
              selectedSeats={
                new Map(
                  ((booking as any).seats ?? []).map((s: any) => [
                    s.seatId,
                    s,
                  ]),
                )
              }
              selectedFoods={
                new Map(
                  ((booking as any).foods ?? []).map((f: any) => [
                    f.foodId,
                    f,
                  ]),
                )
              }
              totalPrice={booking.totalPrice}
              isPending={false}
              onConfirm={() => {}}
              isConfirm={true}
            />
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}
