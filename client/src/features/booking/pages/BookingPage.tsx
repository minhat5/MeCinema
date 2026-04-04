import { useParams, Link, useNavigate } from 'react-router-dom';
import { useReducer, useEffect, useRef } from 'react';
import {
  Container,
  Grid,
  Text,
  Stack,
  Loader,
  Center,
  Breadcrumbs,
  Anchor,
  Paper,
  Box,
  Group,
  Title,
} from '@mantine/core';
import { useSeatMap } from '../hooks/useSeatMap';
import { useCreateBooking } from '../hooks/useBooking';
import { seatReducer, initialSeatState } from '../reducers/seatReducer';
import { foodReducer, initialFoodState } from '../reducers/foodReducer';
import { SeatSelection } from '../components/SeatSelection';
import { FoodSelection, type SelectedFood } from '../components/FoodSelection';
import { BookingSummary } from '../components/BookingSummary';
import { BookingTimer } from '../components/BookingTimer';
import type { RoomType, MovieType } from '@shared/index';
import { notifications } from '@mantine/notifications';

const BookingPage = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useSeatMap(showtimeId!);
  const { mutate: createBooking, isPending } = useCreateBooking();
  const [state, dispatch] = useReducer(seatReducer, initialSeatState);
  const [foodState, foodDispatch] = useReducer(foodReducer, initialFoodState);

  // Khi seatMap refetch và phát hiện ghế mình đang chọn đã bị người khác đặt → tự động bỏ chọn + cảnh báo
  const prevBookedRef = useRef<string[]>([]);
  useEffect(() => {
    const currentBooked = data?.bookedSeatIds ?? [];
    const prevBooked = prevBookedRef.current;

    // Tìm những ghế MỚI bị đặt (chưa có ở lần refetch trước)
    const newlyBooked = currentBooked.filter((id) => !prevBooked.includes(id));
    prevBookedRef.current = currentBooked;

    if (newlyBooked.length === 0) return;

    // Lọc ra những ghế người dùng đang chọn mà bị đặt mất
    const conflictSeats = newlyBooked.filter((id) => state.selectedSeats.has(id));
    if (conflictSeats.length === 0) return;

    dispatch({ type: 'REMOVE_INVALID_SEATS', payload: conflictSeats });
    notifications.show({
      title: '⚠️ Ghế vừa bị đặt bởi người khác',
      message: `${conflictSeats.length} ghế bạn đang chọn đã bị người khác đặt và đã được bỏ chọn tự động. Vui lòng chọn lại!`,
      color: 'orange',
      autoClose: 6000,
    });
  }, [data?.bookedSeatIds]);

  if (isLoading || !data?.showtime) {
    return (
      <Center style={{ height: '70vh', backgroundColor: '#020617' }}>
        <Stack align="center">
          <Loader color="yellow" size="xl" type="bars" />
          <Text fw={500} c="gray.4">
            Hệ thống đang tải sơ đồ ghế...
          </Text>
        </Stack>
      </Center>
    );
  }

  const room = data.showtime.roomId as unknown as RoomType;
  const seats = room.seats ?? [];

  const handleConfirm = () => {
    // Lọc bỏ ghế đã bị đặt trước khi gửi (bảo vệ thêm 1 lớp phía client)
    const currentBooked = new Set(data?.bookedSeatIds ?? []);
    const conflictSeats = Array.from(state.selectedSeats.keys()).filter((id) =>
      currentBooked.has(id),
    );
    if (conflictSeats.length > 0) {
      dispatch({ type: 'REMOVE_INVALID_SEATS', payload: conflictSeats });
      notifications.show({
        title: '⚠️ Ghế không còn trống',
        message: 'Một số ghế bạn chọn vừa được người khác đặt. Vui lòng kiểm tra lại lựa chọn!',
        color: 'orange',
        autoClose: 5000,
      });
      return;
    }

    if (state.selectedSeats.size === 0) {
      notifications.show({
        title: 'Chưa chọn ghế',
        message: 'Vui lòng chọn ít nhất 1 ghế trước khi xác nhận.',
        color: 'red',
      });
      return;
    }

    // Chuẩn bị dữ liệu đồ ăn
    const selectedFoodsArray = Array.from(foodState.selectedFoods.values()).map(
      (food) => ({
        foodId: food.foodId,
        quantity: food.quantity,
      }),
    );

    createBooking(
      {
        showtimeId: showtimeId!,
        seats: Array.from(state.selectedSeats.values()),
        foods: selectedFoodsArray,
      } as any,
      {
        onSuccess: (res) => {
          navigate(`/booking/confirm/${res.data._id}`);
        },
        onError: (error: any) => {
          // Làm mới lại seatMap ngay lập tức để cập nhật trạng thái ghế
          const message =
            error?.response?.data?.message ||
            error?.message ||
            'Đặt vé thất bại. Ghế này có thể vừa được người khác đặt xong.';
          notifications.show({
            title: '❌ Đặt vé không thành công',
            message,
            color: 'red',
            autoClose: 6000,
          });
        },
      },
    );
  };

  return (
    <Box bg="slate.950" mih="100vh" py="xl">
      <Container size="xl">
        {/* Header Section */}
        <Group justify="space-between" mb="xl" align="flex-end">
          <Stack gap={4}>
            <Breadcrumbs c="gray.5">
              <Anchor component={Link} to="/" c="gray.5">
                TRANG CHỦ
              </Anchor>
              <Text size="xs" c="yellow.5" fw={700}>
                ĐẶT VÉ
              </Text>
            </Breadcrumbs>
            <Title order={2} c="white" lts={1}>
              {(data.showtime.movieId as unknown as MovieType).title}
            </Title>
            <Group gap="xs" c="gray.4">
              <Text size="sm" fw={700}>
                {data.showtime.roomId.name}
              </Text>
              <Text size="sm">•</Text>
              <Text size="sm">
                {new Date(data.showtime.startTime).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <Text size="sm">•</Text>
              <Text size="sm">
                {new Date(data.showtime.startTime).toLocaleDateString('vi-VN')}
              </Text>
            </Group>
          </Stack>

          <Box w={200}>
            <BookingTimer
              onExpire={() => {
                dispatch({ type: 'RESET' });
                notifications.show({
                  title: 'Hết thời gian giữ chỗ',
                  message: 'Phiên làm việc đã kết thúc, vui lòng chọn lại ghế!',
                  color: 'red',
                });
              }}
            />
          </Box>
        </Group>

        <Grid gutter="xl">
          {/* Sơ đồ ghế */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper
              p="xl"
              radius="lg"
              bg="rgba(15, 23, 42, 0.6)"
              style={{
                border: '1px solid rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <SeatSelection
                seats={seats}
                bookedSeatIds={data.bookedSeatIds}
                ticketPrice={data.showtime.price}
                selectedSeats={state.selectedSeats}
                maxSeats={state.maxSeats}
                dispatch={dispatch}
              />
            </Paper>

            {/* Chọn Đồ Ăn */}
            <Paper
              p="xl"
              radius="lg"
              bg="rgba(15, 23, 42, 0.6)"
              style={{
                border: '1px solid rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                marginTop: '1.5rem',
              }}
            >
              <FoodSelection
                selectedFoods={foodState.selectedFoods}
                onFoodSelect={(food: SelectedFood) => {
                  foodDispatch({ type: 'ADD_FOOD', payload: food });
                }}
                onFoodRemove={(foodId: number, quantity: number) => {
                  foodDispatch({
                    type: 'REMOVE_FOOD',
                    payload: { foodId, quantity },
                  });
                }}
              />
            </Paper>
          </Grid.Col>

          {/* Sidebar Summary */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Box style={{ position: 'sticky', top: 20 }}>
              {(() => {
                // Calculate total price including foods
                const foodsTotal = Array.from(foodState.selectedFoods.values()).reduce(
                  (sum, f) => sum + f.price * f.quantity,
                  0,
                );
                const grandTotal = state.totalPrice + foodsTotal;

                return (
                  <BookingSummary
                    showtime={data.showtime}
                    selectedSeats={state.selectedSeats}
                    selectedFoods={foodState.selectedFoods}
                    totalPrice={grandTotal}
                    isPending={isPending}
                    onConfirm={handleConfirm}
                    isConfirm={false}
                  />
                );
              })()}
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};

export default BookingPage;
