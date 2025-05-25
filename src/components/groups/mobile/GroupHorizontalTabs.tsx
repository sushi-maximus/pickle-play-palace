
import { Activity, Users, Info, Calendar, Settings } from "lucide-react";

interface GroupHorizontalTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin?: boolean;
}

export const GroupHorizontalTabs = ({ activeTab, onTabChange, isAdmin = false }: GroupHorizontalTabsProps) => {
  const tabs = [
    { id: "home2", label: "Activity", icon: Activity },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "users", label: "Members", icon: Users },
    { id: "about", label: "About", icon: Info }
  ];

  // Add Settings tab only for admins
  if (isAdmin) {
    tabs.push({ id: "settings", label: "Settings", icon: Settings });
  }

  return (
    <div className="border-b border-border bg-white">
      <div className="flex">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-medium transition-all duration-200 min-h-[48px] ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              }`}
            >
              <IconComponent className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
