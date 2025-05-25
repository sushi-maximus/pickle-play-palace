
import { ReactNode } from "react";

interface MobileLayoutContentProps {
  children: ReactNode;
  topPadding: string;
  fullWidth?: boolean;
}

export const MobileLayoutContent = ({ 
  children, 
  topPadding, 
  fullWidth = false 
}: MobileLayoutContentProps) => {
  return (
    <div className={`flex-1 ${topPadding} pb-20 ${fullWidth ? '' : 'px-3 md:px-6'}`}>
      {children}
    </div>
  );
};
