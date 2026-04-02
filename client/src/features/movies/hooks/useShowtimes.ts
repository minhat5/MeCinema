import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../lib/api-client';

export interface ShowtimeFilter {
  movieId: string;
  cinemaId?: string;
}

const mapShowtimesByDate = (rawData: any[]) => {
  if (!Array.isArray(rawData)) return [];
  
  const groups: Record<string, any[]> = {};
  
  rawData.forEach(st => {
    // st.startTime từ backend format "yyyy-MM-dd HH:mm:ss"
    // Ta cần chuyển thành yyyy-MM-dd để group
    const dt = st.startTime || '';
    const dateStr = dt.split(' ')[0] || dt.split('T')[0]; // fallback T
    
    // Map data sang format frontend mong muốn (để ko sửa nhiều bên UI)
    const mappedSt = {
      _id: String(st.id),
      cinemaId: {
        _id: String(st.cinemaId),
        name: st.cinemaName || 'Rạp',
        city: 'Toàn quốc', 
      },
      roomId: {
        _id: String(st.roomId),
        name: st.roomName || 'Phòng chiếu',
        roomType: '2D' // default if missing
      },
      // Đổi khoảng trắng thành 'T' để new Date(st.startTime) parse chuẩn trên JS
      startTime: dt.replace(' ', 'T') 
    };
    
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(mappedSt);
  });

  // Trả về dạng [{ date: '2026-04-02', showtimes: [...] }, ...]
  return Object.keys(groups).map((date) => ({
    date,
    showtimes: groups[date]
  }));
};

export const useShowtimes = ({ movieId, cinemaId }: ShowtimeFilter) =>
  useQuery({
	queryKey: ['showtimes', 'movie', movieId, cinemaId],
	queryFn: async () => {
	  const response: any = await apiClient.get(`/showtimes/movie/${movieId}`, {
		params: cinemaId ? { cinemaId } : {},
	  });
	  // Wrap mapped data in an object with 'data' key expected by existing frontend logic
	  return { data: mapShowtimesByDate(response.data) };
	},
	enabled: !!movieId,
	staleTime: 2 * 60 * 1000,
  });
