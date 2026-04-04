import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { getMeApi, loginApi } from '../services/auth.service';
import type { LoginInput } from '@shared/index';

const resolveLoginErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.';
};

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
    onError: (error: unknown) => {
      notifications.show({
        title: 'Đăng nhập không thành công',
        message: resolveLoginErrorMessage(error),
        color: 'red',
      });
    },
  });
}
