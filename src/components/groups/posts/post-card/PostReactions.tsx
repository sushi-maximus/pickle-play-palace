
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, ThumbsDown } from "lucide-react";
import { PostReactionType } from "../hooks/usePostReactions";

interface PostReactionsProps {
  reactions: Record<PostReactionType, number>;
  userReactions: Record<PostReactionType, boolean>;
  isSubmitting: Record<PostReactionType, boolean>;
  onReactionToggle: (type: PostReactionType) => void;
  currentUserId?: string;
}

interface ReactionButtonProps {
  type: PostReactionType;
  Icon: React.ComponentType<{ className?: string }>;
  count: number;
  isActive: boolean;
  isDisabled: boolean;
  activeColor: string;
  onClick: () => void;
}

const ReactionButton = ({ 
  type, 
  Icon, 
  count, 
  isActive, 
  isDisabled, 
  activeColor, 
  onClick 
}: ReactionButtonProps) => (
  <Button 
    variant="ghost" 
    size="sm" 
    className={`flex items-center gap-1 ${isActive ? activeColor : ""}`}
    onClick={onClick}
    disabled={isDisabled}
  >
    <Icon className={`h-4 w-4 ${isActive ? `fill-current` : ""}`} />
    <span>{count > 0 ? count : ''}</span>
  </Button>
);

export const PostReactions = ({
  reactions,
  userReactions,
  isSubmitting,
  onReactionToggle,
  currentUserId
}: PostReactionsProps) => {
  const isDisabled = !currentUserId;

  return (
    <div className="flex gap-4 relative z-10">
      <ReactionButton
        type="thumbsup"
        Icon={ThumbsUp}
        count={reactions.thumbsup}
        isActive={userReactions.thumbsup}
        isDisabled={isDisabled || isSubmitting.thumbsup}
        activeColor="text-blue-500"
        onClick={() => onReactionToggle("thumbsup")}
      />
      
      <ReactionButton
        type="thumbsdown"
        Icon={ThumbsDown}
        count={reactions.thumbsdown}
        isActive={userReactions.thumbsdown}
        isDisabled={isDisabled || isSubmitting.thumbsdown}
        activeColor="text-red-500"
        onClick={() => onReactionToggle("thumbsdown")}
      />

      <ReactionButton
        type="like"
        Icon={Heart}
        count={reactions.like}
        isActive={userReactions.like}
        isDisabled={isDisabled || isSubmitting.like}
        activeColor="text-red-500"
        onClick={() => onReactionToggle("like")}
      />
    </div>
  );
};
