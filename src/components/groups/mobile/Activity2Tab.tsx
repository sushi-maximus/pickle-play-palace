
import type { Database } from "@/integrations/supabase/types";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface Activity2TabProps {
  groupId: string;
  user: Profile | null;
  onPostCreated: () => void;
}

export const Activity2Tab = ({ groupId, user, onPostCreated }: Activity2TabProps) => {
  console.log("Activity2Tab - Rendering with:", { groupId, userId: user?.id });

  return (
    <main className="flex-1 bg-gray-50">
      <div className="max-w-2xl mx-auto h-full">
        <div className="flex flex-col h-full">
          {/* Facebook-style Create Post Section */}
          <div className="bg-white border-b border-gray-200 px-4 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors">
                What's on your mind, {user?.first_name || 'User'}?
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-600">Photo/Video placeholder</div>
              <div className="text-sm text-gray-600">Feeling/Activity placeholder</div>
            </div>
          </div>

          {/* Posts Feed Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4 p-4">
              {/* Sample Facebook-style Post Card */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                {/* Post Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-sm text-gray-900">Sample User</div>
                      <div className="text-xs text-gray-500">2 hours ago</div>
                    </div>
                  </div>
                  <div className="text-gray-400 text-lg">•••</div>
                </div>

                {/* Post Content */}
                <div className="px-4 py-3">
                  <p className="text-gray-900 text-sm leading-relaxed">
                    This is a sample Facebook-style post. The layout is clean and minimal, 
                    with proper spacing and typography that matches Facebook's design.
                  </p>
                </div>

                {/* Reaction Summary */}
                <div className="px-4 py-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <span className="text-blue-500">👍</span>
                      <span>You and 12 others</span>
                    </div>
                    <div>3 comments</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex border-t border-gray-100">
                  <button className="flex-1 flex items-center justify-center py-3 text-gray-600 hover:bg-gray-50 transition-colors">
                    <span className="text-lg mr-2">👍</span>
                    <span className="text-sm font-medium">Like</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center py-3 text-gray-600 hover:bg-gray-50 transition-colors border-l border-gray-100">
                    <span className="text-lg mr-2">💬</span>
                    <span className="text-sm font-medium">Comment</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center py-3 text-gray-600 hover:bg-gray-50 transition-colors border-l border-gray-100">
                    <span className="text-lg mr-2">📤</span>
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>
              </div>

              {/* Development Info Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2 text-blue-900">Facebook-Style Layout Ready!</h3>
                <p className="text-blue-700 text-sm mb-3">
                  The Facebook-style layout structure is now in place with proper sections and styling.
                </p>
                <div className="text-xs text-blue-600 space-y-1">
                  <p>Group ID: {groupId}</p>
                  <p>User: {user?.first_name} {user?.last_name}</p>
                  <p>Next: Will add functional create post component</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
