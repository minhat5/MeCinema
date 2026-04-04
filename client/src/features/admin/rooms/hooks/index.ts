export {
  useAdminCinemasForRooms,
  useAdminRooms,
  useAdminRoomById,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
  type AdminRoomRow,
  type AdminRoomDetail,
} from './useRoomCRUD';

export {
  useSeatsByRoom,
  useSeatMapLayout,
  useCreateSeat,
  useBulkCreateSeats,
  useUpdateSeat,
  useDeleteSeat,
  useDeleteAllSeatsInRoom,
  type SeatDto,
  type SeatType,
  type SeatMapLayoutDto,
} from './useSeatCRUD';
