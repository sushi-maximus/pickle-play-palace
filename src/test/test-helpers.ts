
import { vi } from 'vitest';

// Mock for localStorage
export const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

// Set up window.localStorage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock for window.scrollTo
window.scrollTo = vi.fn();

// Mock console methods to avoid cluttering test output
console.error = vi.fn();
console.warn = vi.fn();
console.log = vi.fn();
