
import { memo } from "react";
import { MessageCircle, Users, PlusCircle } from "lucide-react";

interface FacebookEmptyStateProps {
  type: 'posts' | 'comments' | 'members';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  showAction?: boolean;
}

const FacebookEmptyStateComponent = ({
  type,
  title,
  description,
  actionText,
  onAction,
  showAction = true
}: FacebookEmptyStateProps) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'posts':
        return {
          icon: <MessageCircle className="h-12 w-12 text-gray-400" />,
          title: title || 'No posts yet',
          description: description || 'Be the first to share something with your group!',
          actionText: actionText || 'Create First Post'
        };
      case 'comments':
        return {
          icon: <MessageCircle className="h-8 w-8 text-gray-400" />,
          title: title || 'No comments yet',
          description: description || 'Be the first to comment on this post!',
          actionText: actionText || 'Add Comment'
        };
      case 'members':
        return {
          icon: <Users className="h-12 w-12 text-gray-400" />,
          title: title || 'No members yet',
          description: description || 'Invite people to join your group!',
          actionText: actionText || 'Invite Members'
        };
      default:
        return {
          icon: <PlusCircle className="h-12 w-12 text-gray-400" />,
          title: title || 'Nothing here yet',
          description: description || 'Get started by adding some content!',
          actionText: actionText || 'Get Started'
        };
    }
  };

  const content = getDefaultContent();
  const isCompact = type === 'comments';

  return (
    <div className={`text-center animate-fade-in ${isCompact ? 'py-4' : 'py-8'}`}>
      <div className="flex flex-col items-center space-y-3">
        <div className={`${isCompact ? 'w-10 h-10' : 'w-16 h-16'} bg-gray-100 rounded-full flex items-center justify-center`}>
          {content.icon}
        </div>
        <div>
          <h3 className={`font-medium text-gray-900 mb-1 ${isCompact ? 'text-sm' : 'text-lg'}`}>
            {content.title}
          </h3>
          <p className={`text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'} ${isCompact ? 'mb-2' : 'mb-4'}`}>
            {content.description}
          </p>
          {showAction && onAction && (
            <button
              onClick={onAction}
              className={`inline-flex items-center bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 active:scale-95 touch-manipulation ${
                isCompact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
              }`}
            >
              <PlusCircle className={`mr-2 ${isCompact ? 'h-3 w-3' : 'h-4 w-4'}`} />
              {content.actionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const FacebookEmptyState = memo(FacebookEmptyStateComponent);
