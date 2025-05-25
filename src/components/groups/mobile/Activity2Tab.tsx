
import { memo } from "react";
import { useGroupPosts } from "../posts/hooks/useGroupPosts";
import type { Database } from "@/integrations/supabase/types";
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
    <main className="flex-1 bg-gray-50">
      <div className="max-w-2xl mx-auto h-full">
        <div className="flex flex-col h-full">
          {/* Facebook-style Create Post Section */}
          <FacebookCreatePost 
            groupId={groupId}
            user={user}
            onPostCreated={handlePostCreated}
          />

          {/* Posts Feed Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {loading ? (
                <MobilePostsLoading />
              ) : (
                <>
                  <FacebookPostsList 
                    posts={posts}
                    user={user}
                  />
                  
                  {/* Development Info Card - Show only when posts exist */}
                  {posts.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <h3 className="text-lg font-medium mb-2 text-blue-900">Real Posts Loaded!</h3>
                      <p className="text-blue-700 text-sm mb-3">
                        Now displaying actual posts from the database with Facebook-style design.
                      </p>
                      <div className="text-xs text-blue-600 space-y-1">
                        <p>Posts Count: {posts.length}</p>
                        <p>Group ID: {groupId}</p>
                        <p>User: {user?.first_name} {user?.last_name}</p>
                        <p>Next: Add like functionality</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export const Activity2Tab = memo(Activity2TabComponent);
