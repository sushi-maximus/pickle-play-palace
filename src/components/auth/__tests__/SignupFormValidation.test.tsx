
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
    console.log('Starting test...');
  });

  test('displays validation errors when submitting empty form', async () => {
    console.log('Rendering SignupForm...');
    const { user } = renderWithProviders(<SignupForm />);
    
    // Log form elements to help debug
    console.log('Form elements:', 
      screen.queryByRole('button', { name: /Sign Up/i }) ? 'Sign Up button found' : 'Sign Up button not found'
    );
    
    // Submit the form without filling in any fields
    console.log('Clicking submit button...');
    await user.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Wait for validation errors to appear
    console.log('Waiting for validation errors...');
    await waitFor(() => {
      // Check each validation message individually and log what's found
      const firstNameError = screen.queryByText(/First name is required/i);
      const lastNameError = screen.queryByText(/Last name is required/i);
      const emailError = screen.queryByText(/Please enter a valid email address/i);
      const passwordError = screen.queryByText(/Password must be at least 8 characters/i);
      const termsError = screen.queryByText(/You must agree to the terms and privacy policy/i);
      const genderError = screen.queryByText(/Please select your gender/i);
      const skillLevelError = screen.queryByText(/Please select your skill level/i);
      
      console.log('Validation errors found:', {
        firstNameError: !!firstNameError,
        lastNameError: !!lastNameError,
        emailError: !!emailError,
        passwordError: !!passwordError,
        termsError: !!termsError,
        genderError: !!genderError,
        skillLevelError: !!skillLevelError
      });
      
      // Testing each error individually to see which one fails
      if (!firstNameError) throw new Error('First name error not found');
      expect(firstNameError).toBeInTheDocument();
      
      if (!lastNameError) throw new Error('Last name error not found');
      expect(lastNameError).toBeInTheDocument();
      
      if (!emailError) throw new Error('Email error not found');
      expect(emailError).toBeInTheDocument();
      
      if (!passwordError) throw new Error('Password error not found');
      expect(passwordError).toBeInTheDocument();
      
      if (!termsError) throw new Error('Terms error not found');
      expect(termsError).toBeInTheDocument();
      
      if (!genderError) throw new Error('Gender error not found');
      expect(genderError).toBeInTheDocument();
      
      if (!skillLevelError) throw new Error('Skill level error not found');
      expect(skillLevelError).toBeInTheDocument();
    });
  });

  /* Commenting out other tests to focus on one test at a time */
});
