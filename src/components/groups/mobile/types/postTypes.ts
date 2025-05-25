
import type { Database } from "@/integrations/supabase/types";
import type { Profile } from "../../posts/hooks/types/groupPostTypes";

export interface PostData {
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
}

export interface PostEditorState {
  isEditing: boolean;
  currentPostId: string | null;
  editableContent: string;
  isSubmitting: boolean;
}

export interface PostActions {
  onStartEditing: (postId: string, content: string) => void;
  onCancelEditing: () => void;
  onSaveEditing: () => void;
  onDeleteClick: (postId: string) => void;
}

export interface PostReactionCounts {
  thumbsUpCount: number;
  thumbsDownCount: number;
  heartCount: number;
  isThumbsUpActive: boolean;
  isThumbsDownActive: boolean;
  isHeartActive: boolean;
  isThumbsUpSubmitting: boolean;
  isThumbsDownSubmitting: boolean;
  isHeartSubmitting: boolean;
}

export interface PostReactionHandlers {
  onThumbsUpClick: () => void;
  onThumbsDownClick: () => void;
  onHeartClick: () => void;
}
