import { useQuery } from '@tanstack/react-query';
import { getMeApi } from '../services/auth.service';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const me = await getMeApi();
      if (!me) {
        throw new Error('Không lấy được thông tin người dùng');
      }
      return me;
    },
    enabled: !!localStorage.getItem('accessToken'),
    staleTime: 4 * 60 * 1000,
  });
}
