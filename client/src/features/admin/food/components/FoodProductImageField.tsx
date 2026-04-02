import { Image, Stack, Text, TextInput } from '@mantine/core';
import {
  getProductImageFallback,
  getProductImageUrl,
} from '@/utils/image';
import { getDirectImageUrlError } from '../utils/image-url';

type Props = {
  value: string;
  onChange: (url: string) => void;
  /** Dùng cho ảnh dự phòng khi chưa có / lỗi */
  category?: string;
  disabled?: boolean;
};

export function FoodProductImageField({
  value,
  onChange,
  category,
  disabled,
}: Props) {
  const urlError = value.trim() ? getDirectImageUrlError(value) : null;

  return (
    <Stack gap="xs">
      {value ? (
        <Image
          src={getProductImageUrl(value, category, 'thumb')}
          fallbackSrc={getProductImageFallback(category)}
          h={160}
          radius="md"
          fit="cover"
          alt="Xem trước"
        />
      ) : (
        <Text size="sm" c="dimmed">
          Chưa có ảnh
        </Text>
      )}

      <TextInput
        label="Liên kết ảnh sản phẩm"
        description="Dán link ảnh trực tiếp (đuôi .jpg, .png, .webp...)."
        placeholder="https://example.com/food.jpg"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.currentTarget.value)}
        error={urlError ?? undefined}
        styles={{
          label: { color: '#c2c6d8' },
          description: { color: '#8c90a1' },
          input: {
            backgroundColor: '#060e20',
            border: 'none',
            color: '#dae2fd',
          },
        }}
      />
      <Text size="xs" c="dimmed">
        Ví dụ sai: link bài viết. Ví dụ đúng: link mở ra ảnh ngay.
      </Text>
    </Stack>
  );
}
