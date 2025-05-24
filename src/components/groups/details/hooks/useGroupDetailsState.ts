
import { useState } from "react";

type ActiveTab = "home2" | "users" | "settings" | "calendar";

export const useGroupDetailsState = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home2");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as ActiveTab);
  };

  return {
    activeTab,
    handleTabChange
  };
};
