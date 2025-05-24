import { createLazyComponent } from '@/utils/lazyLoading';

// Core pages (keep these eager loaded for initial performance)
export { default as Index } from '@/pages/Index';
export { default as Login } from '@/pages/Login';
export { default as Signup } from '@/pages/Signup';

// Lazy load secondary pages
export const LazyDashboard = createLazyComponent(
  () => import('@/pages/Dashboard'),
  'Dashboard'
);

export const LazyProfile = createLazyComponent(
  () => import('@/pages/Profile'),
  'Profile'
);

export const LazyGroups = createLazyComponent(
  () => import('@/pages/Groups'),
  'Groups'
);

export const LazyGroupDetails = createLazyComponent(
  () => import('@/pages/GroupDetails'),
  'GroupDetails'
);

export const LazyAbout = createLazyComponent(
  () => import('@/pages/About'),
  'About'
);

export const LazyContact = createLazyComponent(
  () => import('@/pages/Contact'),
  'Contact'
);

export const LazyPrivacy = createLazyComponent(
  () => import('@/pages/Privacy'),
  'Privacy'
);

export const LazyForgotPassword = createLazyComponent(
  () => import('@/pages/ForgotPassword'),
  'ForgotPassword'
);

export const LazyAuthCallback = createLazyComponent(
  () => import('@/pages/AuthCallback'),
  'AuthCallback'
);

export const LazyNotFound = createLazyComponent(
  () => import('@/pages/NotFound'),
  'NotFound'
);
