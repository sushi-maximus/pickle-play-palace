
import { useState, useEffect } from "react";
import { Users, User, Home, BookOpen } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const MobileGroupsBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("groups");

  useEffect(() => {
    // Set active tab based on current path
    if (location.pathname === "/groups") {
      setActiveTab("groups");
    } else if (location.pathname === "/profile") {
      setActiveTab("profile");
    } else if (location.pathname === "/dashboard") {
      setActiveTab("dashboard");
    } else if (location.pathname === "/training") {
      setActiveTab("training");
    }
  }, [location.pathname]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[100] shadow-lg">
      <div className="flex justify-around items-center py-2">
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
            activeTab === "dashboard" 
              ? "text-primary bg-primary/10" 
              : "text-gray-600 hover:text-primary"
          }`}
          onClick={() => handleTabChange("dashboard")}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Dashboard</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
            activeTab === "groups" 
              ? "text-primary bg-primary/10" 
              : "text-gray-600 hover:text-primary"
          }`}
          onClick={() => handleTabChange("groups")}
        >
          <Users className="h-5 w-5" />
          <span className="text-xs">Groups</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
            activeTab === "training" 
              ? "text-primary bg-primary/10" 
              : "text-gray-600 hover:text-primary"
          }`}
          onClick={() => handleTabChange("training")}
        >
          <BookOpen className="h-5 w-5" />
          <span className="text-xs">Training</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
            activeTab === "profile" 
              ? "text-primary bg-primary/10" 
              : "text-gray-600 hover:text-primary"
          }`}
          onClick={() => handleTabChange("profile")}
        >
          <User className="h-5 w-5" />
          <span className="text-xs">Profile</span>
        </Button>
      </div>
    </div>
  );
};
