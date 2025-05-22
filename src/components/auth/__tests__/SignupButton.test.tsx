
import { describe, test, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import { SignupForm } from '../SignupForm';

// Mock react-router-dom's useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Simple mock for useAuth
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    signUp: vi.fn().mockResolvedValue({ error: null }),
    user: null,
  }),
}));

// Basic mock for react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: () => ({
    handleSubmit: (fn) => (e) => {
      e?.preventDefault?.();
      return fn({});
    },
    control: {},
    formState: { errors: {} },
    getValues: () => ({}),
  }),
  useFormContext: () => ({
    control: {},
    formState: { errors: {} },
    getValues: () => ({}),
  }),
}));

describe('SignupForm Button', () => {
  test('signup button is clickable', async () => {
    const { user } = renderWithProviders(<SignupForm />);
    
    // Find the signup button
    const signupButton = screen.getByRole('button', { name: /sign up/i });
    
    // Verify button exists and is clickable
    expect(signupButton).toBeInTheDocument();
    expect(signupButton).not.toBeDisabled();
    
    // Test button can be clicked
    await user.click(signupButton);
  });
});
