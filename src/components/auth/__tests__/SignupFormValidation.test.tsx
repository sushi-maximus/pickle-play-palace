
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import { SignupForm } from '../SignupForm';
import { mockNavigate } from '../__mocks__/mockSignUp';

// Mock react-router-dom's useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock form submission
const mockOnSubmit = vi.fn();
vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual('react-hook-form');
  return {
    ...actual,
    useForm: () => ({
      ...actual.useForm(),
      handleSubmit: () => (fn: any) => mockOnSubmit,
    }),
  };
});

describe('SignupForm Button', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSubmit.mockClear();
  });

  test('sign up button is clickable', async () => {
    const { user } = renderWithProviders(<SignupForm />);
    
    // Find the signup button
    const signupButton = screen.getByTestId('signup-button');
    
    // Verify button exists
    expect(signupButton).toBeInTheDocument();
    
    // Verify button is not disabled
    expect(signupButton).not.toBeDisabled();
    
    // Test that button can be clicked
    await user.click(signupButton);
    
    // No assertions on form validation - just testing the button works
  });
});
