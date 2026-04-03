import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
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
} from '@mantine/core';
import { useBookingDetail } from '../hooks/useBooking';
import { PaymentForm } from '../components/PaymentForm';
import { BookingSummary } from '../components/BookingSummary';
import type { ShowtimeType, RoomType } from '@shared/index';
import { notifications } from '@mantine/notifications';
import { BookingTimer } from '../components/BookingTimer';

export default function BookingConfirmPage() {
  const { bookingId } = useParams();
  const { data: booking, isLoading } = useBookingDetail(bookingId!);
  const [isExpired, setIsExpired] = useState(false);


  if (isLoading || !booking) {
    return (
      <Center h="70vh" bg="#020617">
        <Loader color="yellow" size="xl" />
      </Center>
    );
  }

  const handleExpire = () => {
    setIsExpired(true);
    notifications.show({
      title: '⏰ Đơn hàng đã hết hạn',
      message: 'Bạn đã quá thời gian thanh toán. Ghế đã được nhả ra tự động.',
      color: 'red',
      autoClose: 8000,
    });
  };

  return (
    <Box bg="slate.950" mih="100vh" py="xl">
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
