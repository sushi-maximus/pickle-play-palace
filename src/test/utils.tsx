
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Mock auth context values
const defaultAuthContextValue = {
  session: null,
  user: null,
  profile: null,
  isLoading: false,
  signOut: vi.fn().mockResolvedValue(undefined),
  signUp: vi.fn().mockResolvedValue({ error: null, data: {} }),
  signIn: vi.fn().mockResolvedValue({ error: null, data: {} }),
  resendVerificationEmail: vi.fn().mockResolvedValue({ error: null, data: {} }),
  refreshProfile: vi.fn().mockResolvedValue(undefined),
};

// Setup providers wrapper for testing
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  authContextValue?: Partial<typeof defaultAuthContextValue>;
  route?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    authContextValue = {},
    route = '/',
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  // Set up browser router with specified route
  window.history.pushState({}, 'Test page', route);

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <AuthContext.Provider value={{ ...defaultAuthContextValue, ...authContextValue }}>
        <BrowserRouter>{children}</BrowserRouter>
      </AuthContext.Provider>
    );
  };

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Re-export everything from testing-library
export * from '@testing-library/react';
