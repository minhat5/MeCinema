import { Button, Modal } from '@mantine/core';

type Props = {
  roomId: string | number | null;
  opened: boolean;
  onClose: () => void;
};

export function RoomSeatConfigModal({ roomId, opened, onClose }: Props) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Thông tin phòng chiếu"
      size="md"
      styles={{
        content: { backgroundColor: '#131b2e' },
        header: { backgroundColor: '#131b2e', color: '#dae2fd' },
        title: { fontWeight: 'bold', fontSize: '1.1rem' },
      }}
    >
      <div className="space-y-4">
        <p className="text-sm text-[#8c90a1]">
          Tính năng cấu hình ghế sẽ được bổ sung trong tương lai.
        </p>
        <p className="text-sm text-[#c2c6d8]">
          ID phòng: <span className="font-semibold">{roomId}</span>
        </p>
        <div className="flex gap-2 justify-end pt-2 border-t border-[#424656]/40">
          <Button
            onClick={onClose}
            styles={{ root: { background: '#0066ff', fontWeight: 700 } }}
          >
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
}

