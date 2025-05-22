
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
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

describe('SignupForm Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('displays validation errors when submitting empty form', async () => {
    const { user } = renderWithProviders(<SignupForm />);
    
    // Submit the form without filling in any fields
    await user.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Wait for validation errors to appear
    await waitFor(() => {
      expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/You must agree to the terms and privacy policy/i)).toBeInTheDocument();
      expect(screen.getByText(/Please select your gender/i)).toBeInTheDocument();
      expect(screen.getByText(/Please select your skill level/i)).toBeInTheDocument();
    });
  });

  test('validates matching passwords', async () => {
    const { user } = renderWithProviders(<SignupForm />);
    
    // Fill in required fields except passwords
    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john.doe@example.com');
    
    // Enter mismatched passwords
    await user.type(screen.getByLabelText(/^Password/i), 'password123');
    await user.type(screen.getByLabelText(/Confirm Password/i), 'password456');
    
    // Accept terms
    const termsCheckbox = screen.getByRole('checkbox');
    await user.click(termsCheckbox);
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Check for password mismatch error
    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });
});
