
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Test from '../Test';

describe('Test Button', () => {
  test('test button is clickable', async () => {
    // Set up userEvent
    const user = userEvent.setup();
    
    // Mock console.log to verify it's called
    const consoleSpy = vi.spyOn(console, 'log');
    
    // Render the component
    render(<Test />);
    
    // Find the button by test ID
    const testButton = screen.getByTestId("test-button");
    
    // Verify button exists and is not disabled
    expect(testButton).toBeInTheDocument();
    expect(testButton).not.toBeDisabled();
    
    // Click the button
    await user.click(testButton);
    
    // Verify console.log was called
    expect(consoleSpy).toHaveBeenCalledWith('Button clicked!');
  });
});
