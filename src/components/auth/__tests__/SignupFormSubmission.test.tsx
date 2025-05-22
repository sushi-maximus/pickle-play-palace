
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import { SignupForm } from '../SignupForm';
import { 
  mockSuccessfulSignup, 
  mockFailedSignup, 
  mockNavigate 
} from '../__mocks__/mockSignUp';

// Mock react-router-dom's useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('SignupForm Submission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('submits form with valid data successfully', async () => {
    const signUpMock = mockSuccessfulSignup;
    
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
    
    // Accept terms
    const termsCheckbox = screen.getByRole('checkbox');
    await user.click(termsCheckbox);
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Check that signUp was called with correct arguments
    await waitFor(() => {
      expect(signUpMock).toHaveBeenCalledWith(
        'john.doe@example.com',
        'password123',
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          gender: 'Male',
          skillLevel: '3.0'
        })
      );
    });
    
    // Check that navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('displays error message when signup fails', async () => {
    const signUpMock = mockFailedSignup;
    
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
    
    // Accept terms
    const termsCheckbox = screen.getByRole('checkbox');
    await user.click(termsCheckbox);
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to create account/i)).toBeInTheDocument();
    });
    
    // Check that navigation did NOT occur
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
