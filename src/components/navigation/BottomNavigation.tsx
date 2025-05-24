
import { useState, useEffect } from "react";
import { Users, User, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigation } from "./hooks/useNavigation";

export const BottomNavigation = () => {
  const { activeTab, navigateToTab } = useNavigation();

  const navigationItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "groups", icon: Users, label: "Groups" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[100] shadow-lg">
      <div className="flex justify-around items-center py-2">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
              activeTab === item.id 
                ? "text-primary bg-primary/10" 
                : "text-gray-600 hover:text-primary"
            }`}
            onClick={() => navigateToTab(item.id)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
