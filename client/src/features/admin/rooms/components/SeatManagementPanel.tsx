import { Tabs, Button, Alert } from '@mantine/core';
import { Trash2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useSeatMapLayout, useDeleteAllSeatsInRoom } from '../hooks/useSeatCRUD';
import { SeatGridLayout } from './SeatGridLayout';
import { SeatLayoutStats } from './SeatLayoutStats';
import { BulkCreateSeatsForm } from './BulkCreateSeatsForm';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';

type Props = {
  roomId: number;
};

export function SeatManagementPanel({ roomId }: Props) {
  const [activeTab, setActiveTab] = useState<string | null>('layout');
  const { data: layout, isLoading: layoutLoading } = useSeatMapLayout(roomId);
  const deleteAllSeats = useDeleteAllSeatsInRoom();

  const handleDeleteAll = async () => {
    if (!confirm('Bạn chắc chắn muốn xóa TẤT CẢ ghế trong phòng này? Thao tác này không thể hoàn tác.')) {
      return;
    }

    try {
      await deleteAllSeats.mutateAsync(roomId);
      notifications.show({
        color: 'green',
        title: 'Thành công',
        message: 'Đã xóa tất cả ghế',
      });
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: error instanceof Error ? error.message : 'Không xóa được ghế',
      });
    }
  };

  if (layoutLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onChange={setActiveTab} defaultValue="layout">
        <Tabs.List className="border-b border-[#424656]/40 bg-transparent">
          <Tabs.Tab value="layout" className="text-[#8c90a1] data-[active]:text-[#dae2fd]">
            Sơ đồ ghế
          </Tabs.Tab>
          <Tabs.Tab value="create" className="text-[#8c90a1] data-[active]:text-[#dae2fd]">
            Tạo ghế
          </Tabs.Tab>
          <Tabs.Tab value="stats" className="text-[#8c90a1] data-[active]:text-[#dae2fd]">
            Thống kê
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="layout" className="pt-4">
          <div className="space-y-4">
            {layout && layout.seats.length === 0 ? (
              <Alert icon={<AlertCircle size={16} />} color="yellow" variant="light">
                <p className="text-sm text-[#c2c6d8]">
                  Chưa có ghế nào. Hãy tạo ghế bằng cách chuyển sang tab "Tạo ghế"
                </p>
              </Alert>
            ) : (
              <>
                <SeatGridLayout seats={layout?.seats ?? []} loading={layoutLoading} />
                {layout && layout.seats.length > 0 && (
                  <Button
                    fullWidth
                    color="red"
                    variant="light"
                    leftSection={<Trash2 size={16} />}
                    loading={deleteAllSeats.isPending}
                    onClick={handleDeleteAll}
                  >
                    Xóa tất cả ghế
                  </Button>
                )}
              </>
            )}
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="create" className="pt-4">
          <div className="bg-[#0c1219] p-4 rounded-lg border border-[#424656]/40">
            <BulkCreateSeatsForm
              roomId={roomId}
              onSuccess={() => setActiveTab('layout')}
            />
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="stats" className="pt-4">
          <SeatLayoutStats layout={layout ?? null} loading={layoutLoading} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

