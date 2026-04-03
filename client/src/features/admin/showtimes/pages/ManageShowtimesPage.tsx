import { useMemo, useState } from 'react';
import { Badge, Button, Modal, SegmentedControl, TextInput } from '@mantine/core';
import {
  Calendar,
  ChevronRight,
  Clock,
  Edit,
  Film,
  Home,
  MapPin,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react';
import ShowtimeForm from '../components/ShowtimeForm';
import ShowtimeCalendar from '../components/ShowtimeCalendar';
import { useCancelShowtime, useShowtimes, type ShowtimeItem } from '../hooks/useShowtimeCRUD';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { useDebounce } from '../../../../hooks/useDebounce';

const parseDate = (value: string) => new Date(value.replace(' ', 'T'));

export default function ManageShowtimesPage() {
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [dateFilter, setDateFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const debouncedDate = useDebounce(dateFilter, 300);
  const debouncedSearch = useDebounce(searchInput, 300);

  const [openFormModal, setOpenFormModal] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<ShowtimeItem | null>(null);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);

  const { data: response, isLoading } = useShowtimes({
    page,
    limit: 15,
    sortBy: 'startTime',
    sortDirection: 'desc',
  });
  const cancelMutation = useCancelShowtime();

  const showtimes = response?.data?.data ?? [];
  const totalPages = response?.data?.pagination?.totalPages ?? 1;

  const filteredShowtimes = useMemo(() => {
    const normalized = debouncedSearch.trim().toLowerCase();
    return showtimes.filter((st) => {
      const bySearch =
        !normalized
        || [st.movieTitle, st.cinemaName, st.roomName].some((value) =>
          String(value ?? '').toLowerCase().includes(normalized),
        );
      const byDate =
        !debouncedDate || parseDate(st.startTime).toISOString().slice(0, 10) === debouncedDate;
      return bySearch && byDate;
    });
  }, [showtimes, debouncedSearch, debouncedDate]);

  const stats = useMemo(() => {
    const now = Date.now();
    return {
      total: showtimes.length,
      upcoming: showtimes.filter((item) => parseDate(item.startTime).getTime() > now).length,
      finished: showtimes.filter((item) => parseDate(item.endTime).getTime() <= now).length,
    };
  }, [showtimes]);

  const handleEdit = (showtime: ShowtimeItem) => {
    setEditingShowtime(showtime);
    setOpenFormModal(true);
  };

  const handleCloseForm = () => {
    setOpenFormModal(false);
    setEditingShowtime(null);
  };

  const handleCancel = () => {
    if (!cancelConfirmId) return;
    cancelMutation.mutate(cancelConfirmId, { onSuccess: () => setCancelConfirmId(null) });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full min-w-0">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 mb-8">
          <div className="min-w-0">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#dae2fd] mb-2">Quản lý lịch chiếu</h1>
            <p className="text-[#c2c6d8] flex items-center gap-2 text-sm">
              <Home size={14} />
              <span>Hệ thống</span>
              <ChevronRight size={14} />
              <span className="text-[#b3c5ff]">Lịch chiếu</span>
            </p>
          </div>

          <Button
            onClick={() => setOpenFormModal(true)}
            leftSection={<Plus size={18} />}
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
            Tạo suất chiếu
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-[#131b2e] border border-[#424656]/30">
            <p className="text-xs text-[#8c90a1]">Tổng suất chiếu</p>
            <p className="text-2xl font-extrabold text-[#dae2fd]">{stats.total}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#131b2e] border border-[#424656]/30">
            <p className="text-xs text-[#8c90a1]">Sắp chiếu</p>
            <p className="text-2xl font-extrabold text-green-400">{stats.upcoming}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#131b2e] border border-[#424656]/30">
            <p className="text-xs text-[#8c90a1]">Đã chiếu</p>
            <p className="text-2xl font-extrabold text-slate-300">{stats.finished}</p>
          </div>
        </div>

        <div className="bg-[#131b2e] p-6 rounded-xl mb-6 space-y-4">
          <div className="flex gap-4 flex-wrap">
            <TextInput
              placeholder="Tìm theo phim, rạp, phòng..."
              leftSection={<Search size={16} />}
              value={searchInput}
              onChange={(event) => setSearchInput(event.currentTarget.value)}
              styles={{
                input: {
                  backgroundColor: '#060e20',
                  border: 'none',
                  color: '#dae2fd',
                  minWidth: '280px',
                },
              }}
            />

            <TextInput
              placeholder="Lọc theo ngày"
              leftSection={<Calendar size={16} />}
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.currentTarget.value)}
              styles={{
                input: {
                  backgroundColor: '#060e20',
                  border: 'none',
                  color: '#dae2fd',
                  minWidth: '200px',
                },
              }}
            />

            <Button
              variant="light"
              color="gray"
              leftSection={<RotateCcw size={16} />}
              onClick={() => {
                setPage(1);
                setDateFilter('');
                setSearchInput('');
              }}
            >
              Đặt lại bộ lọc
            </Button>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-[#8c90a1]">Hiển thị {filteredShowtimes.length} suất chiếu</p>
            <SegmentedControl
              value={viewMode}
              onChange={(value) => setViewMode(value as 'list' | 'calendar')}
              data={[
                { label: 'Danh sách', value: 'list' },
                { label: 'Lịch', value: 'calendar' },
              ]}
              color="blue"
            />
          </div>
        </div>

        {viewMode === 'calendar' ? (
          <ShowtimeCalendar
            showtimes={filteredShowtimes}
            onEdit={handleEdit}
            onCancel={(id) => setCancelConfirmId(id)}
          />
        ) : (
          <div className="bg-[#131b2e] rounded-xl overflow-hidden">
            {filteredShowtimes.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar size={48} className="mx-auto mb-4 text-[#424656]" />
                <p className="text-[#8c90a1]">Không tìm thấy suất chiếu nào</p>
              </div>
            ) : (
              <>
                <div className="hidden lg:grid grid-cols-[2fr_1.6fr_1fr_1fr_1fr_120px] gap-4 px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#8c90a1] border-b border-[#424656]/30">
                  <span className="flex items-center gap-1">
                    <Film size={12} /> Phim
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> Rạp / Phòng
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> Giờ chiếu
                  </span>
                  <span>Kết thúc</span>
                  <span>Giá vé</span>
                  <span className="text-center">Thao tác</span>
                </div>

                {filteredShowtimes.map((st) => (
                  <div
                    key={st._id}
                    className="grid grid-cols-1 lg:grid-cols-[2fr_1.6fr_1fr_1fr_1fr_120px] gap-4 px-6 py-4 items-center border-b border-[#424656]/15 hover:bg-[#1a2440] transition"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-[#dae2fd] truncate">{st.movieTitle || 'N/A'}</p>
                      <p className="text-xs text-[#8c90a1] mt-0.5">Mã phim: {st.movieId}</p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm text-[#c2c6d8] truncate">{st.cinemaName || 'N/A'}</p>
                      <p className="text-xs text-[#8c90a1]">{st.roomName || 'N/A'}</p>
                    </div>

                    <div>
                      <p className="text-sm text-[#dae2fd] font-semibold">
                        {parseDate(st.startTime).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-xs text-[#8c90a1]">{parseDate(st.startTime).toLocaleDateString('vi-VN')}</p>
                    </div>

                    <div>
                      <p className="text-sm text-[#dae2fd] font-semibold">
                        {parseDate(st.endTime).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-xs text-[#8c90a1]">{parseDate(st.endTime).toLocaleDateString('vi-VN')}</p>
                    </div>

                    <Badge color="blue" variant="light" size="sm" styles={{ root: { textTransform: 'none', fontWeight: 700 } }}>
                      {st.basePrice.toLocaleString('vi-VN')}đ
                    </Badge>

                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(st)}
                        className="p-2 rounded-lg bg-[#0066ff]/15 text-[#4d9aff] hover:bg-[#0066ff]/25 transition"
                        title="Sửa suất chiếu"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setCancelConfirmId(st._id)}
                        className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition"
                        title="Huỷ suất chiếu"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {totalPages > 1 && (
                  <div className="p-4 flex justify-center border-t border-[#424656]/30">
                    <div className="flex gap-2">
                      {Array.from({ length: Math.min(totalPages, 10) }, (_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => setPage(index + 1)}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            page === index + 1
                              ? 'bg-[#0066ff] text-white font-bold'
                              : 'bg-[#060e20] text-[#8c90a1] hover:text-[#dae2fd]'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <Modal
        opened={openFormModal}
        onClose={handleCloseForm}
        title={editingShowtime ? 'Sửa suất chiếu' : 'Tạo suất chiếu mới'}
        size="lg"
        styles={{
          content: { backgroundColor: '#131b2e' },
          header: { backgroundColor: '#131b2e', color: '#dae2fd' },
          title: { fontWeight: 'bold', fontSize: '1.25rem' },
        }}
      >
        <ShowtimeForm initialData={editingShowtime} onSuccess={handleCloseForm} />
      </Modal>

      <Modal
        opened={!!cancelConfirmId}
        onClose={() => setCancelConfirmId(null)}
        title="Xác nhận huỷ suất chiếu"
        size="sm"
        centered
        styles={{
          content: { backgroundColor: '#131b2e' },
          header: { backgroundColor: '#131b2e', color: '#dae2fd' },
          title: { fontWeight: 'bold', fontSize: '1.1rem' },
        }}
      >
        <div className="space-y-4">
          <p className="text-[#c2c6d8] text-sm">Bạn có chắc chắn muốn huỷ suất chiếu này không?</p>
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-300 text-xs font-semibold">Lưu ý: thao tác này không thể hoàn tác.</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="subtle" color="gray" onClick={() => setCancelConfirmId(null)}>
              Không
            </Button>
            <Button color="red" loading={cancelMutation.isPending} onClick={handleCancel}>
              Xác nhận huỷ
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

