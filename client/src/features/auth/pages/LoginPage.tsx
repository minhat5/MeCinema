import {
  Anchor,
  Container,
  Paper,
  Text,
  Title,
  Stack,
  Group,
  Center,
  Box,
} from '@mantine/core';
import { LoginForm } from '../components/LoginForm';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';
import { ROLES } from '@shared/constants/roles';
import type { AuthResponseData } from '@shared/index';

const normalizeRole = (rawRole: unknown): string => {
  if (typeof rawRole === 'string') {
    return rawRole.replace(/^ROLE_/, '');
  }

  if (rawRole && typeof rawRole === 'object') {
    const name = (rawRole as { name?: unknown }).name;
    if (typeof name === 'string') {
      return name.replace(/^ROLE_/, '');
    }
  }

  return '';
};

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const fromState = location.state?.from;
  const fromPath =
    typeof fromState === 'string'
      ? fromState
      : typeof fromState?.pathname === 'string'
        ? `${fromState.pathname}${fromState.search ?? ''}${fromState.hash ?? ''}`
        : '/';

  const handleLoginSuccess = (response?: AuthResponseData) => {
    const role = normalizeRole(response?.user?.role);
    const isAdmin = role === ROLES.ADMIN;
    const shouldUseDefaultAdminPath = !fromPath || fromPath === '/' || fromPath === '/login';

    if (isAdmin && shouldUseDefaultAdminPath) {
      navigate('/admin/cinemas', { replace: true });
      return;
    }

    navigate(fromPath || '/', { replace: true });
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '40%',
          height: '40%',
          background:
            'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />
      <Box
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '40%',
          height: '40%',
          background:
            'radial-gradient(circle, rgba(225, 29, 72, 0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />

      <Container
        size="xs"
        style={{ position: 'relative', zIndex: 1, width: '100%' }}
      >
        <Stack gap="xl">
          <Center>
            <Group gap="xs">
              <Film size={32} color="#e11d48" />
              <Title order={2} fw={900} lts={-1} c="white">
                MICINEMA
              </Title>
            </Group>
          </Center>

          <Paper
            radius="lg"
            p={40}
            withBorder
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.7)',
              backdropFilter: 'blur(12px)',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            <Stack gap="xs" mb={30}>
              <Title order={2} fw={800} c="white">
                Đăng nhập
              </Title>
              <Text c="gray.4" size="sm">
                Chào mừng trở lại! Vui lòng nhập thông tin của bạn.
              </Text>
            </Stack>

            <LoginForm onSuccess={handleLoginSuccess} />

            <Box
              mt={30}
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: 20,
              }}
            >
              <Group justify="center" gap={5}>
                <Text size="sm" c="gray.5">
                  Chưa có tài khoản?
                </Text>
                <Anchor
                  component={Link}
                  to="/register"
                  size="sm"
                  fw={600}
                  c="red.6"
                  style={{ transition: 'all 0.2s ease' }}
                >
                  Đăng ký ngay
                </Anchor>
              </Group>
            </Box>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
