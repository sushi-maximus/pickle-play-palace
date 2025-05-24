
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

interface NavItem {
  icon: React.ComponentType<any>;
  label: string;
  to: string;
  preload: () => Promise<any>;
  isBackButton?: boolean;
}

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
  const baseNavItems: NavItem[] = [
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
  const groupContextNavItems: NavItem[] = [
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
      {/* Group context indicator - Enhanced styling for Chunk 2 */}
      {isGroupDetailsPage && group && (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-3">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-primary truncate">
                {group.name}
              </span>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = item.isBackButton 
            ? false 
            : location.pathname === item.to;
          const IconComponent = item.icon;
          
          // Enhanced styling for back button
          const backButtonStyles = item.isBackButton 
            ? "text-primary bg-primary/15 border border-primary/30" 
            : "";
          
          return (
            <OptimizedNavLink
              key={item.to}
              to={item.to}
              preloadRoute={item.preload}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "text-primary bg-primary/10" 
                  : item.isBackButton
                  ? `${backButtonStyles} hover:bg-primary/20 shadow-sm`
                  : "text-gray-600 hover:text-primary hover:bg-primary/5"
              }`}
            >
              <IconComponent className={`mb-1 ${
                item.isBackButton ? "h-5 w-5" : "h-5 w-5"
              }`} />
              <span className={`text-xs font-medium ${
                item.isBackButton ? "font-semibold" : ""
              }`}>
                {item.label}
              </span>
            </OptimizedNavLink>
          );
        })}
      </div>
    </nav>
  );
};
