
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import { SignupForm } from '../SignupForm';
import { mockDelayedSignup, mockNavigate } from '../__mocks__/mockSignUp';

// Mock react-router-dom's useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('SignupForm Loading State', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('shows loading state during form submission', async () => {
    // Use the delayed mock to simulate loading
    const signUpMock = mockDelayedSignup;
    
    const { user } = renderWithProviders(<SignupForm />, {
      authContextValue: { signUp: signUpMock }
    });
    
    // Fill in required fields
    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john.doe@example.com');
    
    // Fill in passwords
    await user.type(screen.getByLabelText(/^Password/i), 'password123');
    await user.type(screen.getByLabelText(/Confirm Password/i), 'password123');
    
    // Check gender field
    const genderCombobox = screen.getByRole('combobox', { name: /gender/i });
    await user.click(genderCombobox);
    await user.click(screen.getByText('Male'));
    
    // Check skill level field
    const skillCombobox = screen.getByRole('combobox', { name: /skill level/i });
    await user.click(skillCombobox);
    await user.click(screen.getByText('3.0'));
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Check that loading state is shown
    expect(screen.getByText(/Creating account/i)).toBeInTheDocument();
    
    // Wait for the submission to complete
    await waitFor(() => {
      expect(screen.queryByText(/Creating account/i)).not.toBeInTheDocument();
    }, { timeout: 200 });
  });
});
