
import { lazy, ComponentType } from 'react';

// Preloading cache to store loaded components
const preloadCache = new Map<string, Promise<{ default: ComponentType<any> }>>();

// Extended lazy component type with preload method
export type LazyComponentWithPreload<T extends ComponentType<any>> = React.LazyExoticComponent<T> & {
  preload: () => Promise<{ default: T }>;
};

// Create a lazy component with preloading capability
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  componentName: string
): LazyComponentWithPreload<T> => {
  const LazyComponent = lazy(importFn) as LazyComponentWithPreload<T>;
  
  // Add preload method to the component
  LazyComponent.preload = () => {
    if (!preloadCache.has(componentName)) {
      preloadCache.set(componentName, importFn());
    }
    return preloadCache.get(componentName) as Promise<{ default: T }>;
  };
  
  return LazyComponent;
};

// Preload critical routes on app initialization
export const preloadCriticalRoutes = () => {
  // Use dynamic imports directly for preloading
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      import('@/pages/Dashboard');
      import('@/pages/Profile');
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      import('@/pages/Dashboard');
      import('@/pages/Profile');
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
