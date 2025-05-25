
import { UserPlus } from "lucide-react";

interface GroupHorizontalTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin: boolean;
  hasPendingRequests?: boolean;
}

export const GroupHorizontalTabs = ({ 
  activeTab, 
  onTabChange, 
  isAdmin,
  hasPendingRequests 
}: GroupHorizontalTabsProps) => {
  console.log("GroupHorizontalTabs: Rendering with isAdmin:", isAdmin, "hasPendingRequests:", hasPendingRequests);
  
  const tabs = [
    { id: "home2", label: "Activity", icon: "activity" },
    { id: "calendar", label: "Calendar", icon: "calendar" },
    { id: "users", label: "Members", icon: "users" },
    ...(isAdmin ? [{ id: "requests", label: "Requests", icon: "user-plus" }] : []),
    { id: "about", label: "About", icon: "info" },
    ...(isAdmin ? [{ id: "settings", label: "Settings", icon: "settings" }] : []),
  ];

  console.log("GroupHorizontalTabs: Rendered tabs:", tabs.map(t => t.id));

  return (
    <div className="border-b bg-white">
      <div className="flex overflow-x-auto px-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? "text-green-600 border-green-600"
                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-1">
              {tab.id === "requests" && (
                <UserPlus className="h-3 w-3 md:h-4 md:w-4" />
              )}
              <span>{tab.label}</span>
              {tab.id === "requests" && hasPendingRequests && (
                <span className="text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 font-medium ml-1">
                  !
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
