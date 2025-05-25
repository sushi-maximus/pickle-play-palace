
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
    <div className="bg-white border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="p-4">
        <div className="flex space-x-3">
          {/* User Avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex-shrink-0 animate-scale-in"></div>
          
          {/* Post Input Area */}
          <div className="flex-1">
            {!isExpanded ? (
              /* Collapsed State */
              <button
                onClick={handleInputClick}
                className="w-full bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-3 text-left text-gray-500 transition-all duration-200 hover:shadow-sm active:scale-[0.99]"
              >
                What's on your mind, {user.first_name}?
              </button>
            ) : (
              /* Expanded State */
              <div className="animate-fade-in">
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`What's on your mind, ${user.first_name}?`}
                    className="w-full border-0 p-0 text-lg placeholder-gray-500 focus:ring-0 focus:outline-none resize-none bg-transparent transition-all duration-200"
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
                        className="flex items-center space-x-2 text-gray-500 hover:text-green-600 hover:bg-green-50 px-2 py-1 rounded transition-all duration-200 active:scale-95"
                      >
                        <Camera className="h-5 w-5 text-green-500 transition-all duration-200 hover:scale-110" />
                        <span className="text-sm font-medium">Photo/Video</span>
                      </button>
                      
                      <button
                        type="button"
                        className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-all duration-200 active:scale-95"
                      >
                        <Image className="h-5 w-5 text-blue-500 transition-all duration-200 hover:scale-110" />
                        <span className="text-sm font-medium">Image</span>
                      </button>
                      
                      <button
                        type="button"
                        className="flex items-center space-x-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 px-2 py-1 rounded transition-all duration-200 active:scale-95"
                      >
                        <Smile className="h-5 w-5 text-yellow-500 transition-all duration-200 hover:scale-110" />
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
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200 disabled:opacity-50 active:scale-95"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !content.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md active:scale-95"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Posting...
                          </span>
                        ) : (
                          "Post"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FacebookCreatePost = memo(FacebookCreatePostComponent);
