import { useEffect, useState } from 'react';
import { Button, Modal, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { AdminRoomRow } from '../hooks/useRoomCRUD';
import { useUpdateRoom } from '../hooks/useRoomCRUD';

const inputStyles = {
  input: {
    backgroundColor: '#060e20',
    border: 'none',
    color: '#dae2fd',
  },
};

type Props = {
  room: AdminRoomRow | null;
  opened: boolean;
  onClose: () => void;
};

export function EditRoomModal({ room, opened, onClose }: Props) {
  const [name, setName] = useState('');
  const updateRoom = useUpdateRoom();

  useEffect(() => {
    if (room && opened) {
      setName(room.name);
    }
  }, [room, opened]);

  const handleSave = async () => {
    if (!room || !name.trim()) {
      notifications.show({
        color: 'red',
        title: 'Thiếu thông tin',
        message: 'Nhập tên phòng chiếu.',
      });
      return;
    }
    try {
      await updateRoom.mutateAsync({
        id: room.id,
        body: {
          name: name.trim(),
        },
      });
      notifications.show({
        color: 'green',
        title: 'Đã lưu',
        message: 'Cập nhật phòng chiếu thành công.',
      });
      onClose();
    } catch (e: unknown) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: e instanceof Error ? e.message : 'Không cập nhật được.',
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Sửa phòng chiếu"
      size="md"
      styles={{
        content: { backgroundColor: '#131b2e' },
        header: { backgroundColor: '#131b2e', color: '#dae2fd' },
        title: { fontWeight: 'bold', fontSize: '1.25rem' },
      }}
    >
      <div className="space-y-4">
        <TextInput
          label="Tên phòng"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          styles={inputStyles}
          labelProps={{ style: { color: '#c2c6d8' } }}
        />
        <Button
          fullWidth
          loading={updateRoom.isPending}
          onClick={() => void handleSave()}
          styles={{
            root: { background: '#0066ff', fontWeight: 700 },
          }}
        >
          Lưu thay đổi
        </Button>
      </div>
    </Modal>
  );
}

