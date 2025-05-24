
import { useLocation, useParams } from "react-router-dom";
import { Home, Users, User, Settings, ArrowLeft } from "lucide-react";
import { OptimizedNavLink } from "./OptimizedNavLink";
import { useGroupDetails } from "@/components/groups/details/hooks/useGroupDetails";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LazyDashboard, 
  LazyGroups, 
  LazyProfile,
  LazyAdmin
} from "@/pages/lazy";

export const OptimizedBottomNavigation = () => {
  const location = useLocation();
  const { id: groupId } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  // Check if we're on a group details page
  const isGroupDetailsPage = location.pathname.startsWith('/groups/') && groupId;
  
  // Get group details only when on group page
  const { group } = useGroupDetails(
    isGroupDetailsPage ? groupId! : "", 
    user?.id
  );

  // Base navigation items
  const baseNavItems = [
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
      icon: Settings,
      label: "Admin",
      to: "/admin",
      preload: LazyAdmin.preload
    }
  ];

  // Modified navigation items for group context
  const groupContextNavItems = [
    {
      icon: Home,
      label: "Home",
      to: "/dashboard",
      preload: LazyDashboard.preload
    },
    {
      icon: ArrowLeft,
      label: "Back",
      to: "/groups",
      preload: LazyGroups.preload,
      isBackButton: true
    },
    {
      icon: User,
      label: "Profile",
      to: "/profile",
      preload: LazyProfile.preload
    },
    {
      icon: Settings,
      label: "Admin",
      to: "/admin",
      preload: LazyAdmin.preload
    }
  ];

  // Choose navigation items based on context
  const navItems = isGroupDetailsPage ? groupContextNavItems : baseNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-100">
      {/* Group context indicator */}
      {isGroupDetailsPage && group && (
        <div className="bg-primary/5 border-b border-primary/10 px-4 py-2">
          <div className="flex items-center justify-center">
            <span className="text-sm font-medium text-primary truncate">
              {group.name}
            </span>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = item.isBackButton 
            ? false 
            : location.pathname === item.to;
          const IconComponent = item.icon;
          
          return (
            <OptimizedNavLink
              key={item.to}
              to={item.to}
              preloadRoute={item.preload}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? "text-primary bg-primary/10" 
                  : item.isBackButton
                  ? "text-gray-600 hover:text-primary hover:bg-primary/5"
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
