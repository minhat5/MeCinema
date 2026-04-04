import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';

interface Genre {
  _id: string;
  name: string;
  slug: string;
}

/**
 * Hook: Lấy danh sách thể loại phim
 */
export const useGenres = () => {
  return useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      const size = 10;
      let page = 0;
      let totalPages = 1;
      const rows: any[] = [];

      do {
        const result = await apiClient.get('/genres', {
          params: { page, size },
        });
        const content = Array.isArray((result as any)?.content)
          ? (result as any).content
          : Array.isArray((result as any)?.data)
            ? (result as any).data
            : [];

        rows.push(...content);

        const serverTotalPages = Number((result as any)?.totalPages ?? 1);
        totalPages =
          Number.isFinite(serverTotalPages) && serverTotalPages > 0
            ? serverTotalPages
            : 1;
        page += 1;
      } while (page < totalPages);

      return rows.map((g: any) => ({
        _id: String(g?.id ?? g?._id ?? ''),
        name: g?.name ?? '',
        slug: g?.slug ?? String(g?.id ?? g?._id ?? ''),
      }));
    },
  });
};
export type { Genre };
