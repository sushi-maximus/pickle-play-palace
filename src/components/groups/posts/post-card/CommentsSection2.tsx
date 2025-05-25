
import { Button } from "@/components/ui/button";
import { OptimizedScrollArea } from "@/components/ui/OptimizedScrollArea";
import { Comment2 } from "./Comment2";
import { FacebookExpandingCommentForm } from "../../mobile/FacebookExpandingCommentForm";
import { useComments2 } from "../hooks/useComments2";
import type { Profile } from "../hooks/types/groupPostTypes";

interface CommentsSection2Props {
  postId: string;
  currentUserId?: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
}

export const CommentsSection2 = ({ postId, currentUserId, user }: CommentsSection2Props) => {
  const { comments, loading, refreshComments } = useComments2({
    postId,
    userId: currentUserId
  });

  const handleCommentUpdate = () => {
    refreshComments();
  };

  // Convert the simplified user object to Profile type for the form
  const profileUser: Profile | undefined = user ? {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    avatar_url: user.avatar_url,
    // Add required Profile fields with default values
    birthday: null,
    created_at: new Date().toISOString(),
    dupr_profile_link: null,
    dupr_rating: null,
    gender: 'Male' as const,
    phone_number: null,
    skill_level: '2.5',
    updated_at: new Date().toISOString()
  } : undefined;

  if (loading) {
    return (
      <div className="border-t border-gray-100 bg-gray-50/30">
        <div className="flex items-center justify-center py-6">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Loading comments...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-100 bg-gray-50/30">
      {comments && comments.length > 0 && (
        <OptimizedScrollArea 
          className="max-h-[50vh]"
          enableHardwareAcceleration={true}
        >
          <div className="divide-y divide-gray-100/50">
            {comments.map((comment) => (
              <Comment2
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                onCommentUpdate={handleCommentUpdate}
              />
            ))}
          </div>
        </OptimizedScrollArea>
      )}
      
      {currentUserId && profileUser && (
        <div className="border-t border-gray-100/50 bg-white">
          <FacebookExpandingCommentForm
            postId={postId}
            user={profileUser}
            onCommentAdded={handleCommentUpdate}
          />
        </div>
      )}
    </div>
  );
};
