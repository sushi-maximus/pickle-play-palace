
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

  test('displays terms validation error when submitting empty form', async () => {
    console.log('Rendering SignupForm...');
    const { user } = renderWithProviders(<SignupForm />);
    
    // Log form elements to help debug
    console.log('Form elements:', 
      screen.queryByRole('button', { name: /Sign Up/i }) ? 'Sign Up button found' : 'Sign Up button not found'
    );
    
    // Submit the form without filling in any fields
    console.log('Clicking submit button...');
    await user.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Wait for validation errors to appear and only check terms error
    console.log('Waiting for terms validation error...');
    await waitFor(() => {
      const termsError = screen.queryByText(/You must agree to the terms and privacy policy/i);
      console.log('Terms error found:', !!termsError);
      
      if (!termsError) throw new Error('Terms error not found');
      expect(termsError).toBeInTheDocument();
    });
  });
});
