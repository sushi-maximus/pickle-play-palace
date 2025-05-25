
import { memo, useEffect, useState } from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { Wifi, WifiOff, Signal } from "lucide-react";

const FacebookNetworkStatusComponent = () => {
  const { isOnline, wasOffline, isSlowConnection } = useNetworkStatus();
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    if (!isOnline || wasOffline || isSlowConnection) {
      setShowStatus(true);
      
      // Auto-hide after successful reconnection
      if (isOnline && !isSlowConnection) {
        const timer = setTimeout(() => {
          setShowStatus(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    } else {
      setShowStatus(false);
    }
  }, [isOnline, wasOffline, isSlowConnection]);

  if (!showStatus) return null;

  const getStatusConfig = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        text: "No internet connection",
        bgColor: "bg-red-500",
        textColor: "text-white"
      };
    } else if (isSlowConnection) {
      return {
        icon: Signal,
        text: "Slow connection detected",
        bgColor: "bg-yellow-500",
        textColor: "text-white"
      };
    } else if (wasOffline) {
      return {
        icon: Wifi,
        text: "Connection restored",
        bgColor: "bg-green-500",
        textColor: "text-white"
      };
    }
    
    return null;
  };

  const statusConfig = getStatusConfig();
  if (!statusConfig) return null;

  const { icon: Icon, text, bgColor, textColor } = statusConfig;

  return (
    <div className={`${bgColor} ${textColor} px-3 py-2 sm:px-4 sm:py-3 text-center relative z-50 animate-fade-in`}>
      <div className="flex items-center justify-center space-x-2 max-w-2xl mx-auto">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
        <span className="text-xs sm:text-sm font-medium">{text}</span>
      </div>
    </div>
  );
};

export const FacebookNetworkStatus = memo(FacebookNetworkStatusComponent);
