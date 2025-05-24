
import { lazy, ComponentType } from 'react';

// Preloading cache to store loaded components
const preloadCache = new Map<string, Promise<{ default: ComponentType<any> }>>();

// Create a lazy component with preloading capability
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  componentName: string
) => {
  const LazyComponent = lazy(importFn);
  
  // Add preload method to the component
  (LazyComponent as any).preload = () => {
    if (!preloadCache.has(componentName)) {
      preloadCache.set(componentName, importFn());
    }
    return preloadCache.get(componentName);
  };
  
  return LazyComponent;
};

// Preload critical routes on app initialization
export const preloadCriticalRoutes = () => {
  // Preload dashboard since it's the most common landing page for authenticated users
  const DashboardPage = createLazyComponent(
    () => import('@/pages/Dashboard'),
    'Dashboard'
  );
  
  const ProfilePage = createLazyComponent(
    () => import('@/pages/Profile'),
    'Profile'
  );
  
  // Preload these on idle
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      DashboardPage.preload();
      ProfilePage.preload();
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      DashboardPage.preload();
      ProfilePage.preload();
    }, 100);
  }
};

// Route-based preloading on hover/focus
export const preloadOnHover = (routeName: string, importFn: () => Promise<any>) => {
  return {
    onMouseEnter: () => {
      if (!preloadCache.has(routeName)) {
        preloadCache.set(routeName, importFn());
      }
    },
    onFocus: () => {
      if (!preloadCache.has(routeName)) {
        preloadCache.set(routeName, importFn());
      }
    }
  };
};
