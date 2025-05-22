
import { vi } from 'vitest';

// Mock successful signup
export const mockSuccessfulSignup = vi.fn().mockResolvedValue({ 
  error: null, 
  data: { user: { id: 'test-user-id' } } 
});

// Mock failed signup
export const mockFailedSignup = vi.fn().mockResolvedValue({ 
  error: { message: 'Failed to create account. Please try again.' }, 
  data: null 
});

// Mock signup with email already in use
export const mockEmailInUseSignup = vi.fn().mockResolvedValue({ 
  error: { message: 'Email already in use' }, 
  data: null 
});

// Mock signup with server error
export const mockServerErrorSignup = vi.fn().mockResolvedValue({ 
  error: { message: 'An unexpected error occurred. Please try again.' }, 
  data: null 
});

// Mock navigate function
export const mockNavigate = vi.fn();
