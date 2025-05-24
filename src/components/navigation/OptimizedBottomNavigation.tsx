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

// Route context detection utilities
const isGroupRoute = (pathname: string): boolean => {
  return pathname.includes('/groups/') && pathname !== '/groups';
};

const extractGroupId = (pathname: string): string | null => {
  const match = pathname.match(/\/groups\/([^\/]+)/);
  return match ? match[1] : null;
};

const isValidGroupId = (groupId: string | undefined): boolean => {
  return Boolean(groupId && groupId !== 'undefined' && groupId.length > 0);
};

export const OptimizedBottomNavigation = () => {
  const location = useLocation();
  const { id: paramGroupId } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  // Enhanced route context detection
  const currentPath = location.pathname;
  const isOnGroupRoute = isGroupRoute(currentPath);
  const extractedGroupId = extractGroupId(currentPath);
  const activeGroupId = paramGroupId || extractedGroupId;
  const hasValidGroupId = isValidGroupId(activeGroupId);
  
  // Determine if we're in a group context (route detection only)
  const isInGroupContext = isOnGroupRoute && hasValidGroupId;
  
  // Get group details only when we have a valid context
  const { group } = useGroupDetails(
    isInGroupContext ? activeGroupId! : "", 
    user?.id
  );

  // Enhanced debug logging for route detection
  console.log("OptimizedBottomNavigation - Route Context Detection:", {
    currentPath,
    paramGroupId,
    extractedGroupId,
    activeGroupId,
    isOnGroupRoute,
    hasValidGroupId,
    isInGroupContext,
    groupName: group?.name,
    timestamp: new Date().toISOString()
  });

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

  // Group context navigation items (for future use)
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

  // For now, always use base navigation (UI unchanged)
  // In future chunks, we'll use: isInGroupContext ? groupContextNavItems : baseNavItems
  const navItems = baseNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[100]">
      {/* Group context indicator - FOR TESTING ONLY */}
      {isInGroupContext && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-blue-700 truncate">
                Context Detected: {group?.name || `Group ${activeGroupId}` || "Loading..."}
              </span>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
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
          
          return (
            <OptimizedNavLink
              key={item.to}
              to={item.to}
              preloadRoute={item.preload}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "text-primary bg-primary/10" 
                  : item.isBackButton
                  ? "text-blue-600 bg-blue-100 border border-blue-300 hover:bg-blue-200 shadow-sm"
                  : "text-gray-600 hover:text-primary hover:bg-primary/5"
              }`}
            >
              <IconComponent className="h-5 w-5 mb-1" />
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
