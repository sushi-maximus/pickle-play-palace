
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Camera, Image, Send } from "lucide-react";
import { useCreatePost2 } from "../posts/hooks/useCreatePost2";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface FacebookCreatePostProps {
  groupId: string;
  user: Profile | null;
  onPostCreated: () => void;
}

const FacebookCreatePostComponent = ({ 
  groupId, 
  user, 
  onPostCreated 
}: FacebookCreatePostProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { 
    content, 
    setContent, 
    handleSubmit, 
    isSubmitting 
  } = useCreatePost2({
    groupId,
    userId: user?.id || '',
    onPostCreated: () => {
      setIsExpanded(false);
      onPostCreated();
    }
  });

  const handlePostSubmit = async () => {
    if (content.trim() && !isSubmitting) {
      await handleSubmit();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handlePostSubmit();
    }
  };

  if (!user) {
    return (
      <Card className="bg-white border-b border-gray-200 rounded-none shadow-sm">
        <div className="p-4 text-center">
          <p className="text-gray-500 text-sm">Please log in to create posts</p>
        </div>
      </Card>
    );
  }

  const userInitials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}` || 'U';

  return (
    <Card className="bg-white border-b border-gray-200 rounded-none shadow-sm">
      <div className="p-3 sm:p-4">
        {/* Create Post Header */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {userInitials}
          </div>
          
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="flex-1 bg-white border border-gray-300 hover:border-gray-400 text-gray-500 px-4 py-3 rounded-full transition-colors duration-200 text-sm sm:text-base min-h-[44px] touch-manipulation flex items-center justify-center"
            >
              What's on your mind, {user.first_name}?
            </button>
          ) : (
            <div className="flex-1">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={`What's on your mind, ${user.first_name}?`}
                className="w-full border border-gray-300 bg-white resize-none focus:ring-0 focus:border-gray-400 p-3 text-sm sm:text-base min-h-[80px] placeholder:text-gray-500 rounded-lg"
                autoFocus
                disabled={isSubmitting}
              />
            </div>
          )}
        </div>

        {/* Expanded Actions */}
        {isExpanded && (
          <div className="space-y-3">
            {/* Media Options */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors duration-200 p-2 rounded-lg hover:bg-green-50 min-h-[44px] touch-manipulation">
                  <Image className="h-5 w-5" />
                  <span className="text-sm font-medium hidden sm:inline">Photo</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded-lg hover:bg-blue-50 min-h-[44px] touch-manipulation">
                  <Camera className="h-5 w-5" />
                  <span className="text-sm font-medium hidden sm:inline">Camera</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsExpanded(false);
                    setContent("");
                  }}
                  disabled={isSubmitting}
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 min-h-[44px] px-4 touch-manipulation"
                >
                  Cancel
                </Button>
                
                <Button
                  onClick={handlePostSubmit}
                  disabled={!content.trim() || isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 min-h-[44px] touch-manipulation disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="hidden sm:inline">Posting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="h-4 w-4" />
                      <span>Post</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {/* Quick tip for mobile */}
            <p className="text-xs text-gray-400 text-center sm:hidden">
              Tip: Press Cmd+Enter (iOS) or Ctrl+Enter (Android) to post quickly
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export const FacebookCreatePost = memo(FacebookCreatePostComponent);
