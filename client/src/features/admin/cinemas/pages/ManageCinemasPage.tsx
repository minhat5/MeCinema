import { useMemo, useState } from 'react';
import { Button, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Home, ChevronRight, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  useAdminCinemas,
  useCreateCinema,
  useDeleteCinema,
  useUpdateCinema,
  type Cinema,
} from '../hooks/useCinemas';

export default function ManageCinemasPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [editingCinema, setEditingCinema] = useState<Cinema | null>(null);
  const [formData, setFormData] = useState({ name: '', address: '', hotline: '' });

  const limit = 10;
  const { data, isLoading } = useAdminCinemas({
    page,
    limit,
    search: searchInput,
  });

  const createCinema = useCreateCinema();
  const updateCinema = useUpdateCinema();
  const deleteCinema = useDeleteCinema();

  const cinemas = data?.data ?? [];
  const totalPages = Math.max(1, data?.pagination.totalPages ?? 1);

  const isSubmitting = createCinema.isPending || updateCinema.isPending;

  const modalTitle = useMemo(
    () => (editingCinema ? 'Chỉnh sửa cụm rạp' : 'Thêm cụm rạp'),
    [editingCinema],
  );

  const openCreate = () => {
    setEditingCinema(null);
    setFormData({ name: '', address: '', hotline: '' });
    setOpenModal(true);
  };

  const openEdit = (cinema: Cinema) => {
    setEditingCinema(cinema);
    setFormData({
      name: cinema.name,
      address: cinema.address,
      hotline: cinema.hotline,
    });
    setOpenModal(true);
  };

  const handleSave = async () => {
    const { name, address, hotline } = formData;
    const trimmedName = name.trim();
    const trimmedAddress = address.trim();
    const trimmedHotline = hotline.trim();

    if (!trimmedName || !trimmedAddress || !trimmedHotline) {
      notifications.show({
        color: 'red',
        title: 'Thiếu thông tin',
        message: 'Vui lòng nhập đầy đủ thông tin cụm rạp.',
      });
      return;
    }

    try {
      if (editingCinema) {
        await updateCinema.mutateAsync({
          id: editingCinema.id,
          name: trimmedName,
          address: trimmedAddress,
          hotline: trimmedHotline,
        });
        notifications.show({
          color: 'green',
          title: 'Thành công',
          message: 'Đã cập nhật cụm rạp.',
        });
      } else {
        await createCinema.mutateAsync({
          name: trimmedName,
          address: trimmedAddress,
          hotline: trimmedHotline,
        });
        notifications.show({
          color: 'green',
          title: 'Thành công',
          message: 'Đã thêm cụm rạp mới.',
        });
      }
      setOpenModal(false);
      setEditingCinema(null);
      setFormData({ name: '', address: '', hotline: '' });
      setPage(1);
    } catch (error: unknown) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: error instanceof Error ? error.message : 'Không thể lưu cụm rạp.',
      });
    }
  };

  const handleDelete = async (cinema: Cinema) => {
    if (!window.confirm(`Xóa cụm rạp "${cinema.name}"?`)) {
      return;
    }

    try {
      await deleteCinema.mutateAsync(cinema.id);
      notifications.show({
        color: 'green',
        title: 'Thành công',
        message: 'Đã xóa cụm rạp.',
      });
      setPage(1);
    } catch (error: unknown) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: error instanceof Error ? error.message : 'Không thể xóa cụm rạp.',
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full min-w-0">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 mb-8">
          <div className="min-w-0">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#dae2fd] mb-2">
              Quản lý cụm rạp
            </h1>
            <p className="text-[#c2c6d8] flex items-center gap-2 text-sm">
              <Home size={14} />
              <span>Hệ thống</span>
              <ChevronRight size={14} />
              <span className="text-[#b3c5ff]">Cụm rạp chiếu phim</span>
            </p>
          </div>

          <Button
            onClick={openCreate}
            leftSection={<Plus size={18} />}
            styles={{
              root: {
                background: '#0066ff',
                color: '#f8f7ff',
                borderRadius: 14,
                paddingInline: 18,
                height: 44,
                fontWeight: 800,
              },
            }}
          >
            Thêm cụm rạp
          </Button>
        </div>

        {/* Search */}
        <div className="bg-[#131b2e] p-6 rounded-xl mb-6">
          <TextInput
            placeholder="Tìm kiếm cụm rạp..."
            leftSection={<Search size={16} />}
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.currentTarget.value);
              setPage(1);
            }}
            styles={{
              input: {
                backgroundColor: '#060e20',
                border: 'none',
                color: '#dae2fd',
                minWidth: '300px',
              },
            }}
          />
        </div>

        {/* Table */}
        <div className="bg-[#131b2e] rounded-xl overflow-hidden">
          {cinemas.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-[#8c90a1]">Không tìm thấy cụm rạp nào</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#0a0f20]">
                    <tr className="border-b border-[#424656]/30">
                      <th className="px-6 py-4 text-left text-[#b3c5ff] font-semibold">
                        Tên cụm rạp
                      </th>
                      <th className="px-6 py-4 text-left text-[#b3c5ff] font-semibold">
                        Địa chỉ
                      </th>
                      <th className="px-6 py-4 text-left text-[#b3c5ff] font-semibold">
                        Số điện thoại
                      </th>
                      <th className="px-6 py-4 text-center text-[#b3c5ff] font-semibold">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#424656]/30">
                    {cinemas.map((cinema) => (
                      <tr key={cinema.id} className="hover:bg-[#1a2238] transition-colors">
                        <td className="px-6 py-4 text-[#dae2fd]">{cinema.name}</td>
                        <td className="px-6 py-4 text-[#b3c5ff]">{cinema.address}</td>
                        <td className="px-6 py-4 text-[#b3c5ff]">{cinema.hotline}</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => openEdit(cinema)}
                              className="p-2 hover:bg-[#0066ff]/20 rounded-lg transition-colors text-[#0066ff]"
                              title="Chỉnh sửa"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(cinema)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-500"
                              title="Xóa"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 flex justify-center border-t border-[#424656]/30">
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          page === i + 1
                            ? 'bg-[#0066ff] text-white font-bold'
                            : 'bg-[#0a0f20] text-[#b3c5ff] hover:bg-[#0066ff]/20'
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

      {/* Modal Form */}
      <Modal
        opened={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingCinema(null);
          setFormData({ name: '', address: '', hotline: '' });
        }}
        title={modalTitle}
        isDark={true}
      >
        <div className="space-y-4">
          <TextInput
            label="Tên cụm rạp"
            placeholder="VD: CGV Cinemas"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.currentTarget.value })}
            disabled={isSubmitting}
            styles={{
              input: {
                backgroundColor: '#060e20',
                border: 'none',
                color: '#dae2fd',
              },
              label: {
                color: '#b3c5ff',
              },
            }}
          />

          <TextInput
            label="Địa chỉ"
            placeholder="VD: 123 Main Street, District 1, HCMC"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.currentTarget.value })}
            disabled={isSubmitting}
            styles={{
              input: {
                backgroundColor: '#060e20',
                border: 'none',
                color: '#dae2fd',
              },
              label: {
                color: '#b3c5ff',
              },
            }}
          />

          <TextInput
            label="Số điện thoại"
            placeholder="VD: 0123456789"
            value={formData.hotline}
            onChange={(e) => setFormData({ ...formData, hotline: e.currentTarget.value })}
            disabled={isSubmitting}
            styles={{
              input: {
                backgroundColor: '#060e20',
                border: 'none',
                color: '#dae2fd',
              },
              label: {
                color: '#b3c5ff',
              },
            }}
          />

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              loading={isSubmitting}
              disabled={isSubmitting}
              styles={{
                root: {
                  background: '#0066ff',
                  color: '#f8f7ff',
                  borderRadius: 8,
                  fontWeight: 600,
                  flex: 1,
                },
              }}
            >
              {editingCinema ? 'Cập nhật' : 'Thêm mới'}
            </Button>
            <Button
              onClick={() => {
                setOpenModal(false);
                setEditingCinema(null);
                setFormData({ name: '', address: '', hotline: '' });
              }}
              disabled={isSubmitting}
              variant="default"
              styles={{
                root: {
                  background: '#424656',
                  color: '#f8f7ff',
                  borderRadius: 8,
                  fontWeight: 600,
                  flex: 1,
                },
              }}
            >
              Hủy
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

