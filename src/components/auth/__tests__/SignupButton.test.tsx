
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignupForm } from '../SignupForm';

// Mock all imports and provide the simplest implementations
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => vi.fn(),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    signUp: vi.fn().mockResolvedValue({ error: null }),
    user: null,
  }),
}));

vi.mock('react-hook-form', () => ({
  useForm: () => ({
    handleSubmit: (fn) => (e) => {
      e?.preventDefault?.();
      return fn({});
    },
    control: {},
    formState: { errors: {} },
    getValues: () => ({}),
    register: () => ({}),
  }),
  FormProvider: ({ children }) => <>{children}</>,
  useFormContext: () => ({
    control: {},
    formState: { errors: {} },
    getValues: () => ({}),
    register: () => ({}),
  }),
}));

// Mock the form sections to simplify the test
vi.mock('../form-sections/PersonalInfoFields', () => ({
  PersonalInfoFields: () => <div>Personal Info Fields</div>,
}));

vi.mock('../form-sections/PasswordFields', () => ({
  PasswordFields: () => <div>Password Fields</div>,
}));

vi.mock('../form-sections/TermsAndPolicy', () => ({
  TermsAndPolicy: () => <div>Terms And Policy</div>,
}));

// Mock the card components to simplify the DOM
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }) => <div className={className}>{children}</div>,
  CardHeader: ({ children }) => <div>{children}</div>,
  CardContent: ({ children }) => <div>{children}</div>,
  CardFooter: ({ children }) => <div>{children}</div>,
  CardTitle: ({ children }) => <div>{children}</div>,
  CardDescription: ({ children }) => <div>{children}</div>,
}));

vi.mock('@/components/ui/form', () => ({
  Form: ({ children }) => <>{children}</>,
  FormField: ({ control, name, render }) => render({ field: { value: '', onChange: vi.fn() } }),
  useFormField: () => ({ formItemId: 'test' }),
}));

describe('SignupForm Button', () => {
  test('signup button is clickable', async () => {
    // Set up userEvent
    const user = userEvent.setup();
    
    // Render the component
    render(<SignupForm />);
    
    // Find the signup button by its text content
    const signupButton = screen.getByText(/sign up/i);
    
    // Verify button exists and is not disabled
    expect(signupButton).toBeInTheDocument();
    expect(signupButton).not.toBeDisabled();
    
    // Click the button
    await user.click(signupButton);
  });
});
