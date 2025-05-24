
import { useLocation } from "react-router-dom";
import { Home, Users, User, MoreHorizontal } from "lucide-react";
import { OptimizedNavLink } from "./OptimizedNavLink";
import { 
  LazyDashboard, 
  LazyGroups, 
  LazyProfile 
} from "@/pages/lazy";

export const OptimizedBottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    {
      icon: Home,
      label: "Home",
      to: "/dashboard",
      preload: LazyDashboard.preload
    },
    {
      icon: Users,
      label: "Groups",
      to: "/groups",
      preload: LazyGroups.preload
    },
    {
      icon: User,
      label: "Profile",
      to: "/profile",
      preload: LazyProfile.preload
    },
    {
      icon: MoreHorizontal,
      label: "More",
      to: "/about",
      preload: () => import("@/pages/About")
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-100">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const IconComponent = item.icon;
          
          return (
            <OptimizedNavLink
              key={item.to}
              to={item.to}
              preloadRoute={item.preload}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-gray-600 hover:text-primary hover:bg-primary/5"
              }`}
            >
              <IconComponent className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </OptimizedNavLink>
          );
        })}
      </div>
    </nav>
  );
};
