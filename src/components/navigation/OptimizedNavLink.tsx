
import { Link, LinkProps } from "react-router-dom";
import { ReactNode, useCallback } from "react";
import { routePreloader } from "@/utils/routePreloader";

interface OptimizedNavLinkProps extends Omit<LinkProps, "to"> {
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
  const handleMouseEnter = useCallback(() => {
    if (preloadRoute) {
      routePreloader.preload(to, preloadRoute);
    }
  }, [to, preloadRoute]);

  const handleFocus = useCallback(() => {
    if (preloadRoute) {
      routePreloader.preload(to, preloadRoute);
    }
  }, [to, preloadRoute]);

  return (
    <Link
      to={to}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
};
