
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
  options?: {
    preloadedState?: any;
    route?: string;
    authContextValue?: Partial<React.ComponentProps<typeof AuthContext.Provider>['value']>;
    renderOptions?: Omit<RenderOptions, 'wrapper'>;
  }
) {
  const {
    preloadedState = {},
    route = '/',
    authContextValue = {},
    renderOptions = {}
  } = options || {};

  // Create a new query client for each test
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // Set up window location for routing tests
  window.history.pushState({}, 'Test page', route);

  // Default mock for auth context
  const defaultAuthContext = {
    session: null,
    user: null,
    profile: null,
    isLoading: false,
    signOut: vi.fn().mockResolvedValue({}),
    signUp: vi.fn().mockResolvedValue({ error: null, data: null }),
    signIn: vi.fn().mockResolvedValue({ error: null, data: null }),
    resendVerificationEmail: vi.fn().mockResolvedValue({ error: null, data: null }),
    refreshProfile: vi.fn().mockResolvedValue({}),
    ...authContextValue,
  };

  // Set up user-event
  const user = userEvent.setup();

  // Render with all providers
  const renderResult = render(
    <AuthContext.Provider value={defaultAuthContext}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>{ui}</ThemeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </AuthContext.Provider>,
    renderOptions
  );

  return {
    ...renderResult,
    user,
    queryClient,
  };
}
