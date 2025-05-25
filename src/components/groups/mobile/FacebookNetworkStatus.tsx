
import { memo, useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

const FacebookNetworkStatusComponent = () => {
  const { isOnline, isSlowConnection } = useNetworkStatus();
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowOfflineMessage(true);
      setShowSlowMessage(false);
    } else if (isSlowConnection) {
      setShowSlowMessage(true);
      setShowOfflineMessage(false);
    } else {
      // Delay hiding messages to avoid flashing
      const timer = setTimeout(() => {
        setShowOfflineMessage(false);
        setShowSlowMessage(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, isSlowConnection]);

  if (!showOfflineMessage && !showSlowMessage) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${
      showOfflineMessage ? 'bg-red-500' : 'bg-yellow-500'
    } text-white px-4 py-2 text-center text-sm animate-slide-down`}>
      <div className="flex items-center justify-center space-x-2">
        {showOfflineMessage ? (
          <>
            <WifiOff className="h-4 w-4" />
            <span>You're offline. Check your internet connection.</span>
          </>
        ) : (
          <>
            <Wifi className="h-4 w-4" />
            <span>Slow connection detected. Some features may be limited.</span>
          </>
        )}
      </div>
    </div>
  );
};

export const FacebookNetworkStatus = memo(FacebookNetworkStatusComponent);
