
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PostContent } from "../posts/post-card/PostContent";
import { CommentsSection2 } from "../posts/post-card/CommentsSection2";
import { DeletePostDialog } from "../posts/post-card/DeletePostDialog";
import { usePostReactions2 } from "../posts/hooks/usePostReactions2";
import { useComments2 } from "../posts/hooks/useComments2";
import { MobilePostHeader } from "./components/MobilePostHeader";
import { MobilePostActions } from "./components/MobilePostActions";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface MobilePostCard2Props {
  post: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    media_urls?: string[] | null;
    thumbsup_count?: number;
    thumbsdown_count?: number;
    heart_count?: number;
    user_thumbsup?: boolean;
    user_thumbsdown?: boolean;
    user_heart?: boolean;
    profiles?: {
      first_name: string;
      last_name: string;
      avatar_url?: string | null;
    };
  };
  user?: Profile | null;
  isEditing: boolean;
  currentPostId: string | null;
  editableContent: string;
  setEditableContent: (content: string) => void;
  isEditSubmitting: boolean;
  onStartEditing: (postId: string, content: string) => void;
  onCancelEditing: () => void;
  onSaveEditing: () => void;
  onDeleteClick: (postId: string) => void;
}

export const MobilePostCard2 = ({ 
  post, 
  user,
  isEditing,
  currentPostId,
  editableContent,
  setEditableContent,
  isEditSubmitting,
  onStartEditing,
  onCancelEditing,
  onSaveEditing,
  onDeleteClick
}: MobilePostCard2Props) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // CRITICAL DEBUG - Log the exact post data we're receiving
  console.log(`🔍 === POST ${post.id} RAW DATA INSPECTION ===`);
  console.log('Complete post object:', JSON.stringify(post, null, 2));
  console.log('Heart specific data:', {
    heart_count: post.heart_count,
    user_heart: post.user_heart,
    heart_count_type: typeof post.heart_count,
    user_heart_type: typeof post.user_heart
  });
  console.log('User data:', {
    userId: user?.id,
    userExists: !!user
  });

  // CRITICAL DEBUG - Log what we're passing to the hook
  const hookParams = {
    postId: post.id,
    userId: user?.id,
    initialThumbsUp: post.thumbsup_count || 0,
    initialThumbsDown: post.thumbsdown_count || 0,
    initialHeart: post.heart_count || 0,
    initialUserThumbsUp: post.user_thumbsup || false,
    initialUserThumbsDown: post.user_thumbsdown || false,
    initialUserHeart: post.user_heart || false
  };
  
  console.log(`🔧 === HOOK PARAMETERS FOR POST ${post.id} ===`);
  console.log('Hook params:', JSON.stringify(hookParams, null, 2));

  const {
    thumbsUpCount,
    thumbsDownCount,
    heartCount,
    isThumbsUpActive,
    isThumbsDownActive,
    isHeartActive,
    isThumbsUpSubmitting,
    isThumbsDownSubmitting,
    isHeartSubmitting,
    toggleThumbsUp,
    toggleThumbsDown,
    toggleHeart
  } = usePostReactions2(hookParams);

  // CRITICAL DEBUG - Log what the hook returned
  console.log(`📊 === HOOK RESULTS FOR POST ${post.id} ===`);
  console.log('Hook returned values:', {
    heartCount,
    isHeartActive,
    isHeartSubmitting,
    toggleHeartType: typeof toggleHeart,
    toggleHeartExists: !!toggleHeart
  });

  const { comments, refreshComments } = useComments2({
    postId: post.id,
    userId: user?.id
  });

  const handleEdit = () => {
    onStartEditing(post.id, post.content);
  };

  const handleSaveEditing = () => {
    if (editableContent.trim() && editableContent !== post.content) {
      onSaveEditing();
    } else {
      onCancelEditing();
    }
  };

  const handleCancelEditing = () => {
    setEditableContent(post.content);
    onCancelEditing();
  };

  const handleDeleteClick = () => {
    onDeleteClick(post.id);
    setShowDeleteDialog(false);
  };

  // CRITICAL DEBUG - Heart click handler with extensive logging
  const handleHeartClick = () => {
    console.log(`💗 === HEART CLICK HANDLER FOR POST ${post.id} ===`);
    console.log('Click handler called with state:', {
      heartCount,
      isHeartActive,
      isHeartSubmitting,
      userId: user?.id,
      postId: post.id
    });
    
    if (!user?.id) {
      console.log('❌ HEART CLICK BLOCKED: No user ID');
      return;
    }
    
    if (isHeartSubmitting) {
      console.log('❌ HEART CLICK BLOCKED: Already submitting');
      return;
    }
    
    console.log('✅ HEART CLICK PROCEEDING: Calling toggleHeart...');
    try {
      toggleHeart();
      console.log('✅ HEART CLICK: toggleHeart called successfully');
    } catch (error) {
      console.error('❌ HEART CLICK ERROR:', error);
    }
  };

  return (
    <Card className="w-full border-0 shadow-sm bg-blue-50 rounded-lg overflow-hidden">
      <CardContent className="p-0">
        <MobilePostHeader
          post={post}
          currentUserId={user?.id}
          isEditing={isEditing}
          isDeleting={false}
          onEdit={handleEdit}
          onDeleteClick={() => setShowDeleteDialog(true)}
        />

        <div className="px-3 md:px-4 pb-3">
          <PostContent
            content={post.content}
            mediaUrls={post.media_urls}
            isEditing={isEditing}
            editableContent={editableContent}
            setEditableContent={setEditableContent}
            onCancelEditing={handleCancelEditing}
            onSaveEditing={handleSaveEditing}
            isEditSubmitting={isEditSubmitting}
          />
        </div>

        <MobilePostActions
          thumbsUpCount={thumbsUpCount}
          thumbsDownCount={thumbsDownCount}
          heartCount={heartCount}
          isThumbsUpActive={isThumbsUpActive}
          isThumbsDownActive={isThumbsDownActive}
          isHeartActive={isHeartActive}
          isThumbsUpSubmitting={isThumbsUpSubmitting}
          isThumbsDownSubmitting={isThumbsDownSubmitting}
          isHeartSubmitting={isHeartSubmitting}
          onThumbsUpClick={toggleThumbsUp}
          onThumbsDownClick={toggleThumbsDown}
          onHeartClick={handleHeartClick}
          showComments={showComments}
          onToggleComments={() => setShowComments(!showComments)}
          currentUserId={user?.id}
          commentsCount={comments?.length || 0}
        />

        {showComments && (
          <CommentsSection2
            postId={post.id}
            currentUserId={user?.id}
            user={user}
          />
        )}
      </CardContent>
      
      <DeletePostDialog
        isOpen={showDeleteDialog}
        onOpenChange={(open) => !open && setShowDeleteDialog(false)}
        onConfirmDelete={handleDeleteClick}
        isDeleting={false}
      />
    </Card>
  );
};
