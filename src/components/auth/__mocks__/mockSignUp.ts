
import { vi } from 'vitest';

// Mock successful signup
export const mockSuccessfulSignup = vi.fn().mockResolvedValue({
  error: null,
  data: { user: { id: 'test-user-id' } }
});

// Mock failed signup
export const mockFailedSignup = vi.fn().mockResolvedValue({
  error: { message: 'Failed to create account' },
  data: null
});

// Mock navigate function
export const mockNavigate = vi.fn();
