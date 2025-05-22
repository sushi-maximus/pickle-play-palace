
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

  test('displays first name validation error when submitting empty form', async () => {
    const { user } = renderWithProviders(<SignupForm />);
    
    // Find and click the submit button directly by test-id
    const submitButton = screen.getByTestId('signup-button');
    await user.click(submitButton);
    
    // Wait for validation error to appear using test-id
    await waitFor(() => {
      const firstNameError = screen.getByTestId('firstName-error');
      expect(firstNameError).toHaveTextContent('First name is required');
    });
  });
});
