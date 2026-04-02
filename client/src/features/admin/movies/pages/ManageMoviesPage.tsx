import { useState } from 'react';
import { Button, TextInput, Select, Modal } from '@mantine/core';
import { Plus, Search, Home, ChevronRight } from 'lucide-react';
import { MovieForm, MovieTable, DeleteMovieDialog } from '../components';
import { useMovies, type Movie } from '../hooks';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { useDebounce } from '../../../../hooks/useDebounce';

export default function ManageMoviesPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);
  const [deletingMovie, setDeletingMovie] = useState<Movie | null>(null);

  const { data: moviesResponse, isLoading } = useMovies({
    page,
    limit: 10,
    search: debouncedSearch,
    status: statusFilter as any,
  });

  // API trả về: { success, data: { data: [...], pagination: {...} }, message }
  const moviesData = moviesResponse?.data;
  const movies = moviesData?.data || [];
  const total = moviesData?.pagination?.totalItems || moviesData?.pagination?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / 10));

  const handleEdit = (movie: Movie) => {
    setEditingMovieId(movie._id);
    setOpenFormModal(true);
  };

  const handleDelete = (movie: Movie) => {
    setDeletingMovie(movie);
  };

  const handleCloseFormModal = () => {
    setOpenFormModal(false);
    setEditingMovieId(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeletingMovie(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full min-w-0">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 mb-8">
          <div className="min-w-0">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#dae2fd] mb-2">
              Quản lý phim
            </h1>
            <p className="text-[#c2c6d8] flex items-center gap-2 text-sm">
              <Home size={14} />
              <span>Hệ thống</span>
              <ChevronRight size={14} />
              <span className="text-[#b3c5ff]">Danh sách phim</span>
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
            Thêm phim mới
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-[#131b2e] p-6 rounded-xl mb-6">
          <div className="flex gap-4 flex-wrap">
            <TextInput
              placeholder="Tìm kiếm phim..."
              leftSection={<Search size={16} />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.currentTarget.value)}
              styles={{
                input: {
                  backgroundColor: '#060e20',
                  border: 'none',
                  color: '#dae2fd',
                  minWidth: '300px',
                },
              }}
            />
            <Select
              placeholder="Trạng thái"
              clearable
              data={[
                { value: 'UPCOMING', label: 'Sắp chiếu' },
                { value: 'RELEASED', label: 'Đang chiếu' },
                { value: 'ENDED', label: 'Đã kết thúc' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              styles={{
                input: {
                  backgroundColor: '#060e20',
                  border: 'none',
                  color: '#dae2fd',
                  minWidth: '150px',
                },
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#131b2e] rounded-xl overflow-hidden">
          {movies.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-[#8c90a1]">Không tìm thấy phim nào</p>
            </div>
          ) : (
            <>
              <MovieTable
                movies={movies}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
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
        opened={openFormModal}
        onClose={handleCloseFormModal}
        title={editingMovieId ? 'Sửa phim' : 'Thêm phim mới'}
        size="xl"
        styles={{
          content: { backgroundColor: '#131b2e' },
          header: { backgroundColor: '#131b2e', color: '#dae2fd' },
          title: { fontWeight: 'bold', fontSize: '1.25rem' },
        }}
      >
        <MovieForm movieId={editingMovieId} onSuccess={handleCloseFormModal} />
      </Modal>

      <DeleteMovieDialog
        movie={deletingMovie}
        opened={!!deletingMovie}
        onClose={handleCloseDeleteDialog}
      />
    </div>
  );
}
