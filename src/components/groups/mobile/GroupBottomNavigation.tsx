
import { Button } from "@/components/ui/button";
import { Home, Calendar, Users, Settings } from "lucide-react";

interface GroupBottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const GroupBottomNavigation = ({ 
  activeTab, 
  onTabChange 
}: GroupBottomNavigationProps) => {
  const navigationItems = [
    { id: "home2", icon: Home, label: "Home" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "users", icon: Users, label: "Members" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-[100] shadow-2xl">
      <div className="flex justify-around items-center py-2">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-3 px-3 rounded-xl transition-all duration-300 relative ${
              activeTab === item.id 
                ? "text-primary bg-primary/15 shadow-sm scale-105" 
                : "text-gray-600 hover:text-primary hover:bg-primary/5 hover:scale-102"
            }`}
            onClick={() => onTabChange(item.id)}
          >
            {/* Active indicator dot */}
            {activeTab === item.id && (
              <div className="absolute -top-1 w-1 h-1 bg-primary rounded-full animate-pulse"></div>
            )}
            
            <item.icon className={`h-5 w-5 transition-transform duration-200 ${
              activeTab === item.id ? "scale-110" : ""
            }`} />
            <span className={`text-xs font-medium transition-all duration-200 ${
              activeTab === item.id ? "font-semibold" : ""
            }`}>
              {item.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};
