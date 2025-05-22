
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthContext } from '@/contexts/AuthContext';
import userEvent from '@testing-library/user-event';

// Define default mock values for AuthContext
const defaultAuthContextValue = {
  session: null,
  user: null,
  profile: null,
  isLoading: false,
  signOut: vi.fn().mockResolvedValue({}),
  signUp: vi.fn().mockResolvedValue({ error: null, data: null }),
  signIn: vi.fn().mockResolvedValue({ error: null, data: null }),
  resendVerificationEmail: vi.fn().mockResolvedValue({ error: null, data: null }),
  refreshProfile: vi.fn().mockResolvedValue({}),
};

// Extended render options
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  authContextValue?: Partial<typeof defaultAuthContextValue>;
  route?: string;
}

// Custom render function that includes providers
export function renderWithProviders(
  ui: ReactElement,
  {
    authContextValue = {},
    route = '/',
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  // Set up window location
  window.history.pushState({}, 'Test page', route);

  // Merge default auth context values with any overrides
  const mergedAuthContextValue = {
    ...defaultAuthContextValue,
    ...authContextValue,
  };

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter>
        <ThemeProvider>
          <AuthContext.Provider value={mergedAuthContextValue}>
            {children}
          </AuthContext.Provider>
        </ThemeProvider>
      </BrowserRouter>
    );
  }

  // Setup user event
  const user = userEvent.setup();

  return {
    user,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
