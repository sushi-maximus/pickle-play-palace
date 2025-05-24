
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Set active tab based on current path
    const path = location.pathname;
    if (path === "/groups" || path.startsWith("/groups/")) {
      setActiveTab("groups");
    } else if (path === "/profile") {
      setActiveTab("profile");
    } else if (path === "/dashboard") {
      setActiveTab("dashboard");
    } else if (path === "/training") {
      setActiveTab("training");
    }
  }, [location.pathname]);

  const navigateToTab = (tab: string) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  return {
    activeTab,
    navigateToTab,
    currentPath: location.pathname
  };
};
