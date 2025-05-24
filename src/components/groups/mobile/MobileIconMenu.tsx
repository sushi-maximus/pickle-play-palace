
import { Button } from "@/components/ui/button";
import { Home, Calendar, Users, Settings } from "lucide-react";

interface MobileIconMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileIconMenu = ({ activeTab, onTabChange }: MobileIconMenuProps) => {
  const menuItems = [
    { id: "home2", icon: Home, label: "Home" },
    { id: "calendar", icon: Calendar, label: "Calendar" },
    { id: "users", icon: Users, label: "Members" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t px-4 py-2">
      <div className="flex justify-center gap-8">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
              activeTab === item.id ? "text-primary" : "text-slate-600"
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
