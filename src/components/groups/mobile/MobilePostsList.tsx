
import { MobilePostCard2 } from "./MobilePostCard2";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  media_urls?: string[] | null;
  profiles?: {
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
}

interface MobilePostsListProps {
  posts: Post[];
  user: Profile | null;
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

export const MobilePostsList = ({
  posts,
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
}: MobilePostsListProps) => {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 md:space-y-6 p-4 md:p-6 max-w-4xl mx-auto">
        {posts.map((post) => (
          <MobilePostCard2
            key={post.id}
            post={post}
            user={user}
            isEditing={isEditing && currentPostId === post.id}
            currentPostId={currentPostId}
            editableContent={editableContent}
            setEditableContent={setEditableContent}
            isEditSubmitting={isEditSubmitting}
            onStartEditing={onStartEditing}
            onCancelEditing={onCancelEditing}
            onSaveEditing={onSaveEditing}
            onDeleteClick={onDeleteClick}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
