
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

describe('SignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders all form elements correctly', () => {
    renderWithProviders(<SignupForm />);
    
    // Check for heading
    expect(screen.getByText('Create an account')).toBeInTheDocument();
    
    // Check for personal info fields
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    
    // Check for selects
    expect(screen.getByText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByText(/Skill Level/i)).toBeInTheDocument();
    
    // Check for password fields
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    
    // Check for terms and policy
    expect(screen.getByText(/agree to our terms/i)).toBeInTheDocument();
    
    // Check for submit button
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    
    // Check for login link
    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Log In/i })).toBeInTheDocument();
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
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Check for password mismatch error
    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
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
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to create account/i)).toBeInTheDocument();
    });
    
    // Check that navigation did NOT occur
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('shows loading state during form submission', async () => {
    // Create a delayed mock to simulate loading
    const delayedMock = vi.fn().mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ error: null, data: { user: { id: 'test-user-id' } } });
        }, 100);
      });
    });
    
    const { user } = renderWithProviders(<SignupForm />, {
      authContextValue: { signUp: delayedMock }
    });
    
    // Fill in required fields
    await user.type(screen.getByLabelText(/First Name/i), 'John');
    await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john.doe@example.com');
    
    // Fill in passwords
    await user.type(screen.getByLabelText(/^Password/i), 'password123');
    await user.type(screen.getByLabelText(/Confirm Password/i), 'password123');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Check that loading state is shown
    expect(screen.getByText(/Creating account/i)).toBeInTheDocument();
    
    // Wait for the submission to complete
    await waitFor(() => {
      expect(screen.queryByText(/Creating account/i)).not.toBeInTheDocument();
    });
  });
});
