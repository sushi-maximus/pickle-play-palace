
import { createLazyComponent } from "@/utils/lazyLoading";

// Eager loaded components (critical for app startup)
export { default as LazyIndex } from "../Index";
export { default as LazyLogin } from "../Login";
export { default as LazySignup } from "../Signup";

// Lazy loaded components
export const LazyDashboard = createLazyComponent(() => import("../Dashboard"));
export const LazyProfile = createLazyComponent(() => import("../Profile"));
export const LazyGroups = createLazyComponent(() => import("../Groups"));
export const LazyGroupDetails = createLazyComponent(() => import("../GroupDetails"));
export const LazyEventDetailsPage = createLazyComponent(() => 
  import("../EventDetailsPage").then(m => ({ default: m.EventDetailsPage }))
);
export const LazyAdmin = createLazyComponent(() => import("../Admin"));
export const LazyContact = createLazyComponent(() => import("../Contact"));
export const LazyPrivacy = createLazyComponent(() => import("../Privacy"));
export const LazyForgotPassword = createLazyComponent(() => import("../ForgotPassword"));
export const LazyAuthCallback = createLazyComponent(() => import("../AuthCallback"));
export const LazyNotFound = createLazyComponent(() => import("../NotFound"));
