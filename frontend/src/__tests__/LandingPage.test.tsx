import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AxiosResponse } from 'axios';
import LandingPage from '../pages/LandingPage';
import { authAPI } from '../services/api';

// Mock API
vi.mock('../services/api');
const mockAuthAPI = vi.mocked(authAPI);

describe('LandingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Sistema NPS para IPB/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Usuário')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
  });

  it('opens register modal', async () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    // Click the register button that is inside the login panel (scoped)
    const loginHeading = screen.getByRole('heading', { name: /Entrar/i });
    const loginPanel = loginHeading.closest('div');
    const registerButton = within(loginPanel as HTMLElement).getByRole('button', { name: /Registrar Admin/i });
    fireEvent.click(registerButton);
    // Buscar o diálogo/modal e o título dentro dele
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText(/Registrar Administrador|Registrar Admin/i)).toBeInTheDocument();
  });

  it('handles login success', async () => {
    const resp: AxiosResponse = {
      data: { token: 'fake-token', user: { id: 1, username: 'admin' } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} as any },
    };
    mockAuthAPI.login.mockResolvedValue(resp);

    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Usuário'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'password' } });
    // Scope to the login panel to click the correct Entrar button (avoid header/login duplicates)
    const loginHeading = screen.getByRole('heading', { name: /Entrar/i });
    // Find the container for the login form (closest parent Paper box)
    const loginPanel = loginHeading.closest('div');
    expect(loginPanel).toBeTruthy();
    const loginButton = within(loginPanel as HTMLElement).getByRole('button', { name: /Entrar/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockAuthAPI.login).toHaveBeenCalledWith('admin', 'password');
    });
  });
});
