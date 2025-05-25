
import { ReactNode } from "react";
import { OptimizedBottomNavigation } from "@/components/navigation/OptimizedBottomNavigation";
import { OptimizedMobilePageHeader } from "@/components/navigation/OptimizedMobilePageHeader";
import { MobileLayoutContent } from "./components/MobileLayoutContent";

interface MobileLayoutProps {
  children: ReactNode;
  title: string;
  showProfileHeader?: boolean;
  fullWidth?: boolean;
}

export const MobileLayout = ({ 
  children, 
  title, 
  showProfileHeader = true,
  fullWidth = false
}: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {showProfileHeader && (
        <OptimizedMobilePageHeader title={title} />
      )}
      
      <MobileLayoutContent 
        topPadding={showProfileHeader ? "pt-16" : "pt-0"}
        fullWidth={fullWidth}
      >
        {children}
      </MobileLayoutContent>
      
      <OptimizedBottomNavigation />
    </div>
  );
};
