
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const useOptimizedNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Memoize the path to tab mapping
  const getTabFromPath = useCallback((path: string) => {
    if (path === "/groups" || path.startsWith("/groups/")) {
      return "groups";
    } else if (path === "/profile") {
      return "profile";
    } else if (path === "/dashboard") {
      return "dashboard";
    }
    return "dashboard";
  }, []);

  useEffect(() => {
    const newTab = getTabFromPath(location.pathname);
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [location.pathname, activeTab, getTabFromPath]);

  const navigateToTab = useCallback((tab: string) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      navigate(`/${tab}`);
    }
  }, [navigate, activeTab]);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    activeTab,
    navigateToTab,
    currentPath: location.pathname
  }), [activeTab, navigateToTab, location.pathname]);
};
