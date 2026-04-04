import { Select, TextInput } from '@mantine/core';

const inputStyles = {
  input: {
    backgroundColor: '#060e20',
    border: 'none',
    color: '#dae2fd',
  },
};

interface RoomFormProps {
  cinemaId: string | number | null;
  onCinemaChange: (value: string | number | null) => void;
  name: string;
  onNameChange: (value: string) => void;
  cinemaSelectData: Array<{ value: string; label: string }>;
}

export function RoomForm({
  cinemaId,
  onCinemaChange,
  name,
  onNameChange,
  cinemaSelectData,
}: RoomFormProps) {
  return (
    <div className="space-y-4">
      <Select
        label="Chi nhánh"
        placeholder="Chọn rạp"
        searchable
        data={cinemaSelectData}
        value={cinemaId ? String(cinemaId) : null}
        onChange={(v) => onCinemaChange(v ? Number(v) : null)}
        required
        styles={inputStyles}
        labelProps={{ style: { color: '#c2c6d8' } }}
      />
      <TextInput
        label="Tên phòng"
        placeholder="Ví dụ: Phòng 1"
        value={name}
        onChange={(e) => onNameChange(e.currentTarget.value)}
        required
        styles={inputStyles}
        labelProps={{ style: { color: '#c2c6d8' } }}
      />
    </div>
  );
}

