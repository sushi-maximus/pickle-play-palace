
// Error handling utilities
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public recoverable = true
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const logError = (error: Error, context?: string) => {
  console.error(`[${context || 'App'}] Error:`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.toLowerCase().includes('network') ||
           error.message.toLowerCase().includes('fetch') ||
           error.message.toLowerCase().includes('connection');
  }
  return false;
};
