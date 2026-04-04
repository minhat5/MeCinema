import { Modal } from '@mantine/core';
import { SeatManagementPanel } from './SeatManagementPanel';

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
      title="Quản lý ghế phòng chiếu"
      size="xl"
      styles={{
        content: { backgroundColor: '#131b2e' },
        header: { backgroundColor: '#131b2e', color: '#dae2fd' },
        title: { fontWeight: 'bold', fontSize: '1.1rem' },
      }}
    >
      {roomId && typeof roomId === 'number' && (
        <SeatManagementPanel roomId={roomId} />
      )}
    </Modal>
  );
}

