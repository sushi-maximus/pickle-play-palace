
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { id: "groups", icon: Users, label: "Groups", path: "/groups" },
    { id: "profile", icon: User, label: "Profile", path: "/profile" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t px-4 py-2 md:hidden">
      <div className="flex justify-center gap-8">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
              location.pathname === item.path ? "text-primary" : "text-slate-600"
            }`}
            onClick={() => handleNavigation(item.path)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
