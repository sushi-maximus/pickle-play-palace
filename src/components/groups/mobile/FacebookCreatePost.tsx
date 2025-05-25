
import { memo, useState } from "react";
import { Camera, Image, Smile, AlertCircle } from "lucide-react";
import { useCreatePost2 } from "../posts/hooks/useCreatePost2";
import { FacebookErrorBoundary } from "./FacebookErrorBoundary";
import { FacebookErrorState } from "./FacebookErrorState";
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
  const [hasError, setHasError] = useState(false);
  const [localError, setLocalError] = useState<string>('');

  // Validate required props
  if (!groupId) {
    return (
      <FacebookErrorState
        title="Invalid Group"
        description="Cannot create post: group information is missing."
        showRetry={false}
      />
    );
  }

  const {
    content,
    setContent,
    isSubmitting,
    handleSubmit,
    error: submitError
  } = useCreatePost2({
    groupId,
    userId: user?.id,
    onPostCreated: () => {
      setIsExpanded(false);
      setLocalError('');
      onPostCreated?.();
    }
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    
    // Validate content
    if (!content?.trim()) {
      setLocalError('Please enter some content for your post.');
      return;
    }

    if (content.trim().length > 5000) {
      setLocalError('Post content is too long. Please keep it under 5000 characters.');
      return;
    }

    try {
      await handleSubmit();
    } catch (error) {
      console.error('Error creating post:', error);
      setLocalError('Failed to create post. Please try again.');
    }
  };

  const handleInputClick = () => {
    if (!user) {
      setLocalError('You must be logged in to create a post.');
      return;
    }
    setIsExpanded(true);
    setLocalError('');
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setContent("");
    setLocalError('');
  };

  if (!user) {
    return (
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="text-center py-4">
          <p className="text-gray-600 text-sm mb-2">Please log in to create posts</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <FacebookErrorState
        title="Error Loading Post Creator"
        description="There was a problem loading the post creation form."
        onRetry={() => setHasError(false)}
      />
    );
  }

  const displayError = localError || submitError?.message;
  const userName = user.first_name || 'User';

  return (
    <FacebookErrorBoundary
      onError={(error) => {
        console.error('Create post error:', error);
        setHasError(true);
      }}
    >
      <div className="bg-white border-b border-gray-200 shadow-sm transition-all duration-300">
        <div className="p-3 sm:p-4">
          {/* Error Display */}
          {displayError && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md flex items-start space-x-2 animate-fade-in">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-700">{displayError}</p>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            {/* User Avatar - Responsive sizing */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex-shrink-0 animate-scale-in"></div>
            
            {/* Post Input Area */}
            <div className="flex-1 min-w-0">
              {!isExpanded ? (
                /* Collapsed State - Enhanced for mobile */
                <button
                  onClick={handleInputClick}
                  disabled={isSubmitting}
                  className="w-full bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-3 text-left text-gray-500 transition-all duration-200 hover:shadow-sm active:scale-[0.99] min-h-[44px] touch-manipulation text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  What's on your mind, {userName}?
                </button>
              ) : (
                /* Expanded State - Enhanced for mobile */
                <div className="animate-fade-in">
                  <form onSubmit={handleFormSubmit} className="space-y-3">
                    <textarea
                      value={content}
                      onChange={(e) => {
                        setContent(e.target.value);
                        setLocalError(''); // Clear error when user types
                      }}
                      placeholder={`What's on your mind, ${userName}?`}
                      className="w-full border-0 p-0 text-base sm:text-lg placeholder-gray-500 focus:ring-0 focus:outline-none resize-none bg-transparent transition-all duration-200 min-h-[80px] touch-manipulation"
                      rows={3}
                      disabled={isSubmitting}
                      autoFocus
                      maxLength={5000}
                    />
                    
                    {/* Character Counter */}
                    {content && (
                      <div className="text-right">
                        <span className={`text-xs ${
                          content.length > 4500 ? 'text-red-500' : 'text-gray-400'
                        }`}>
                          {content.length}/5000
                        </span>
                      </div>
                    )}
                    
                    {/* Action Buttons Row - Mobile optimized */}
                    <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between pt-3 border-t border-gray-100">
                      {/* Media Options - Responsive layout */}
                      <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto">
                        <button
                          type="button"
                          disabled={isSubmitting}
                          className="flex items-center space-x-2 text-gray-500 hover:text-green-600 hover:bg-green-50 px-2 py-1 rounded transition-all duration-200 active:scale-95 min-h-[36px] touch-manipulation whitespace-nowrap disabled:opacity-50"
                        >
                          <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 transition-all duration-200 hover:scale-110" />
                          <span className="text-xs sm:text-sm font-medium">Photo/Video</span>
                        </button>
                        
                        <button
                          type="button"
                          disabled={isSubmitting}
                          className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-all duration-200 active:scale-95 min-h-[36px] touch-manipulation whitespace-nowrap disabled:opacity-50"
                        >
                          <Image className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 transition-all duration-200 hover:scale-110" />
                          <span className="text-xs sm:text-sm font-medium">Image</span>
                        </button>
                        
                        <button
                          type="button"
                          disabled={isSubmitting}
                          className="flex items-center space-x-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 px-2 py-1 rounded transition-all duration-200 active:scale-95 min-h-[36px] touch-manipulation whitespace-nowrap disabled:opacity-50"
                        >
                          <Smile className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 transition-all duration-200 hover:scale-110" />
                          <span className="text-xs sm:text-sm font-medium">Feeling</span>
                        </button>
                      </div>

                      {/* Post Button - Mobile optimized */}
                      <div className="flex items-center space-x-2 justify-end">
                        <button
                          type="button"
                          onClick={handleCancel}
                          disabled={isSubmitting}
                          className="px-3 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200 disabled:opacity-50 active:scale-95 min-h-[36px] touch-manipulation"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting || !content?.trim()}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md active:scale-95 min-h-[36px] touch-manipulation"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center">
                              <div className="animate-spin h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
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
    </FacebookErrorBoundary>
  );
};

export const FacebookCreatePost = memo(FacebookCreatePostComponent);
