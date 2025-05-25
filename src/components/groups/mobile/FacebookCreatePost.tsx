
import { memo, useState } from "react";
import { Camera, Image, Smile } from "lucide-react";
import { useCreatePost2 } from "../posts/hooks/useCreatePost2";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface FacebookCreatePostProps {
  groupId: string;
  user: Profile | null;
  onPostCreated?: () => void;
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
    isSubmitting,
    handleSubmit
  } = useCreatePost2({
    groupId,
    userId: user?.id,
    onPostCreated: () => {
      setIsExpanded(false);
      onPostCreated?.();
    }
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };

  const handleInputClick = () => {
    setIsExpanded(true);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="p-4">
        <div className="flex space-x-3">
          {/* User Avatar */}
          <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
          
          {/* Post Input Area */}
          <div className="flex-1">
            {!isExpanded ? (
              /* Collapsed State */
              <button
                onClick={handleInputClick}
                className="w-full bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-3 text-left text-gray-500 transition-colors"
              >
                What's on your mind, {user.first_name}?
              </button>
            ) : (
              /* Expanded State */
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`What's on your mind, ${user.first_name}?`}
                  className="w-full border-0 p-0 text-lg placeholder-gray-500 focus:ring-0 focus:outline-none resize-none bg-transparent"
                  rows={3}
                  disabled={isSubmitting}
                  autoFocus
                />
                
                {/* Action Buttons Row */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  {/* Media Options */}
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Camera className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium">Photo/Video</span>
                    </button>
                    
                    <button
                      type="button"
                      className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Image className="h-5 w-5 text-blue-500" />
                      <span className="text-sm font-medium">Image</span>
                    </button>
                    
                    <button
                      type="button"
                      className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Smile className="h-5 w-5 text-yellow-500" />
                      <span className="text-sm font-medium">Feeling</span>
                    </button>
                  </div>

                  {/* Post Button */}
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsExpanded(false);
                        setContent("");
                      }}
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !content.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? "Posting..." : "Post"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FacebookCreatePost = memo(FacebookCreatePostComponent);
