
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

  test('displays first name validation error when submitting empty form', async () => {
    console.log('Rendering SignupForm...');
    const { user } = renderWithProviders(<SignupForm />);
    
    // Log form elements to help debug
    console.log('Form elements:', 
      screen.queryByRole('button', { name: /Sign Up/i }) ? 'Sign Up button found' : 'Sign Up button not found'
    );
    
    // Submit the form without filling in any fields
    console.log('Clicking submit button...');
    await user.click(screen.getByRole('button', { name: /Sign Up/i }));
    
    // Wait for first name validation error to appear
    console.log('Waiting for first name validation error...');
    await waitFor(() => {
      const firstNameError = screen.queryByText(/First name is required/i);
      console.log('First name error found:', !!firstNameError);
      
      if (!firstNameError) throw new Error('First name error not found');
      expect(firstNameError).toBeInTheDocument();
    });
  });
});
