import { useEffect, useMemo, useState } from 'react';
import { Button, NumberInput, Select } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import {
  useCinemasSelect,
  useCreateShowtime,
  useMoviesSelect,
  useRoomsByCinema,
  useUpdateShowtime,
  type CreateShowtimePayload,
  type ShowtimeItem,
  type UpdateShowtimePayload,
} from '../hooks/useShowtimeCRUD';

interface ShowtimeFormProps {
  initialData?: ShowtimeItem | null;
  onSuccess: () => void;
}

const inputStyles = {
  input: {
    backgroundColor: '#060e20',
    border: '1px solid #424656',
    color: '#dae2fd',
  },
  label: {
    color: '#c2c6d8',
    fontWeight: 600,
    marginBottom: 4,
  },
  dropdown: {
    backgroundColor: '#131b2e',
    border: '1px solid #424656',
  },
};

export default function ShowtimeForm({ initialData, onSuccess }: ShowtimeFormProps) {
  const isEdit = !!initialData;

  const [movieId, setMovieId] = useState<string | null>(null);
  const [cinemaId, setCinemaId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [basePrice, setBasePrice] = useState<number>(75000);

  const { data: movies = [], isLoading: isMoviesLoading } = useMoviesSelect();
  const { data: cinemas = [], isLoading: isCinemasLoading } = useCinemasSelect();
  const { data: rooms = [], isLoading: isRoomsLoading } = useRoomsByCinema(cinemaId ?? '');

  const createMutation = useCreateShowtime();
  const updateMutation = useUpdateShowtime();

  const movieOptions = useMemo(
    () =>
      movies.map((movie) => ({
        value: movie._id,
        label: movie.title ?? movie.name ?? 'Không tên',
      })),
    [movies],
  );

  const cinemaOptions = useMemo(
    () =>
      cinemas.map((cinema) => ({
        value: cinema._id,
        label: `${cinema.name ?? 'Chi nhánh'}${cinema.city ? ` - ${cinema.city}` : ''}`,
      })),
    [cinemas],
  );

  const roomOptions = useMemo(
    () =>
      rooms.map((room) => ({
        value: room._id,
        label: room.name ?? 'Phòng chiếu',
      })),
    [rooms],
  );

  useEffect(() => {
    if (!initialData) return;
    setMovieId(initialData.movieId);
    setCinemaId(initialData.cinemaId);
    setRoomId(initialData.roomId);
    setStartTime(initialData.startTime ?? null);
    setEndTime(initialData.endTime ?? null);
    setBasePrice(Number(initialData.basePrice ?? 75000));
  }, [initialData]);

  useEffect(() => {
    if (!initialData) {
      setRoomId(null);
    }
  }, [cinemaId, initialData]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!movieId || !roomId || !startTime || !endTime) return;

    const createPayload: CreateShowtimePayload = {
      movieId,
      roomId,
      startTime,
      endTime,
      basePrice,
    };

    if (isEdit && initialData?._id) {
      const updatePayload: UpdateShowtimePayload = {
        startTime,
        endTime,
        basePrice,
      };
      updateMutation.mutate({ id: initialData._id, data: updatePayload }, { onSuccess });
      return;
    }

    createMutation.mutate(createPayload, { onSuccess });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Select
        label="Phim"
        placeholder="Chọn phim"
        data={movieOptions}
        value={movieId}
        onChange={setMovieId}
        searchable
        required
        disabled={isMoviesLoading || isEdit}
        styles={inputStyles}
      />

      <Select
        label="Chi nhánh rạp"
        placeholder="Chọn rạp"
        data={cinemaOptions}
        value={cinemaId}
        onChange={setCinemaId}
        searchable
        required
        disabled={isCinemasLoading || isEdit}
        styles={inputStyles}
      />

      <Select
        label="Phòng chiếu"
        placeholder={cinemaId ? 'Chọn phòng' : 'Chọn rạp trước'}
        data={roomOptions}
        value={roomId}
        onChange={setRoomId}
        searchable
        required
        disabled={!cinemaId || isRoomsLoading || isEdit}
        styles={inputStyles}
      />

      <DateTimePicker
        label="Ngày và giờ chiếu"
        placeholder="Chọn thời gian chiếu"
        value={startTime ? new Date(startTime) : null}
        onChange={(value) => setStartTime(value ? new Date(value).toISOString() : null)}
        minDate={new Date()}
        valueFormat="DD/MM/YYYY HH:mm"
        required
        styles={{
          ...inputStyles,
          weekday: { color: '#8c90a1' },
          day: { color: '#dae2fd' },
          calendarHeaderLevel: { color: '#dae2fd' },
          calendarHeaderControl: { color: '#dae2fd' },
          timeInput: {
            backgroundColor: '#060e20',
            border: '1px solid #424656',
            color: '#dae2fd',
          },
        }}
        popoverProps={{
          styles: {
            dropdown: {
              backgroundColor: '#131b2e',
              border: '1px solid #424656',
            },
          },
        }}
      />

      <DateTimePicker
        label="Ngày và giờ kết thúc"
        placeholder="Chọn thời gian kết thúc"
        value={endTime ? new Date(endTime) : null}
        onChange={(value) => setEndTime(value ? new Date(value).toISOString() : null)}
        minDate={startTime ? new Date(startTime) : new Date()}
        valueFormat="DD/MM/YYYY HH:mm"
        required
        styles={{
          ...inputStyles,
          weekday: { color: '#8c90a1' },
          day: { color: '#dae2fd' },
          calendarHeaderLevel: { color: '#dae2fd' },
          calendarHeaderControl: { color: '#dae2fd' },
          timeInput: {
            backgroundColor: '#060e20',
            border: '1px solid #424656',
            color: '#dae2fd',
          },
        }}
        popoverProps={{
          styles: {
            dropdown: {
              backgroundColor: '#131b2e',
              border: '1px solid #424656',
            },
          },
        }}
      />

      <NumberInput
        label="Giá vé (VNĐ)"
        value={basePrice}
        onChange={(value) => setBasePrice(Number(value) || 0)}
        min={0}
        step={5000}
        thousandSeparator=","
        required
        styles={inputStyles}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!movieId || !roomId || !startTime || !endTime}
          styles={{
            root: {
              background: '#0066ff',
              borderRadius: 12,
              fontWeight: 800,
              height: 44,
              paddingInline: 24,
            },
          }}
        >
          {isEdit ? 'Cập nhật suất chiếu' : 'Tạo suất chiếu'}
        </Button>
      </div>
    </form>
  );
}

