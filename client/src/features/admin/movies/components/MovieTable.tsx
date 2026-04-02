import { Badge, Image, ActionIcon, Text } from '@mantine/core';
import { Pencil, Trash2 } from 'lucide-react';
import type { Movie } from '../hooks';

interface MovieTableProps {
  movies: Movie[];
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
}

const STATUS_COLORS: Record<string, string> = {
  UPCOMING: 'blue',
  RELEASED: 'green',
  ENDED: 'gray',
};

const STATUS_LABELS: Record<string, string> = {
  UPCOMING: 'Sắp chiếu',
  RELEASED: 'Đang chiếu',
  ENDED: 'Đã kết thúc',
};

export default function MovieTable({
  movies,
  onEdit,
  onDelete,
}: MovieTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#060e20] text-[#8c90a1] text-xs uppercase tracking-wider">
            <th className="px-4 py-3 text-left font-bold">Poster</th>
            <th className="px-4 py-3 text-left font-bold">Tên phim</th>
            <th className="px-4 py-3 text-left font-bold">Thể loại</th>
            <th className="px-4 py-3 text-left font-bold">Trạng thái</th>
            <th className="px-4 py-3 text-left font-bold">Thời lượng</th>
            <th className="px-4 py-3 text-left font-bold">Ngày khởi chiếu</th>
            <th className="px-4 py-3 text-left font-bold">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie, index) => (
            <tr
              key={movie._id}
              className={`border-b border-[#424656]/30 hover:bg-[#171f33] transition-colors ${
                index % 2 === 0 ? 'bg-[#131b2e]' : 'bg-[#0f1623]'
              }`}
            >
              <td className="px-4 py-3">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  w={60}
                  h={80}
                  fit="cover"
                  radius="sm"
                />
              </td>
              <td className="px-4 py-3">
                <Text fw={500} c="#dae2fd">
                  {movie.title}
                </Text>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1 flex-wrap">
                  {movie.genres.slice(0, 2).map((genre) => (
                    <Badge key={genre._id} size="sm" variant="light">
                      {genre.name}
                    </Badge>
                  ))}
                  {movie.genres.length > 2 && (
                    <Text size="xs" c="#8c90a1">
                      +{movie.genres.length - 2}
                    </Text>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge color={STATUS_COLORS[movie.status]} variant="filled">
                  {STATUS_LABELS[movie.status]}
                </Badge>
              </td>
              <td className="px-4 py-3 text-[#dae2fd]">
                {movie.duration} phút
              </td>
              <td className="px-4 py-3 text-[#dae2fd]">
                {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <ActionIcon
                    variant="light"
                    color="blue"
                    onClick={() => onEdit(movie)}
                  >
                    <Pencil size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => onDelete(movie)}
                  >
                    <Trash2 size={16} />
                  </ActionIcon>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
