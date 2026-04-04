import { Button, Select, TextInput, NumberInput, Alert } from '@mantine/core';
import { Plus, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useBulkCreateSeats, type BulkCreateSeatsInput, type SeatType } from '../hooks/useSeatCRUD';

type Props = {
  roomId: number;
  onSuccess?: () => void;
};

const seatTypeOptions = [
  { value: 'NORMAL', label: 'Thường' },
  { value: 'VIP', label: 'VIP (x1.2)' },
  { value: 'SWEETBOX', label: 'Sweetbox (x1.5)' },
];

const inputStyles = {
  input: {
    backgroundColor: '#060e20',
    border: 'none',
    color: '#dae2fd',
  },
};

const labelStyles = {
  style: {
    color: '#c2c6d8',
  },
};

export function BulkCreateSeatsForm({ roomId, onSuccess }: Props) {
  const [rowSymbol, setRowSymbol] = useState('');
  const [startNumber, setStartNumber] = useState<number | string>('');
  const [endNumber, setEndNumber] = useState<number | string>('');
  const [seatType, setSeatType] = useState<SeatType | null>('NORMAL');

  const bulkCreate = useBulkCreateSeats();

  const handleSubmit = async () => {
    if (!rowSymbol.trim()) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: 'Nhập ký tự hàng (A, B, C...)',
      });
      return;
    }

    if (!startNumber || !endNumber) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: 'Nhập số ghế bắt đầu và kết thúc',
      });
      return;
    }

    const start = Number(startNumber);
    const end = Number(endNumber);

    if (start > end) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: 'Số ghế bắt đầu phải nhỏ hơn hoặc bằng số ghế kết thúc',
      });
      return;
    }

    if (!seatType) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: 'Chọn loại ghế',
      });
      return;
    }

    try {
      const body: BulkCreateSeatsInput = {
        roomId,
        rowSymbol: rowSymbol.trim().toUpperCase(),
        startSeatNumber: start,
        endSeatNumber: end,
        type: seatType,
      };

      await bulkCreate.mutateAsync(body);

      notifications.show({
        color: 'green',
        title: 'Thành công',
        message: `Đã tạo ${end - start + 1} ghế hàng ${rowSymbol.toUpperCase()}`,
      });

      // Reset form
      setRowSymbol('');
      setStartNumber('');
      setEndNumber('');
      setSeatType('NORMAL');

      onSuccess?.();
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: error instanceof Error ? error.message : 'Không tạo được ghế',
      });
    }
  };

  return (
    <div className="space-y-4">
      <Alert icon={<AlertCircle size={16} />} color="blue" variant="light">
        <p className="text-sm text-[#8c90a1]">
          Tạo nhiều ghế cùng lúc theo hàng. Ví dụ: hàng A ghế 1-10
        </p>
      </Alert>

      <TextInput
        label="Ký tự hàng (A, B, C...)"
        value={rowSymbol}
        onChange={(e) => setRowSymbol(e.currentTarget.value.toUpperCase())}
        maxLength={10}
        styles={inputStyles}
        labelProps={labelStyles}
      />

      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          label="Ghế bắt đầu"
          value={startNumber}
          onChange={setStartNumber}
          min={1}
          styles={inputStyles}
          labelProps={labelStyles}
        />
        <NumberInput
          label="Ghế kết thúc"
          value={endNumber}
          onChange={setEndNumber}
          min={1}
          styles={inputStyles}
          labelProps={labelStyles}
        />
      </div>

      <Select
        label="Loại ghế"
        data={seatTypeOptions}
        value={seatType}
        onChange={(v) => setSeatType(v as SeatType)}
        searchable
        styles={inputStyles}
        labelProps={labelStyles}
      />

      <Button
        fullWidth
        loading={bulkCreate.isPending}
        onClick={handleSubmit}
        leftSection={<Plus size={16} />}
        styles={{
          root: {
            background: '#0066ff',
            fontWeight: 700,
            marginTop: 8,
          },
        }}
      >
        Tạo ghế
      </Button>
    </div>
  );
}

