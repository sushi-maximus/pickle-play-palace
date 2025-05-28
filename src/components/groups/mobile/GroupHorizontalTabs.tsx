
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, Activity, Settings, UserCheck } from "lucide-react";
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
  const tabs = [
    {
      id: "home",
      label: "Home",
      icon: Activity,
      ariaLabel: "Group home and posts"
    },
    {
      id: "members",
      label: "Members",
      icon: Users,
      ariaLabel: `Group members, ${memberCount} total`,
      badge: memberCount > 0 ? memberCount.toString() : undefined
    },
    {
      id: "calendar",
      label: "Events",
      icon: Calendar,
      ariaLabel: "Group events and calendar"
    }
  ];

  // Add admin-only tabs
  if (isAdmin) {
    tabs.push({
      id: "requests",
      label: "Requests",
      icon: UserCheck,
      ariaLabel: "Join requests" + (hasPendingRequests ? " - has pending requests" : ""),
      badge: hasPendingRequests ? "!" : undefined
    });
    
    tabs.push({
      id: "settings",
      label: "Settings",
      icon: Settings,
      ariaLabel: "Group settings and administration"
    });
  }

  const handleTabChange = (value: string) => {
    onTabChange(value);
  };

  const handleKeyDown = (event: React.KeyboardEvent, tabId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTabChange(tabId);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
      const nextIndex = event.key === 'ArrowLeft' 
        ? Math.max(0, currentIndex - 1)
        : Math.min(tabs.length - 1, currentIndex + 1);
      handleTabChange(tabs[nextIndex].id);
    }
  };

  return (
    <div className="border-b bg-white">
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList 
          className="w-full justify-start bg-transparent p-0 h-auto"
          role="tablist"
          aria-label="Group navigation tabs"
        >
          <div className="flex overflow-x-auto scrollbar-hide px-4 py-2 gap-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 hover:bg-gray-50 transition-colors"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-label={tab.ariaLabel}
                  tabIndex={activeTab === tab.id ? 0 : -1}
                  onKeyDown={(e) => handleKeyDown(e, tab.id)}
                >
                  <IconComponent 
                    className="w-4 h-4" 
                    aria-hidden="true"
                  />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <Badge 
                      variant={tab.badge === "!" ? "destructive" : "secondary"} 
                      className="ml-1 text-xs min-w-0 px-1"
                      aria-label={
                        tab.badge === "!" 
                          ? "Has pending requests" 
                          : `${tab.badge} items`
                      }
                    >
                      {tab.badge}
                    </Badge>
                  )}
                </TabsTrigger>
              );
            })}
          </div>
        </TabsList>
      </Tabs>
    </div>
  );
};
