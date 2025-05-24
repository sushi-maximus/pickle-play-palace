
import { preloadCriticalRoutes } from "@/utils/lazyLoading";

export const initializeApp = () => {
  // Preload critical routes after app initialization
  setTimeout(() => {
    preloadCriticalRoutes();
  }, 1000);
};
