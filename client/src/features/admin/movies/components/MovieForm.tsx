import {
  TextInput,
  Textarea,
  NumberInput,
  Select,
  MultiSelect,
  Stack,
  Button,
  Group,
  Grid,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import {
  useCreateMovie,
  useUpdateMovie,
  useMovieById,
  useGenres,
} from '../hooks';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import dayjs from '../../../../lib/dayjs';

interface MovieFormProps {
  movieId?: string | null;
  onSuccess?: () => void;
}

export default function MovieForm({ movieId, onSuccess }: MovieFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genres: [] as string[],
    duration: 90,
    releaseDate: null as Date | null,
    poster: '',
    trailer: '',
    status: 'UPCOMING' as 'UPCOMING' | 'RELEASED' | 'ENDED',
  });

  const { data: existingMovie, isLoading: isLoadingMovie } = useMovieById(
    movieId || undefined,
  );
  const { data: genres, isLoading: isLoadingGenres } = useGenres();
  const { mutate: createMovie, isPending: isCreating } = useCreateMovie();
  const { mutate: updateMovie, isPending: isUpdating } = useUpdateMovie();

  useEffect(() => {
    if (existingMovie) {
      setFormData({
        title: existingMovie.title || '',
        description: existingMovie.description || '',
        genres: existingMovie.genres?.map((g) => g._id) || [],
        duration: existingMovie.duration || 90,
        releaseDate: existingMovie.releaseDate
          ? new Date(existingMovie.releaseDate)
          : null,
        poster: existingMovie.poster || '',
        trailer: existingMovie.trailer || '',
        status: existingMovie.status || 'UPCOMING',
      });
    }
  }, [existingMovie]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const genreIdToName = new Map<string, string>(
      (genres ?? []).map((g: any) => [String(g._id), String(g.name)]),
    );
    const genreNames = formData.genres
      .map((value): string => {
        const mapped = genreIdToName.get(String(value));
        return typeof mapped === 'string' ? mapped : String(value);
      })
      .filter((value): value is string => value.trim().length > 0);

    const payload = {
      title: formData.title,
      description: formData.description,
      genres: genreNames,
      duration: formData.duration,
      releaseDate: formData.releaseDate
        ? dayjs(formData.releaseDate).toISOString()
        : dayjs().toISOString(),
      poster: formData.poster,
      trailer: formData.trailer || undefined,
      status: formData.status,
    };

    if (movieId) {
      updateMovie(
        { id: movieId, data: payload as any },
        {
          onSuccess: () => {
            notifications.show({
              color: 'green',
              title: 'Thành công',
              message: 'Đã cập nhật phim.',
            });
            onSuccess?.();
          },
          onError: (error: unknown) => {
            notifications.show({
              color: 'red',
              title: 'Cập nhật thất bại',
              message:
                error instanceof Error ? error.message : 'Không thể cập nhật phim.',
            });
          },
        },
      );
    } else {
      createMovie(payload as any, {
        onSuccess: () => {
          notifications.show({
            color: 'green',
            title: 'Thành công',
            message: 'Đã tạo phim mới.',
          });
          onSuccess?.();
        },
        onError: (error: unknown) => {
          notifications.show({
            color: 'red',
            title: 'Tạo phim thất bại',
            message:
              error instanceof Error ? error.message : 'Không thể tạo phim.',
          });
        },
      });
    }
  };

  if (isLoadingMovie || isLoadingGenres) {
    return <LoadingSpinner />;
  }

  const genreOptions =
    genres?.map((g: any) => ({ value: g._id, label: g.name })) || [];

  const inputStyles = {
    input: {
      backgroundColor: '#131b2e',
      border: '1px solid #424656',
      color: '#dae2fd',
      '&::placeholder': { color: '#8c90a1' },
    },
    label: { color: '#c2c6d8', fontWeight: 500 },
  };

  const selectStyles = {
    ...inputStyles,
    dropdown: {
      backgroundColor: '#131b2e',
      border: '1px solid #424656',
    },
    option: {
      color: '#dae2fd',
      '&[data-combobox-selected]': {
        backgroundColor: '#0066ff',
      },
      '&:hover': {
        backgroundColor: '#171f33',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Tên phim"
          placeholder="Nhập tên phim"
          required
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.currentTarget.value })
          }
          styles={inputStyles}
        />

        <Textarea
          label="Mô tả"
          placeholder="Nhập mô tả phim"
          required
          minRows={4}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.currentTarget.value })
          }
          styles={inputStyles}
        />

        <MultiSelect
          label="Thể loại"
          placeholder="Chọn thể loại"
          data={genreOptions}
          required
          searchable
          value={formData.genres}
          onChange={(value) => setFormData({ ...formData, genres: value })}
          styles={selectStyles}
        />

        <Grid>
          <Grid.Col span={6}>
            <NumberInput
              label="Thời lượng (phút)"
              placeholder="90"
              required
              min={1}
              value={formData.duration}
              onChange={(value) =>
                setFormData({ ...formData, duration: Number(value) })
              }
              styles={inputStyles}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Trạng thái"
              data={[
                { value: 'UPCOMING', label: 'Sắp chiếu' },
                { value: 'RELEASED', label: 'Đang chiếu' },
                { value: 'ENDED', label: 'Đã kết thúc' },
              ]}
              value={formData.status}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  status: (value as 'UPCOMING' | 'RELEASED' | 'ENDED') || 'UPCOMING',
                })
              }
              styles={selectStyles}
            />
          </Grid.Col>
        </Grid>

        <DateInput
          label="Ngày khởi chiếu"
          placeholder="DD/MM/YYYY"
          required
          value={formData.releaseDate}
          onChange={(value) =>
            setFormData({ ...formData, releaseDate: value as Date | null })
          }
          valueFormat="DD/MM/YYYY"
          clearable
          styles={inputStyles}
        />

        <TextInput
          label="URL Poster"
          placeholder="https://example.com/poster.jpg"
          required
          value={formData.poster}
          onChange={(e) =>
            setFormData({ ...formData, poster: e.currentTarget.value })
          }
          styles={inputStyles}
        />

        <TextInput
          label="URL Trailer"
          placeholder="https://youtube.com/watch?v=..."
          value={formData.trailer}
          onChange={(e) =>
            setFormData({ ...formData, trailer: e.currentTarget.value })
          }
          styles={inputStyles}
        />

        <Group justify="flex-end" mt="md">
          <Button
            type="submit"
            loading={isCreating || isUpdating}
            disabled={isCreating || isUpdating}
            styles={{
              root: {
                background: '#0066ff',
                color: '#f8f7ff',
                borderRadius: 12,
                paddingInline: 24,
                height: 42,
                fontWeight: 700,
                '&:hover': {
                  background: '#0052cc',
                },
              },
            }}
          >
            {movieId ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
