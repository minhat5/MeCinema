import apiClient from '@/lib/api-client';
import type {
  AuthResponseData,
  LoginInput,
  RegisterInput,
  User,
} from '@shared/index';

function normalizeRole(rawRole: unknown): string {
  if (typeof rawRole === 'string') {
    return rawRole.replace(/^ROLE_/, '');
  }

  if (rawRole && typeof rawRole === 'object') {
    const maybeName = (rawRole as { name?: unknown }).name;
    if (typeof maybeName === 'string') {
      return maybeName.replace(/^ROLE_/, '');
    }
  }

  return '';
}

function normalizeUser(raw: User): User {
  return {
    ...raw,
    role: normalizeRole((raw as User & { role?: unknown }).role),
  };
}

export const loginApi = (
  data: LoginInput,
): Promise<AuthResponseData | undefined> =>
  apiClient.post('/auth/login', data);

export const registerApi = (
  data: RegisterInput,
): Promise<AuthResponseData | undefined> =>
  apiClient.post('/auth/register', data);

export const getMeApi = (): Promise<User> =>
  apiClient.get('/user/me').then((response: unknown) => {
    const rawUser =
      response && typeof response === 'object' && 'data' in response
        ? (response as { data: unknown }).data
        : response;

    if (!rawUser || typeof rawUser !== 'object') {
      throw new Error('Dữ liệu người dùng không hợp lệ');
    }

    return normalizeUser(rawUser as User);
  });

export const updateMeApi = (
  data: Partial<Pick<User, 'fullName' | 'phone' | 'avatar'>>,
): Promise<User> =>
  getMeApi().then((me) => {
    const id = me?.id;
    if (!id) {
      throw new Error('Không tìm thấy thông tin người dùng hiện tại');
    }

    return apiClient.put(`/user/${id}`, {
      fullName: data.fullName ?? me.fullName,
      phone: data.phone ?? me.phone,
    });
  });
