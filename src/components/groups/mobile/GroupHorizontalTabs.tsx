
import { Button } from "@/components/ui/button";
import { Home, Calendar, Users, Settings } from "lucide-react";

interface GroupHorizontalTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const GroupHorizontalTabs = ({ 
  activeTab, 
  onTabChange 
}: GroupHorizontalTabsProps) => {
  const tabItems = [
    { id: "home2", icon: Home, label: "Home" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "users", icon: Users, label: "Members" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-3 py-2">
      <div className="flex items-center gap-1 overflow-x-auto">
        {tabItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className={`flex items-center gap-2 h-9 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
              activeTab === item.id 
                ? "text-primary bg-primary/15 shadow-sm font-semibold border border-primary/20" 
                : "text-gray-600 hover:text-primary hover:bg-primary/5"
            }`}
            onClick={() => onTabChange(item.id)}
          >
            <item.icon className={`h-4 w-4 transition-transform duration-200 ${
              activeTab === item.id ? "scale-110" : ""
            }`} />
            <span className="text-sm font-medium">
              {item.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};
