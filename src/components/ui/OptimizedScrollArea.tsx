
import * as React from "react";
import { cn } from "@/lib/utils";

interface OptimizedScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  enableHardwareAcceleration?: boolean;
}

export const OptimizedScrollArea = React.forwardRef<
  HTMLDivElement,
  OptimizedScrollAreaProps
>(({ className, children, onScroll, enableHardwareAcceleration = true, ...props }, ref) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const throttleRef = React.useRef<number | null>(null);

  // Throttled scroll handler for better performance
  const handleScroll = React.useCallback((event: React.UIEvent<HTMLDivElement>) => {
    if (onScroll) {
      if (throttleRef.current) {
        cancelAnimationFrame(throttleRef.current);
      }
      
      throttleRef.current = requestAnimationFrame(() => {
        onScroll(event);
      });
    }
  }, [onScroll]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (throttleRef.current) {
        cancelAnimationFrame(throttleRef.current);
      }
    };
  }, []);

  // Merge refs
  const mergedRef = React.useCallback((node: HTMLDivElement | null) => {
    scrollRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref]);

  return (
    <div
      ref={mergedRef}
      className={cn(
        "relative overflow-auto",
        enableHardwareAcceleration && "transform-gpu will-change-scroll",
        className
      )}
      onScroll={handleScroll}
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth'
      }}
      {...props}
    >
      {children}
    </div>
  );
});

OptimizedScrollArea.displayName = "OptimizedScrollArea";
