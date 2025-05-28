
import { createLazyComponent } from "@/utils/lazyLoading";

// Eager loaded components (critical for app startup)
export { default as LazyIndex } from "../Index";
export { default as LazyLogin } from "../Login";
export { default as LazySignup } from "../Signup";

// Lazy loaded components
export const LazyDashboard = createLazyComponent(() => import("../Dashboard"), "Dashboard");
export const LazyProfile = createLazyComponent(() => import("../Profile"), "Profile");
export const LazyGroups = createLazyComponent(() => import("../Groups"), "Groups");
export const LazyGroupDetails = createLazyComponent(() => import("../GroupDetails"), "GroupDetails");
export const LazyEventDetailsPage = createLazyComponent(() => 
  import("../EventDetailsPage").then(m => ({ default: m.EventDetailsPage })), "EventDetailsPage"
);
export const LazyAdmin = createLazyComponent(() => import("../Admin"), "Admin");
export const LazyContact = createLazyComponent(() => import("../Contact"), "Contact");
export const LazyPrivacy = createLazyComponent(() => import("../Privacy"), "Privacy");
export const LazyForgotPassword = createLazyComponent(() => import("../ForgotPassword"), "ForgotPassword");
export const LazyAuthCallback = createLazyComponent(() => import("../AuthCallback"), "AuthCallback");
export const LazyNotFound = createLazyComponent(() => import("../NotFound"), "NotFound");
