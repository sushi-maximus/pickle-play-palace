
import { useState } from "react";
import { useCreatePost2 } from "../posts/hooks/useCreatePost2";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface FacebookCreatePostProps {
  groupId: string;
  user: Profile | null;
  onPostCreated?: () => void;
}

export const FacebookCreatePost = ({ groupId, user, onPostCreated }: FacebookCreatePostProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { content, setContent, isSubmitting, handleSubmit } = useCreatePost2({
    groupId,
    userId: user?.id,
    onPostCreated: () => {
      setIsExpanded(false);
      onPostCreated?.();
    }
  });

  const handlePostClick = () => {
    setIsExpanded(true);
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setContent("");
  };

  const handleSubmitPost = async () => {
    if (!content.trim()) return;
    await handleSubmit();
  };

  if (!user) {
    return (
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="text-center text-gray-500 text-sm">
          Please log in to create posts
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4">
      {!isExpanded ? (
        // Collapsed State - Facebook-style prompt
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
          <div 
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={handlePostClick}
          >
            What's on your mind, {user.first_name || 'User'}?
          </div>
        </div>
      ) : (
        // Expanded State - Full post creation form
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-gray-900">
                {user.first_name} {user.last_name}
              </div>
              <div className="text-xs text-gray-500">Public</div>
            </div>
          </div>
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's on your mind, ${user.first_name}?`}
            className="w-full min-h-[100px] p-3 border-none resize-none text-gray-900 placeholder-gray-500 focus:outline-none text-lg"
            autoFocus
          />
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="text-sm text-gray-600">Add to your post</div>
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPost}
                disabled={!content.trim() || isSubmitting}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
