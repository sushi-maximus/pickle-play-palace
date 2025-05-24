
import React, { memo, useCallback } from "react";
import { Users, User, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigation } from "./hooks/useNavigation";

const navigationItems = [
  { id: "dashboard", icon: Home, label: "Dashboard" },
  { id: "groups", icon: Users, label: "Groups" },
  { id: "profile", icon: User, label: "Profile" },
];

const OptimizedBottomNavigation = memo(() => {
  const { activeTab, navigateToTab } = useNavigation();

  const handleNavigation = useCallback((tab: string) => {
    navigateToTab(tab);
  }, [navigateToTab]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-[100] shadow-2xl">
      <div className="flex justify-around items-center py-2">
        {navigationItems.map((item) => (
          <NavigationItem 
            key={item.id}
            item={item}
            isActive={activeTab === item.id}
            onNavigate={handleNavigation}
          />
        ))}
      </div>
    </div>
  );
});

const NavigationItem = memo(({ item, isActive, onNavigate }: {
  item: typeof navigationItems[0];
  isActive: boolean;
  onNavigate: (tab: string) => void;
}) => {
  const handleClick = useCallback(() => {
    onNavigate(item.id);
  }, [onNavigate, item.id]);

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`flex flex-col items-center gap-1 h-auto py-3 px-4 rounded-xl transition-all duration-300 relative ${
        isActive 
          ? "text-primary bg-primary/15 shadow-sm scale-105" 
          : "text-gray-600 hover:text-primary hover:bg-primary/5 hover:scale-102"
      }`}
      onClick={handleClick}
    >
      {isActive && (
        <div className="absolute -top-1 w-1 h-1 bg-primary rounded-full animate-pulse"></div>
      )}
      
      <item.icon className={`h-5 w-5 transition-transform duration-200 ${
        isActive ? "scale-110" : ""
      }`} />
      <span className={`text-xs font-medium transition-all duration-200 leading-tight ${
        isActive ? "font-semibold" : ""
      }`}>
        {item.label}
      </span>
    </Button>
  );
});

OptimizedBottomNavigation.displayName = "OptimizedBottomNavigation";
NavigationItem.displayName = "NavigationItem";

export { OptimizedBottomNavigation };
