
import { useState } from "react";

type ActiveTab = "activity2" | "home2" | "users" | "settings" | "calendar";

export const useGroupDetailsState = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("activity2");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as ActiveTab);
  };

  return {
    activeTab,
    handleTabChange
  };
};
