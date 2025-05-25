
import { useState, useCallback } from 'react';

interface UseTouchFeedbackOptions {
  feedbackDuration?: number;
}

export const useTouchFeedback = (options: UseTouchFeedbackOptions = {}) => {
  const { feedbackDuration = 150 } = options;
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = useCallback(() => {
    setIsPressed(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setTimeout(() => setIsPressed(false), feedbackDuration);
  }, [feedbackDuration]);

  const handleMouseDown = useCallback(() => {
    setIsPressed(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setTimeout(() => setIsPressed(false), feedbackDuration);
  }, [feedbackDuration]);

  const touchProps = {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: () => setIsPressed(false)
  };

  return {
    isPressed,
    touchProps
  };
};
