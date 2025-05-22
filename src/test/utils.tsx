
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider';
import userEvent from '@testing-library/user-event';
import { AuthContext } from '@/contexts/AuthContext';
import { vi } from 'vitest';

// Create a custom render function that includes all providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    authContextValue?: Partial<any>;
  }
) {
  const { authContextValue = {}, ...renderOptions } = options || {};
  
  // Create a fresh QueryClient for each test
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // Setup user event
  const user = userEvent.setup();
  
  // Create default auth context value
  const defaultAuthContext = {
    session: null,
    user: null,
    profile: null,
    isLoading: false,
    signOut: vi.fn().mockResolvedValue({}),
    signUp: vi.fn().mockResolvedValue({ error: null, data: { user: { id: 'mock-id' } } }),
    signIn: vi.fn().mockResolvedValue({ error: null, data: { user: { id: 'mock-id' } } }),
    resendVerificationEmail: vi.fn().mockResolvedValue({ error: null, data: {} }),
    refreshProfile: vi.fn().mockResolvedValue({}),
    ...authContextValue
  };
  
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light">
          <AuthContext.Provider value={defaultAuthContext}>
            <BrowserRouter>{children}</BrowserRouter>
          </AuthContext.Provider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }
  
  return {
    user,
    ...render(ui, {
      wrapper: Wrapper,
      ...renderOptions,
    }),
  };
}
