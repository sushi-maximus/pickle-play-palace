
import { Activity, Users, Info, Calendar, Settings } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface GroupHorizontalTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin?: boolean;
}

export const GroupHorizontalTabs = ({ activeTab, onTabChange, isAdmin = false }: GroupHorizontalTabsProps) => {
  const baseTabs = [
    { id: "home2", label: "Activity", icon: Activity },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "users", label: "Members", icon: Users },
    { id: "about", label: "About", icon: Info }
  ];

  // Always add Settings tab for admins
  const tabs = isAdmin 
    ? [...baseTabs, { id: "settings", label: "Settings", icon: Settings }]
    : baseTabs;

  return (
    <div className="border-b border-gray-200 bg-white">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max min-w-full">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-shrink-0 flex items-center justify-center gap-2 min-h-[56px] px-4 py-3 text-sm font-medium transition-all duration-200 touch-manipulation min-w-[120px] ${
                  activeTab === tab.id
                    ? "text-primary bg-primary/10 border-b-2 border-primary"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                }`}
              >
                <IconComponent className="h-4 w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="h-0" />
      </ScrollArea>
    </div>
  );
};
