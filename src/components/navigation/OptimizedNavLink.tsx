
import { Link, LinkProps } from 'react-router-dom';
import { ReactNode } from 'react';
import { preloadOnHover } from '@/utils/lazyLoading';

interface OptimizedNavLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
  children: ReactNode;
  preloadRoute?: () => Promise<any>;
  className?: string;
}

export const OptimizedNavLink = ({ 
  to, 
  children, 
  preloadRoute,
  className,
  ...props 
}: OptimizedNavLinkProps) => {
  const preloadProps = preloadRoute 
    ? preloadOnHover(`route-${to}`, preloadRoute)
    : {};

  return (
    <Link 
      to={to} 
      className={className}
      {...preloadProps}
      {...props}
    >
      {children}
    </Link>
  );
};
