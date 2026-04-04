import { Modal, Text, Button, Stack, Loader, Center } from '@mantine/core';
import { useBookingDetail } from '../../booking/hooks/useBooking';
import { TicketResult } from '../../booking/components/TicketResult';

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
  // Chỉ lấy id khi modal đang mở, rỗng thì hook sẽ không call api do `enabled: !!id`
  const queryId = opened ? bookingId : '';
  const { data: booking, isLoading, isError } = useBookingDetail(queryId);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Chi tiết đơn hàng"
      centered
      size="auto"
      radius="md"
      styles={{
        content: {
          backgroundColor: '#020617',
          border: '1px solid rgba(255,255,255,0.1)',
        },
        header: { backgroundColor: '#020617', color: 'white' },
      }}
    >
      <Stack gap="md" align="center">
        {isLoading ? (
          <Center p="xl"><Loader color="red" /></Center>
        ) : isError || !booking ? (
          <Text c="red">Không thể tải thông tin vé.</Text>
        ) : (
          <TicketResult booking={booking} />
        )}
        {status === 'PENDING' && onCancel && (
          <Button color="red" variant="light" size="xs" onClick={onCancel} w="100%">
            Hủy đặt vé
          </Button>
        )}
      </Stack>
    </Modal>
  );
}
