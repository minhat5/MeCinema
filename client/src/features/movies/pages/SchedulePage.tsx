import { useMemo, useState } from 'react';
import { Badge, Button, Container, Pagination, Select, TextInput } from '@mantine/core';
import { Calendar, MapPin, RotateCcw, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDebounce } from '../../../hooks/useDebounce';
import {
  useScheduleCinemas,
  useScheduleShowtimes,
  type ScheduleShowtimeItem,
} from '../hooks/useScheduleShowtimes';

const parseDate = (value: string) => new Date(value.replace(' ', 'T'));

const formatCurrency = (value: number) => `${value.toLocaleString('vi-VN')}đ`;

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'movie';

export default function SchedulePage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [cinemaFilter, setCinemaFilter] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchInput, 300);
  const debouncedDate = useDebounce(dateFilter, 300);

  const { data: response, isLoading } = useScheduleShowtimes({
    page,
    limit: 15,
    sortBy: 'startTime',
    sortDirection: 'asc',
  });
  const { data: cinemaOptions = [] } = useScheduleCinemas();

  const showtimes = response?.data?.data ?? [];
  const pagination = response?.data?.pagination;

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
      const byCinema = !cinemaFilter || st.cinemaId === cinemaFilter;
      return bySearch && byDate && byCinema;
    });
  }, [showtimes, debouncedSearch, debouncedDate, cinemaFilter]);

  const groupedByDate = useMemo(() => {
    return filteredShowtimes.reduce<Record<string, ScheduleShowtimeItem[]>>((groups, showtime) => {
      const key = parseDate(showtime.startTime).toISOString().slice(0, 10);
      if (!groups[key]) groups[key] = [];
      groups[key].push(showtime);
      return groups;
    }, {});
  }, [filteredShowtimes]);

  return (
    <div className="min-h-screen bg-white">
      <Container size="xl" className="py-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-blue-800 rounded-full" />
          <h1 className="text-2xl font-bold text-gray-900 uppercase">Lịch Chiếu</h1>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
          <div className="flex flex-wrap gap-3">
            <TextInput
              leftSection={<Search size={16} />}
              placeholder="Tìm theo phim, rạp, phòng..."
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.currentTarget.value);
                setPage(1);
              }}
              className="min-w-[260px]"
            />

            <TextInput
              type="date"
              leftSection={<Calendar size={16} />}
              value={dateFilter}
              onChange={(event) => {
                setDateFilter(event.currentTarget.value);
                setPage(1);
              }}
            />

            <Select
              leftSection={<MapPin size={16} />}
              placeholder="Tất cả rạp"
              data={cinemaOptions.map((cinema) => ({ value: cinema._id, label: cinema.name }))}
              value={cinemaFilter}
              onChange={(value) => {
                setCinemaFilter(value);
                setPage(1);
              }}
              searchable
              clearable
              className="min-w-[260px]"
            />

            <Button
              variant="light"
              leftSection={<RotateCcw size={16} />}
              onClick={() => {
                setPage(1);
                setSearchInput('');
                setDateFilter('');
                setCinemaFilter(null);
              }}
            >
              Đặt lại bộ lọc
            </Button>
          </div>

          <p className="text-sm text-gray-500">Hiển thị {filteredShowtimes.length} lịch chiếu</p>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-gray-500">Đang tải lịch chiếu...</div>
        ) : filteredShowtimes.length === 0 ? (
          <div className="py-16 text-center text-gray-500 border border-dashed border-gray-300 rounded-xl">
            Không tìm thấy lịch chiếu phù hợp
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByDate)
              .sort(([a], [b]) => (a > b ? 1 : -1))
              .map(([dateKey, items]) => (
                <section key={dateKey} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 bg-blue-50 text-blue-900 font-semibold">
                    {parseDate(dateKey).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </div>

                  <div className="divide-y divide-gray-100">
                    {items.map((st) => (
                      <div
                        key={st._id}
                        className="p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate">{st.movieTitle || 'N/A'}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {st.cinemaName || 'N/A'} - {st.roomName || 'N/A'}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <Badge color="blue" variant="light" size="lg">
                            {parseDate(st.startTime).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Badge>
                          <Badge color="gray" variant="light" size="lg">
                            Đến {parseDate(st.endTime).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Badge>
                          <Badge color="green" variant="light" size="lg">
                            {formatCurrency(st.basePrice)}
                          </Badge>
                          <Link
                            to={`/booking/${toSlug(st.movieTitle || st.movieId)}/${st._id}`}
                            className="inline-flex items-center justify-center px-4 h-9 rounded-lg bg-blue-700 text-white text-sm font-medium no-underline hover:bg-blue-800 transition-colors"
                          >
                            Đặt vé
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
          </div>
        )}

        {(pagination?.totalPages ?? 1) > 1 && (
          <div className="flex justify-center">
            <Pagination
              total={pagination?.totalPages ?? 1}
              value={page}
              onChange={setPage}
              color="blue"
              withEdges
            />
          </div>
        )}
      </Container>
    </div>
  );
}



