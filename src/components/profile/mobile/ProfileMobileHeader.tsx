
import React, { memo } from "react";
import { User } from "lucide-react";
import { useTouchFeedback } from "@/hooks/useTouchFeedback";

interface ProfileMobileHeaderProps {
  title?: string;
}

const ProfileMobileHeader = memo(({ 
  title = "Profile"
}: ProfileMobileHeaderProps) => {
  const { isPressed, touchProps } = useTouchFeedback();
  
  console.log("ProfileMobileHeader rendering with title:", title);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 py-3 flex items-center justify-between shadow-lg border-b border-slate-600/30">
      <div className="flex-1">
        <h1 className="font-semibold text-lg md:text-xl tracking-tight leading-tight text-center animate-fade-in">
          {title}
        </h1>
      </div>
      
      {/* Profile Icon - Right side with touch feedback */}
      <div className="w-10 flex-shrink-0 flex items-center justify-end">
        <div
          className={`p-2 rounded-full transition-all duration-150 ${
            isPressed ? 'bg-slate-600 scale-95' : 'hover:bg-slate-600/50'
          }`}
          {...touchProps}
        >
          <User className="h-5 w-5 text-slate-300" />
        </div>
      </div>
    </header>
  );
});

ProfileMobileHeader.displayName = "ProfileMobileHeader";

export { ProfileMobileHeader };
