
import React, { memo } from "react";
import { User } from "lucide-react";

interface ProfileMobileHeaderProps {
  title?: string;
}

const ProfileMobileHeader = memo(({ 
  title = "Profile"
}: ProfileMobileHeaderProps) => {
  console.log("ProfileMobileHeader rendering with title:", title);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 py-3 flex items-center justify-between shadow-lg border-b border-slate-600/30">
      <div className="flex-1">
        <h1 className="font-semibold text-lg md:text-xl tracking-tight leading-tight text-center">
          {title}
        </h1>
      </div>
      
      {/* Profile Icon - Right side */}
      <div className="w-10 flex-shrink-0 flex items-center justify-end">
        <User className="h-5 w-5 text-slate-300" />
      </div>
    </header>
  );
});

ProfileMobileHeader.displayName = "ProfileMobileHeader";

export { ProfileMobileHeader };
