
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import { SignupForm } from '../SignupForm';
import { 
  mockSuccessfulSignup, 
  mockFailedSignup, 
  mockDelayedSignup,
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

// Temporarily skip all tests in this file
describe.skip('SignupForm', () => {
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
});
