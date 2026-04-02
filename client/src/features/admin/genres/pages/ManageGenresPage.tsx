import { useMemo, useState } from 'react';
import { Button, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Home, ChevronRight, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  useAdminGenres,
  useCreateGenre,
  useDeleteGenre,
  useUpdateGenre,
  type AdminGenre,
} from '../hooks/useGenres';

export default function ManageGenresPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [editingGenre, setEditingGenre] = useState<AdminGenre | null>(null);
  const [name, setName] = useState('');

  const limit = 10;
  const { data, isLoading } = useAdminGenres({
    page,
    limit,
    search: searchInput,
  });

  const createGenre = useCreateGenre();
  const updateGenre = useUpdateGenre();
  const deleteGenre = useDeleteGenre();

  const genres = data?.data ?? [];
  const totalPages = Math.max(1, data?.pagination.totalPages ?? 1);

  const isSubmitting = createGenre.isPending || updateGenre.isPending;

  const modalTitle = useMemo(
    () => (editingGenre ? 'Chỉnh sửa thể loại' : 'Thêm thể loại'),
    [editingGenre],
  );

  const openCreate = () => {
    setEditingGenre(null);
    setName('');
    setOpenModal(true);
  };

  const openEdit = (genre: AdminGenre) => {
    setEditingGenre(genre);
    setName(genre.name);
    setOpenModal(true);
  };

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      notifications.show({
        color: 'red',
        title: 'Thiếu thông tin',
        message: 'Vui lòng nhập tên thể loại.',
      });
      return;
    }

    try {
      if (editingGenre) {
        await updateGenre.mutateAsync({ id: editingGenre.id, name: trimmedName });
        notifications.show({
          color: 'green',
          title: 'Thành công',
          message: 'Đã cập nhật thể loại.',
        });
      } else {
        await createGenre.mutateAsync({ name: trimmedName });
        notifications.show({
          color: 'green',
          title: 'Thành công',
          message: 'Đã thêm thể loại mới.',
        });
      }
      setOpenModal(false);
      setEditingGenre(null);
      setName('');
    } catch (error: unknown) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: error instanceof Error ? error.message : 'Không thể lưu thể loại.',
      });
    }
  };

  const handleDelete = async (genre: AdminGenre) => {
    if (!window.confirm(`Xóa thể loại "${genre.name}"?`)) {
      return;
    }

    try {
      await deleteGenre.mutateAsync(genre.id);
      notifications.show({
        color: 'green',
        title: 'Thành công',
        message: 'Đã xóa thể loại.',
      });
    } catch (error: unknown) {
      notifications.show({
        color: 'red',
        title: 'Lỗi',
        message: error instanceof Error ? error.message : 'Không thể xóa thể loại.',
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
              Quản lý thể loại
            </h1>
            <p className="text-[#c2c6d8] flex items-center gap-2 text-sm">
              <Home size={14} />
              <span>Hệ thống</span>
              <ChevronRight size={14} />
              <span className="text-[#b3c5ff]">Thể loại phim</span>
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
            Thêm thể loại
          </Button>
        </div>

        <div className="bg-[#131b2e] p-5 rounded-xl mb-6">
          <TextInput
            placeholder="Tìm kiếm thể loại..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.currentTarget.value);
              setPage(1);
            }}
            leftSection={<Search size={16} />}
            styles={{
              input: {
                background: '#060e20',
                border: 'none',
                borderRadius: 999,
                color: '#dae2fd',
              },
              section: { color: '#8c90a1' },
            }}
          />
        </div>

        {genres.length === 0 ? (
          <EmptyState
            title="Không có thể loại"
            description="Hãy thêm thể loại mới để sử dụng trong quản lý phim"
          />
        ) : (
          <div className="bg-[#171f33] rounded-2xl overflow-hidden shadow-2xl w-full min-w-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#222a3d]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-[#8c90a1] uppercase tracking-wider">
                      Tên thể loại
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-[#8c90a1] uppercase tracking-wider text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#424656]/10">
                  {genres.map((genre) => (
                    <tr
                      key={genre.id}
                      className="hover:bg-[#2d3449] transition-colors"
                    >
                      <td className="px-6 py-4 text-[#dae2fd] font-medium">
                        {genre.name}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="xs"
                            variant="light"
                            color="gray"
                            leftSection={<Pencil size={12} />}
                            styles={{
                              root: {
                                backgroundColor: '#222a3d',
                                color: '#dae2fd',
                              },
                            }}
                            onClick={() => openEdit(genre)}
                          >
                            Sửa
                          </Button>
                          <Button
                            size="xs"
                            variant="light"
                            color="gray"
                            leftSection={<Trash2 size={12} />}
                            styles={{
                              root: {
                                backgroundColor: '#2d1f2a',
                                color: '#ffb4ac',
                              },
                            }}
                            onClick={() => void handleDelete(genre)}
                            disabled={deleteGenre.isPending}
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

            <div className="px-6 py-4 flex items-center justify-between border-t border-[#424656]/10 gap-4 flex-wrap">
              <span className="text-xs text-[#8c90a1] font-medium">
                Trang {page} / {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-lg bg-[#060e20] text-[#8c90a1] hover:text-[#dae2fd] disabled:opacity-50"
                  disabled={page <= 1}
                  title="Trang trước"
                >
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2 rounded-lg bg-[#060e20] text-[#8c90a1] hover:text-[#dae2fd] disabled:opacity-50"
                  disabled={page >= totalPages}
                  title="Trang sau"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        <Modal
          opened={openModal}
          onClose={() => setOpenModal(false)}
          title={modalTitle}
          showFooter
          confirmText={editingGenre ? 'Cập nhật' : 'Thêm mới'}
          onConfirm={() => void handleSave()}
          confirmLoading={isSubmitting}
        >
          <TextInput
            label="Tên thể loại"
            placeholder="Ví dụ: Hành động"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            styles={{
              label: { color: '#c2c6d8' },
              input: {
                backgroundColor: '#060e20',
                border: 'none',
                color: '#dae2fd',
              },
            }}
            required
          />
        </Modal>
      </div>
    </div>
  );
}

