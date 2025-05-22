
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import userEvent from '@testing-library/user-event';

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
  
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light">
          <AuthProvider overrideValues={authContextValue}>
            <BrowserRouter>{children}</BrowserRouter>
          </AuthProvider>
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
