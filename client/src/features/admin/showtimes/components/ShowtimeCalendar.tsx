import { Button } from '@mantine/core';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ShowtimeItem } from '../hooks/useShowtimeCRUD';

interface ShowtimeCalendarProps {
  showtimes: ShowtimeItem[];
  onEdit: (showtime: ShowtimeItem) => void;
  onCancel: (id: string) => void;
}

const weekdayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const parseDate = (value: string) => new Date(value.replace(' ', 'T'));

const toDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export default function ShowtimeCalendar({ showtimes, onEdit, onCancel }: ShowtimeCalendarProps) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const monthLabel = cursor.toLocaleDateString('vi-VN', {
    month: 'long',
    year: 'numeric',
  });

  const calendarCells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const firstWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<{ date: Date | null; key: string }> = [];

    for (let i = 0; i < firstWeekday; i += 1) {
      cells.push({ date: null, key: `empty-head-${i}` });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      cells.push({ date, key: toDateKey(date) });
    }

    while (cells.length % 7 !== 0) {
      cells.push({ date: null, key: `empty-tail-${cells.length}` });
    }

    return cells;
  }, [cursor]);

  const showtimesByDate = useMemo(() => {
    const map = new Map<string, ShowtimeItem[]>();
    showtimes.forEach((showtime) => {
      const date = parseDate(showtime.startTime);
      if (Number.isNaN(date.getTime())) return;
      const key = toDateKey(date);
      const current = map.get(key) ?? [];
      current.push(showtime);
      map.set(key, current);
    });

    map.forEach((items, key) => {
      map.set(
        key,
        [...items].sort(
          (a, b) => parseDate(a.startTime).getTime() - parseDate(b.startTime).getTime(),
        ),
      );
    });

    return map;
  }, [showtimes]);

  return (
    <div className="bg-[#131b2e] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-[#424656]/30">
        <h3 className="text-[#dae2fd] text-lg font-bold capitalize">{monthLabel}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="subtle"
            color="gray"
            onClick={() => setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
            leftSection={<ChevronLeft size={16} />}
          >
            Tháng trước
          </Button>
          <Button
            variant="subtle"
            color="gray"
            onClick={() => setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
            rightSection={<ChevronRight size={16} />}
          >
            Tháng sau
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-[#424656]/30">
        {weekdayLabels.map((day) => (
          <div key={day} className="py-3 text-center text-xs font-bold text-[#8c90a1] uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {calendarCells.map((cell) => {
          if (!cell.date) {
            return <div key={cell.key} className="min-h-[120px] border border-[#424656]/20 bg-[#0d1527]" />;
          }

          const dateKey = toDateKey(cell.date);
          const dayShowtimes = showtimesByDate.get(dateKey) ?? [];

          return (
            <div key={cell.key} className="min-h-[120px] border border-[#424656]/20 p-2 align-top">
              <p className="text-xs text-[#c2c6d8] font-semibold mb-2">{cell.date.getDate()}</p>

              <div className="space-y-2">
                {dayShowtimes.slice(0, 3).map((showtime) => {
                  return (
                    <button
                      key={showtime._id}
                      onClick={() => onEdit(showtime)}
                      className="w-full text-left p-2 rounded-md bg-[#1a2440] hover:bg-[#213056] transition"
                    >
                      <p className="text-[11px] text-[#dae2fd] font-semibold truncate">{showtime.movieTitle || 'Suất chiếu'}</p>
                      <p className="text-[10px] text-[#8c90a1]">
                        {parseDate(showtime.startTime).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {showtime.roomName ? ` - ${showtime.roomName}` : ''}
                      </p>
                      <p className="text-[10px] text-[#4d9aff] mt-1">
                        {showtime.basePrice.toLocaleString('vi-VN')}đ
                      </p>
                    </button>
                  );
                })}

                {dayShowtimes.length > 3 && (
                  <p className="text-[10px] text-[#8c90a1]">+{dayShowtimes.length - 3} suất chiếu</p>
                )}

                {dayShowtimes.length > 0 && (
                  <button
                    onClick={() => {
                      onCancel(dayShowtimes[0]._id);
                    }}
                    className="text-[10px] text-red-300 hover:text-red-200"
                  >
                    Huỷ nhanh suất đầu ngày
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

