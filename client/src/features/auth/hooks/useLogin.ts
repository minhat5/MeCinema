import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { getMeApi, loginApi } from '../services/auth.service';
import type { ApiResponse, LoginInput } from '@shared/index';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await loginApi(data);
      const token = ((res as any)?.data?.token ?? (res as any)?.token) as string | undefined;
      localStorage.setItem('accessToken', token && token.length > 0 ? token : 'COOKIE_AUTH');

      const user = await getMeApi();
      return {
        token,
        user,
      };
    },
    onSuccess: (res) => {
      queryClient.setQueryData(['me'], res.user);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      notifications.show({
        title: 'Thành công',
        message: 'Đăng nhập thành công',
        color: 'green',
      });
    },
    onError: (error: ApiResponse<null>) => {
      notifications.show({
        title: 'Thất bại',
        message: error.message || 'Có lỗi hệ thống',
        color: 'red',
      });
    },
  });
}
