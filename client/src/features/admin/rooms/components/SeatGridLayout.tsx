import { useState } from 'react';
import { Button, Select, Group } from '@mantine/core';
import { Pencil, Trash2 } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { useUpdateSeat, useDeleteSeat, type SeatDto, type SeatType } from '../hooks/useSeatCRUD';

type Props = {
  seats: SeatDto[];
  loading?: boolean;
};

const seatTypeOptions = [
  { value: 'NORMAL', label: 'Thường' },
  { value: 'VIP', label: 'VIP (x1.2)' },
  { value: 'SWEETBOX', label: 'Sweetbox (x1.5)' },
];

const seatTypeColors: Record<SeatType, string> = {
  NORMAL: 'bg-[#4a5568]',
  VIP: 'bg-[#d4af37]',
  SWEETBOX: 'bg-[#ff69b4]',
};

const seatTypeLabels: Record<SeatType, string> = {
  NORMAL: 'Thường',
  VIP: 'VIP',
  SWEETBOX: 'Sweetbox',
};

export function SeatGridLayout({ seats, loading }: Props) {
  const [editingSeatId, setEditingSeatId] = useState<number | null>(null);
  const [newType, setNewType] = useState<SeatType | null>(null);
  const updateSeat = useUpdateSeat();
  const deleteSeat = useDeleteSeat();

  // Organize seats by row
  const seatsByRow = seats.reduce(
    (acc, seat) => {
      if (!acc[seat.rowSymbol]) {
        acc[seat.rowSymbol] = [];
      }
      acc[seat.rowSymbol].push(seat);
      return acc;
    },
    {} as Record<string, SeatDto[]>
  );

  // Sort rows alphabetically
  const sortedRows = Object.keys(seatsByRow).sort();

  const handleUpdateType = async (seatId: number) => {
    if (!newType) return;
    try {
      await updateSeat.mutateAsync({ seatId, body: { type: newType } });
      notifications.show({
        color: 'green',
        title: 'Thành công',
        message: 'Đã cập nhật loại ghế',
      });
      setEditingSeatId(null);
      setNewType(null);
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: error instanceof Error ? error.message : 'Không cập nhật được ghế',
      });
    }
  };

  const handleDelete = async (seatId: number) => {
    if (!confirm('Bạn chắc chắn muốn xóa ghế này?')) return;
    try {
      await deleteSeat.mutateAsync(seatId);
      notifications.show({
        color: 'green',
        title: 'Thành công',
        message: 'Đã xóa ghế',
      });
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: error instanceof Error ? error.message : 'Không xóa được ghế',
      });
    }
  };

  if (loading) {
    return <div className="text-center text-[#8c90a1]">Đang tải...</div>;
  }

  if (seats.length === 0) {
    return <div className="text-center text-[#8c90a1]">Chưa có ghế nào</div>;
  }

  return (
    <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
      {sortedRows.map((row) => (
        <div key={row}>
          <div className="text-sm font-bold text-[#dae2fd] mb-2 px-2">Hàng {row}</div>
          <div className="flex flex-wrap gap-2">
            {seatsByRow[row]
              .sort((a, b) => a.seatNumber - b.seatNumber)
              .map((seat) => (
                <div key={seat.id} className="relative group">
                  <div
                    className={`
                      w-12 h-12 rounded-lg flex items-center justify-center
                      text-xs font-bold cursor-pointer transition-all
                      ${seatTypeColors[seat.type]}
                      text-white hover:opacity-80 relative
                    `}
                  >
                    {row}
                    {seat.seatNumber}

                    {/* Hover menu */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col gap-1 bg-[#0c1219] p-2 rounded-lg shadow-lg border border-[#424656]/40 z-10 w-max whitespace-nowrap">
                      <button
                        onClick={() => {
                          setEditingSeatId(seat.id);
                          setNewType(seat.type);
                        }}
                        className="text-xs text-[#dae2fd] hover:text-[#0066ff] flex items-center gap-1 px-2 py-1"
                      >
                        <Pencil size={12} /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(seat.id)}
                        className="text-xs text-[#dae2fd] hover:text-red-400 flex items-center gap-1 px-2 py-1"
                      >
                        <Trash2 size={12} /> Xóa
                      </button>
                    </div>

                    {/* Edit popover */}
                    {editingSeatId === seat.id && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#131b2e] p-2 rounded-lg shadow-lg border border-[#424656]/40 z-20 w-40">
                        <div className="space-y-1">
                          <Select
                            size="xs"
                            data={seatTypeOptions}
                            value={newType}
                            onChange={(v) => setNewType(v as SeatType)}
                            searchable
                            styles={{
                              input: {
                                backgroundColor: '#060e20',
                                border: 'none',
                                color: '#dae2fd',
                                fontSize: '0.75rem',
                              },
                            }}
                          />
                          <Group gap={4} grow>
                            <Button
                              size="xs"
                              onClick={() => handleUpdateType(seat.id)}
                              loading={updateSeat.isPending}
                              styles={{
                                root: {
                                  background: '#0066ff',
                                  height: 24,
                                },
                              }}
                            >
                              Lưu
                            </Button>
                            <Button
                              size="xs"
                              variant="subtle"
                              color="gray"
                              onClick={() => {
                                setEditingSeatId(null);
                                setNewType(null);
                              }}
                              styles={{
                                root: {
                                  height: 24,
                                },
                              }}
                            >
                              Hủy
                            </Button>
                          </Group>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-[#8c90a1] text-center mt-1">
                    {seatTypeLabels[seat.type]}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

