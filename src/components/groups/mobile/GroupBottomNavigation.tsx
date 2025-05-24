
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
            onClick={() => onTabChange(item.id)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
