import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { loginApi } from '../services/auth.service';
import type { ApiResponse, LoginInput } from '@shared/index';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginInput) => loginApi(data),
    onSuccess: (res) => {
      const token = (res as any)?.data?.token as string | undefined;
      localStorage.setItem('accessToken', token && token.length > 0 ? token : 'COOKIE_AUTH');
      queryClient.invalidateQueries({ queryKey: ['me'] });
      notifications.show({
        title: 'Thành công',
        message: (res as any)?.message || 'Đăng nhập thành công',
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
