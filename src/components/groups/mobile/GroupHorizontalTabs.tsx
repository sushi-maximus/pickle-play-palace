
import { Activity, Users, Calendar, Settings, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GroupHorizontalTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin?: boolean;
  hasPendingRequests?: boolean;
  memberCount?: number;
}

export const GroupHorizontalTabs = ({ 
  activeTab, 
  onTabChange, 
  isAdmin = false, 
  hasPendingRequests = false,
  memberCount = 0
}: GroupHorizontalTabsProps) => {
  const baseTabs = [
    { id: "activity2", label: "Activity", icon: Activity },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "users", label: "Members", icon: Users, showBadge: isAdmin && hasPendingRequests, showCount: true }
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex w-full">
        {baseTabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-label={tab.label}
              className={`flex-1 flex flex-col items-center justify-center min-h-[56px] px-4 py-3 text-sm font-medium transition-all duration-200 touch-manipulation relative ${
                activeTab === tab.id
                  ? "text-primary bg-primary/10 border-b-2 border-primary"
                  : "text-gray-600 hover:text-primary hover:bg-primary/5"
              }`}
            >
              <div className="relative">
                <IconComponent className="h-4 w-4 flex-shrink-0" />
                {tab.showBadge && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </div>
              {tab.showCount && memberCount > 0 && (
                <span className="text-xs mt-1">{memberCount}</span>
              )}
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
                  aria-label="Admin settings"
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
    </div>
  );
};
