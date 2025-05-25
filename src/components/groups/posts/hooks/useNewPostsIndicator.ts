
import { useState, useEffect, useCallback, useRef } from "react";

interface UseNewPostsIndicatorProps {
  posts: any[];
  refreshing: boolean;
  loading: boolean;
}

export const useNewPostsIndicator = ({ 
  posts, 
  refreshing, 
  loading 
}: UseNewPostsIndicatorProps) => {
  const [showNewPostsBanner, setShowNewPostsBanner] = useState(false);
  const [lastPostCount, setLastPostCount] = useState(0);
  const initialLoadRef = useRef(true);

  // Track when new posts are available
  useEffect(() => {
    // Skip initial load
    if (initialLoadRef.current) {
      setLastPostCount(posts.length);
      initialLoadRef.current = false;
      return;
    }

    // Skip if currently loading or refreshing
    if (loading || refreshing) {
      return;
    }

    // Check if we have more posts than before
    if (posts.length > lastPostCount && lastPostCount > 0) {
      setShowNewPostsBanner(true);
      console.log("New posts detected, showing banner");
    }
  }, [posts.length, lastPostCount, loading, refreshing]);

  // Hide banner when refreshing starts
  useEffect(() => {
    if (refreshing) {
      setShowNewPostsBanner(false);
    }
  }, [refreshing]);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowNewPostsBanner(false);
    setLastPostCount(posts.length);
  }, [posts.length]);

  const hideBanner = useCallback(() => {
    setShowNewPostsBanner(false);
    setLastPostCount(posts.length);
  }, [posts.length]);

  return {
    showNewPostsBanner,
    handleScrollToTop,
    hideBanner
  };
};
