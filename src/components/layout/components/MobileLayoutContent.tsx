
import { ReactNode } from "react";

interface MobileLayoutContentProps {
  children: ReactNode;
  topPadding: string;
}

export const MobileLayoutContent = ({ children, topPadding }: MobileLayoutContentProps) => {
  return (
    <div className={`flex-1 ${topPadding} pb-20`}>
      {children}
    </div>
  );
};
