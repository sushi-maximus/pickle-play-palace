
import { Activity, Users, Calendar, Settings, MoreVertical } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface GroupHorizontalTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin?: boolean;
}

export const GroupHorizontalTabs = ({ activeTab, onTabChange, isAdmin = false }: GroupHorizontalTabsProps) => {
  const baseTabs = [
    { id: "activity2", label: "Activity", icon: Activity },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "users", label: "Members", icon: Users }
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max min-w-full">
          {baseTabs.map((tab) => {
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
          
          {/* Admin dropdown menu */}
          {isAdmin && (
            <div className="flex-shrink-0 flex items-center justify-center min-h-[56px] px-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-2 min-h-[48px] px-3 py-2 text-sm font-medium transition-all duration-200 touch-manipulation ${
                      activeTab === "settings"
                        ? "text-primary bg-primary/10"
                        : "text-gray-600 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-40 bg-white shadow-lg border border-gray-200 z-[9999]"
                  sideOffset={8}
                >
                  <DropdownMenuItem 
                    onClick={() => onTabChange("settings")}
                    className="min-h-[48px] flex items-center touch-manipulation cursor-pointer hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        <ScrollBar orientation="horizontal" className="h-0" />
      </ScrollArea>
    </div>
  );
};
