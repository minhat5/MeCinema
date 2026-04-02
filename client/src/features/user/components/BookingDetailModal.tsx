import { Modal, Text, Button, Stack } from '@mantine/core';

interface BookingDetailModalProps {
  bookingId: string;
  opened: boolean;
  onClose: () => void;
  onCancel?: () => void;
  status: string;
}

export default function BookingDetailModal({
  bookingId,
  opened,
  onClose,
  onCancel,
  status,
}: BookingDetailModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Chi tiết đơn hàng"
      centered
      size="md"
      radius="md"
      styles={{
        content: {
          backgroundColor: '#020617',
          border: '1px solid rgba(255,255,255,0.1)',
        },
        header: { backgroundColor: '#020617', color: 'white' },
      }}
    >
      <Stack gap="md">
        <Text c="gray.4" size="sm">
          Ma don: {bookingId}
        </Text>
        <Text c="white" size="sm">
          Trang thai: {status}
        </Text>
        <Text c="gray.5" size="sm">
          Tinh nang chi tiet dat ve/mon an dang duoc hoan thien.
        </Text>
        {status === 'PENDING' && onCancel && (
          <Button color="red" variant="light" size="xs" onClick={onCancel}>
            Huy dat ve
          </Button>
        )}
      </Stack>
    </Modal>
  );
}
