
import { Button } from "@/components/ui/button";
import { Home, Users, Search, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const MobileGroupsBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      id: "dashboard", 
      icon: Home, 
      label: "Home",
      path: "/dashboard"
    },
    { 
      id: "groups", 
      icon: Users, 
      label: "Groups",
      path: "/groups"
    },
    { 
      id: "search", 
      icon: Search, 
      label: "Search",
      path: "/search"
    },
    { 
      id: "profile", 
      icon: User, 
      label: "Profile",
      path: "/profile"
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t px-4 py-2">
      <div className="flex justify-center gap-8">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path === "/groups" && location.pathname.startsWith("/groups"));
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                isActive ? "text-primary" : "text-slate-600"
              }`}
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
