import {useState, useEffect} from 'react';
import {
  Button,
  TextInput,
  Select,
  Modal,
} from '@mantine/core';
import {
  Plus,
  Home,
  ChevronRight,
  Pencil,
  Info,
  Trash2,
} from 'lucide-react';
import {notifications} from '@mantine/notifications';
import {
  useAdminCinemasForRooms,
  useAdminRooms,
  useCreateRoom,
  useDeleteRoom,
  type AdminRoomRow,
} from '../hooks/useRoomCRUD';
import {EditRoomModal} from '../components/EditRoomModal';
import {RoomSeatConfigModal} from '../components/RoomSeatConfigModal';
import {LoadingSpinner} from '../../../../components/ui/LoadingSpinner';

const inputStyles = {
  input: {
    backgroundColor: '#060e20',
    border: 'none',
    color: '#dae2fd',
  },
};

export default function ManageRoomsPage() {
  const [page, setPage] = useState(1);
  const [cinemaFilter, setCinemaFilter] = useState<string | number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cinemaId, setCinemaId] = useState<string | number | null>(null);
  const [name, setName] = useState('');
  const [editRoom, setEditRoom] = useState<AdminRoomRow | null>(null);
  const [infoRoomId, setInfoRoomId] = useState<string | number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminRoomRow | null>(null);

  const limit = 10;
  const {data: cinemas = [], isLoading: cinemasLoading} =
      useAdminCinemasForRooms();
  useEffect(() => {
    if (cinemas.length > 0 && !cinemaFilter) {
      setCinemaFilter(cinemas[0].id);
    }
  }, [cinemas, cinemaFilter]);

  const {data: roomsPayload, isLoading: roomsLoading} = useAdminRooms({
    page,
    limit,
    cinemaId: cinemaFilter || undefined,
  });

  const createRoom = useCreateRoom();
  const deleteRoom = useDeleteRoom();

  const rooms: AdminRoomRow[] = roomsPayload?.data ?? [];
  const pagination = roomsPayload?.pagination;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);

  const resetForm = () => {
    setCinemaId(null);
    setName('');
  };

  const handleSubmit = async () => {
    if (!cinemaId || !name.trim()) {
      notifications.show({
        color: 'red',
        title: 'Thiếu thông tin',
        message: 'Chọn chi nhánh và nhập tên phòng.',
      });
      return;
    }
    try {
      await createRoom.mutateAsync({
        cinemaId: Number(cinemaId),
        name: name.trim(),
      });
      notifications.show({
        color: 'green',
        title: 'Thành công',
        message: 'Đã tạo phòng chiếu.',
      });
      setModalOpen(false);
      resetForm();
    } catch (e: unknown) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: e instanceof Error ? e.message : 'Không tạo được phòng.',
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteRoom.mutateAsync(deleteTarget.id);
      notifications.show({
        color: 'green',
        title: 'Đã xóa',
        message: 'Phòng chiếu đã được xóa.',
      });
      setDeleteTarget(null);
    } catch (e: unknown) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: e instanceof Error ? e.message : 'Không xóa được phòng.',
      });
    }
  };

  if (roomsLoading || cinemasLoading) {
    return <LoadingSpinner/>;
  }

  const cinemaSelectData = cinemas.map((c) => ({
    value: String(c.id),
    label: `${c.name} ${c.city ? `— ${c.city}` : ''}`,
  }));

  return (
      <div className="w-full min-w-0">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 mb-8">
            <div className="min-w-0">
              <h1 className="text-4xl font-extrabold tracking-tight text-[#dae2fd] mb-2">
                Quản lý phòng chiếu
              </h1>
              <p className="text-[#c2c6d8] flex items-center gap-2 text-sm">
                <Home size={14}/>
                <span>Hệ thống</span>
                <ChevronRight size={14}/>
                <span className="text-[#b3c5ff]">Phòng chiếu</span>
              </p>
            </div>

            <Button
                onClick={() => setModalOpen(true)}
                leftSection={<Plus size={18}/>}
                styles={{
                  root: {
                    background: '#0066ff',
                    color: '#f8f7ff',
                    borderRadius: 14,
                    paddingInline: 18,
                    height: 44,
                    fontWeight: 800,
                    boxShadow: '0 12px 24px rgba(0,102,255,0.22)',
                  },
                }}
            >
              Thêm phòng chiếu
            </Button>
          </div>

          <div className="bg-[#131b2e] p-6 rounded-xl mb-6">
            <Select
                placeholder="Lọc theo chi nhánh"
                clearable
                searchable
                data={cinemaSelectData}
                value={cinemaFilter ? String(cinemaFilter) : null}
                onChange={(v) => {
                  setCinemaFilter(v ? Number(v) : null);
                  setPage(1);
                }}
                styles={{
                  input: {
                    backgroundColor: '#060e20',
                    border: 'none',
                    color: '#dae2fd',
                    minWidth: 320,
                  },
                }}
            />
          </div>

          <div className="bg-[#131b2e] rounded-xl overflow-hidden">
            {rooms.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-[#8c90a1]">Chưa có phòng chiếu nào</p>
                </div>
            ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                      <tr className="border-b border-[#424656]/40 text-[#8c90a1] text-xs uppercase tracking-wider">
                        <th className="px-4 py-3 font-semibold">Tên phòng</th>
                        <th className="px-4 py-3 font-semibold">Chi nhánh</th>
                        <th className="px-4 py-3 font-semibold">Tổng ghế</th>
                        <th className="px-4 py-3 font-semibold">Ngày tạo</th>
                        <th className="px-4 py-3 font-semibold text-right">
                          Thao tác
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                      {rooms.map((room) => (
                          <tr
                              key={room.id}
                              className="border-b border-[#424656]/25 hover:bg-[#171f33]/80"
                          >
                            <td className="px-4 py-3 text-[#dae2fd] font-medium">
                              {room.name}
                            </td>
                            <td className="px-4 py-3 text-[#dae2fd]">
                              {room.cinemaName}
                            </td>
                            <td className="px-4 py-3 text-[#dae2fd]">
                              {room.totalSeats}
                            </td>
                            <td className="px-4 py-3 text-[#8c90a1] text-sm">
                              {room.createdAt
                                  ? new Date(room.createdAt).toLocaleDateString('vi-VN')
                                  : '—'}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex flex-wrap justify-end gap-1.5">
                                <Button
                                    size="xs"
                                    variant="light"
                                    color="gray"
                                    leftSection={<Pencil size={12}/>}
                                    styles={{
                                      root: {
                                        backgroundColor: '#222a3d',
                                        color: '#dae2fd',
                                      },
                                    }}
                                    onClick={() => setEditRoom(room)}
                                >
                                  Sửa
                                </Button>
                                <Button
                                    size="xs"
                                    variant="light"
                                    color="gray"
                                    leftSection={<Info size={12}/>}
                                    styles={{
                                      root: {
                                        backgroundColor: '#222a3d',
                                        color: '#dae2fd',
                                      },
                                    }}
                                    onClick={() => setInfoRoomId(room.id)}
                                >
                                  Chi tiết
                                </Button>
                                <Button
                                    size="xs"
                                    variant="light"
                                    color="red"
                                    leftSection={<Trash2 size={12}/>}
                                    onClick={() => setDeleteTarget(room)}
                                >
                                  Xóa
                                </Button>
                              </div>
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && (
                      <div className="p-4 flex justify-center border-t border-[#424656]/30">
                        <div className="flex gap-2">
                          {Array.from({length: totalPages}, (_, i) => (
                              <button
                                  key={i + 1}
                                  type="button"
                                  onClick={() => setPage(i + 1)}
                                  className={`px-4 py-2 rounded-lg transition-all ${
                                      page === i + 1
                                          ? 'bg-[#0066ff] text-white font-bold'
                                          : 'bg-[#060e20] text-[#8c90a1] hover:text-[#dae2fd]'
                                  }`}
                              >
                                {i + 1}
                              </button>
                          ))}
                        </div>
                      </div>
                  )}
                </>
            )}
          </div>
        </div>

        <Modal
            opened={modalOpen}
            onClose={() => {
              setModalOpen(false);
              resetForm();
            }}
            title="Thêm phòng chiếu"
            size="md"
            styles={{
              content: {backgroundColor: '#131b2e'},
              header: {backgroundColor: '#131b2e', color: '#dae2fd'},
              title: {fontWeight: 'bold', fontSize: '1.25rem'},
            }}
        >
          <div className="space-y-4">
            <Select
                label="Chi nhánh"
                placeholder="Chọn rạp"
                searchable
                data={cinemaSelectData}
                value={cinemaId ? String(cinemaId) : null}
                onChange={(v) => setCinemaId(v ? Number(v) : null)}
                required
                styles={inputStyles}
                labelProps={{style: {color: '#c2c6d8'}}}
            />
            <TextInput
                label="Tên phòng"
                placeholder="Ví dụ: Phòng 1"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                required
                styles={inputStyles}
                labelProps={{style: {color: '#c2c6d8'}}}
            />
            <Button
                fullWidth
                loading={createRoom.isPending}
                onClick={() => void handleSubmit()}
                styles={{
                  root: {
                    background: '#0066ff',
                    fontWeight: 700,
                    marginTop: 8,
                  },
                }}
            >
              Tạo phòng
            </Button>
          </div>
        </Modal>

        <EditRoomModal
            room={editRoom}
            opened={!!editRoom}
            onClose={() => setEditRoom(null)}
        />

        <RoomSeatConfigModal
            roomId={infoRoomId}
            opened={!!infoRoomId}
            onClose={() => setInfoRoomId(null)}
        />

        <Modal
            opened={!!deleteTarget}
            onClose={() => setDeleteTarget(null)}
            title="Xóa phòng chiếu?"
            size="sm"
            styles={{
              content: {backgroundColor: '#131b2e'},
              header: {backgroundColor: '#131b2e', color: '#dae2fd'},
              title: {fontWeight: 'bold', fontSize: '1.1rem'},
            }}
        >
          <p className="text-[#c2c6d8] text-sm mb-4">
            Phòng chiếu &quot;{deleteTarget?.name}&quot; sẽ bị xóa vĩnh viễn. Thao tác này
            không thể hoàn tác.
          </p>
          <div className="flex gap-2 justify-end">
            <Button
                variant="subtle"
                color="gray"
                onClick={() => setDeleteTarget(null)}
            >
              Hủy
            </Button>
            <Button
                color="red"
                loading={deleteRoom.isPending}
                onClick={() => void confirmDelete()}
            >
              Xóa
            </Button>
          </div>
        </Modal>
      </div>
  );
}

