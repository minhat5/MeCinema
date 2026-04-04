import { useState, useEffect } from 'react';
import { Select } from '@mantine/core';
import { ChevronRight, Grid3x3 } from 'lucide-react';
import { useAdminRooms, useAdminCinemasForRooms } from '../hooks/useRoomCRUD';
import { SeatManagementPanel } from '../components/SeatManagementPanel';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';

export default function ManageSeatsPage() {
  const [page, setPage] = useState(1);
  const [cinemaFilter, setCinemaFilter] = useState<string | number | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const limit = 50;
  const { data: cinemas = [], isLoading: cinemasLoading } = useAdminCinemasForRooms();

  useEffect(() => {
    if (cinemas.length > 0 && !cinemaFilter) {
      setCinemaFilter(cinemas[0].id);
    }
  }, [cinemas, cinemaFilter]);

  const { data: roomsPayload, isLoading: roomsLoading } = useAdminRooms({
    page,
    limit,
    cinemaId: cinemaFilter || undefined,
  });

  const rooms = roomsPayload?.data ?? [];

  if (cinemasLoading || roomsLoading) {
    return <LoadingSpinner />;
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
              Quản lý ghế
            </h1>
            <p className="text-[#c2c6d8] flex items-center gap-2 text-sm">
              <Grid3x3 size={14} />
              <span>Hệ thống</span>
              <ChevronRight size={14} />
              <span className="text-[#b3c5ff]">Ghế chiếu</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Room Selection */}
          <div className="lg:col-span-1">
            <div className="bg-[#131b2e] rounded-xl p-6 sticky top-6 space-y-4">
              <h2 className="text-lg font-bold text-[#dae2fd]">Chọn phòng chiếu</h2>

              <Select
                placeholder="Lọc theo chi nhánh"
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
                  },
                }}
              />

              <div className="space-y-2">
                {rooms.length === 0 ? (
                  <div className="text-center text-[#8c90a1] text-sm py-4">
                    Chưa có phòng chiếu nào
                  </div>
                ) : (
                  rooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => {
                        setSelectedRoomId(room.id);
                      }}
                      className={`
                        w-full px-4 py-3 rounded-lg transition-all text-left
                        ${
                          selectedRoomId === room.id
                            ? 'bg-[#0066ff] text-white font-medium shadow-lg'
                            : 'bg-[#0c1219] text-[#dae2fd] hover:bg-[#171f33] border border-[#424656]/40'
                        }
                      `}
                    >
                      <div className="font-medium">{room.name}</div>
                      <div className="text-xs opacity-75 mt-1">
                        {room.totalSeats} ghế • {room.cinemaName}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Content - Management */}
          <div className="lg:col-span-2">
            {selectedRoomId ? (
              <div className="bg-[#131b2e] rounded-xl p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-[#dae2fd]">
                    Quản lý ghế
                  </h2>
                  <p className="text-sm text-[#8c90a1] mt-1">
                    Phòng ID: {selectedRoomId}
                  </p>
                </div>
                <SeatManagementPanel roomId={selectedRoomId} />
              </div>
            ) : (
              <div className="bg-[#131b2e] rounded-xl p-12 text-center border-2 border-dashed border-[#424656]/40">
                <Grid3x3 size={48} className="mx-auto text-[#8c90a1] mb-4" />
                <p className="text-[#8c90a1] text-lg mb-2">Chọn phòng chiếu để bắt đầu</p>
                <p className="text-[#8c90a1] text-sm">
                  Chọn một phòng từ danh sách bên trái để quản lý ghế
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

