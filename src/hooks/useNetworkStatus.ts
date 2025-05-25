
import { useState, useEffect } from 'react';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        console.log('Network connection restored');
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      console.log('Network connection lost');
    };

    // Check connection speed if supported
    const checkConnectionSpeed = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          // Consider slow connection if effective type is 'slow-2g' or '2g'
          const slowTypes = ['slow-2g', '2g'];
          setIsSlowConnection(slowTypes.includes(connection.effectiveType));
        }
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial connection speed
    checkConnectionSpeed();
    
    // Monitor connection changes
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        connection.addEventListener('change', checkConnectionSpeed);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          connection.removeEventListener('change', checkConnectionSpeed);
        }
      }
    };
  }, [wasOffline]);

  return { isOnline, wasOffline, isSlowConnection };
};
