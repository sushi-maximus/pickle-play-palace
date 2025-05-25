
import { memo } from "react";
import { useGroupPosts } from "../posts/hooks/useGroupPosts";
import type { Profile } from "../posts/hooks/types/groupPostTypes";
import { FacebookCreatePost } from "./FacebookCreatePost";
import { FacebookPostsList } from "./FacebookPostsList";
import { MobilePostsLoading } from "./MobilePostsLoading";

interface Activity2TabProps {
  groupId: string;
  user: Profile | null;
  onPostCreated: () => void;
}

const Activity2TabComponent = ({ groupId, user, onPostCreated }: Activity2TabProps) => {
  console.log("Activity2Tab - Rendering with:", { groupId, userId: user?.id });

  // Fetch posts using existing hook
  const { posts, loading, refreshPosts } = useGroupPosts({
    groupId,
    userId: user?.id
  });

  const handlePostCreated = async () => {
    await refreshPosts();
    onPostCreated();
  };

  return (
    <main className="flex-1 bg-gray-50 overflow-hidden">
      <div className="max-w-2xl mx-auto h-full flex flex-col">
        {/* Facebook-style Create Post Section */}
        <div className="flex-shrink-0">
          <FacebookCreatePost 
            groupId={groupId}
            user={user}
            onPostCreated={handlePostCreated}
          />
        </div>

        {/* Posts Feed Area - Enhanced scrolling for mobile */}
        <div className="flex-1 overflow-y-auto overscroll-behavior-y-contain">
          <div className="p-3 sm:p-4 pb-safe">
            {loading ? (
              <MobilePostsLoading />
            ) : (
              <FacebookPostsList 
                posts={posts}
                user={user}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export const Activity2Tab = memo(Activity2TabComponent);
