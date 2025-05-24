
import { lazy, Suspense } from 'react';
import { ReactNode } from 'react';

// Lazy load Framer Motion components
const MotionDiv = lazy(() => 
  import('framer-motion').then(module => ({ 
    default: module.motion.div 
  }))
);

interface LazyMotionWrapperProps {
  children: ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  whileInView?: any;
  transition?: any;
  viewport?: any;
  variants?: any;
  style?: any;
}

export const LazyMotionWrapper = ({ 
  children, 
  ...motionProps 
}: LazyMotionWrapperProps) => {
  return (
    <Suspense fallback={<div {...(motionProps.className ? { className: motionProps.className } : {})}>{children}</div>}>
      <MotionDiv {...motionProps}>
        {children}
      </MotionDiv>
    </Suspense>
  );
};
