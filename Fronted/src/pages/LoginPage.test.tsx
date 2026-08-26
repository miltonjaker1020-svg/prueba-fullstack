import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { LoginPage } from './LoginPage';

const mockLogin = vi.fn();
const mockMe = vi.fn().mockResolvedValue(null);

vi.mock('../services/auth.service', () => ({
  authService: {
    get login() {
      return mockLogin;
    },
    get me() {
      return mockMe;
    },
    register: vi.fn(),
    logout: vi.fn().mockResolvedValue(undefined),
  },
}));

function renderLoginPage(initialEntries: string[] = ['/login']): ReturnType<typeof render> {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mockLogin.mockReset();
  mockMe.mockReset();
  mockMe.mockResolvedValue(null);
});

describe('LoginPage — Integración', () => {
  it('muestra error del servidor cuando las credenciales son inválidas', async () => {
    const user = userEvent.setup();

    const axiosError = {
      isAxiosError: true,
      name: 'AxiosError',
      message: 'Request failed with status code 401',
      response: {
        status: 401,
        data: { statusCode: 401, message: 'Credenciales inválidas', error: 'Unauthorized' },
      },
      config: { url: '/auth/login' },
      toJSON: () => ({}),
    };

    mockLogin.mockRejectedValueOnce(axiosError);

    renderLoginPage();

    await user.type(screen.getByLabelText(/correo/i), 'bad@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    const error = await screen.findByRole('alert');
    expect(error.textContent).toContain('Credenciales inválidas');
    expect(mockLogin).toHaveBeenCalledOnce();
    expect(mockLogin).toHaveBeenCalledWith({ email: 'bad@example.com', password: 'wrongpass' });
  });

  it('muestra mensaje de red cuando el backend está caído', async () => {
    const user = userEvent.setup();

    mockLogin.mockRejectedValueOnce(new Error('Network Error'));

    renderLoginPage();

    await user.type(screen.getByLabelText(/correo/i), 'test@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), '123456');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    const error = await screen.findByRole('alert');
    expect(error.textContent).toContain('error inesperado');
  });
});
