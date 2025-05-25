
import { ReactNode } from "react";
import { MobileLayout } from "./MobileLayout";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  showMobileProfileHeader?: boolean;
  fullWidth?: boolean;
}

export const AppLayout = ({ 
  children, 
  title, 
  showMobileProfileHeader = true,
  fullWidth = false
}: AppLayoutProps) => {
  return (
    <MobileLayout 
      title={title} 
      showProfileHeader={showMobileProfileHeader}
      fullWidth={fullWidth}
    >
      {children}
    </MobileLayout>
  );
};
