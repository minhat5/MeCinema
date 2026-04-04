import { Badge, Group } from '@mantine/core';
import { useSeatMapLayout } from '../hooks/useSeatCRUD';

type Props = {
  roomId: number;
};

export function SeatCountBadge({ roomId }: Props) {
  const { data: layout, isLoading } = useSeatMapLayout(roomId);

  if (isLoading) {
    return <Badge>Đang tải...</Badge>;
  }

  if (!layout) {
    return <Badge color="gray">Chưa có ghế</Badge>;
  }

  const { stats } = layout;
  const hasSeats = stats.totalSeats > 0;

  return (
    <Group gap="xs" wrap="nowrap">
      <Badge
        size="lg"
        color="#0066ff"
        variant="light"
        className="font-bold"
      >
        {stats.totalSeats} ghế
      </Badge>
      {hasSeats && (
        <>
          <Badge size="sm" color="gray" variant="dot">
            {stats.normalSeats}
          </Badge>
          <Badge size="sm" color="yellow" variant="dot">
            {stats.vipSeats}
          </Badge>
          <Badge size="sm" color="pink" variant="dot">
            {stats.sweetboxSeats}
          </Badge>
        </>
      )}
    </Group>
  );
}

