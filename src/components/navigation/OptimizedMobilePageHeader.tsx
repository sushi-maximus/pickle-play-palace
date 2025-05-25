
import React, { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MobilePageHeaderProps {
  title: string;
  showMenu?: boolean;
  onMenuClick?: () => void;
}

const OptimizedMobilePageHeader = memo(({ 
  title, 
  showMenu = false, 
  onMenuClick 
}: MobilePageHeaderProps) => {
  console.log("OptimizedMobilePageHeader rendering with title:", title);
  
  const shouldCenter = React.useMemo(() => title === "Profile", [title]);
  
  const handleMenuClick = useCallback(() => {
    onMenuClick?.();
  }, [onMenuClick]);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 py-3 flex items-center justify-between shadow-lg border-b border-slate-600/30">
      <div className="flex-1">
        <h1 className={`font-semibold text-lg md:text-xl tracking-tight leading-tight ${shouldCenter ? 'text-center' : 'text-left'}`}>
          {title}
        </h1>
      </div>
      
      {showMenu && (
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-slate-600/50 transition-all duration-200 hover:scale-105 flex-shrink-0"
          onClick={handleMenuClick}
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
    </header>
  );
});

OptimizedMobilePageHeader.displayName = "OptimizedMobilePageHeader";

export { OptimizedMobilePageHeader };
