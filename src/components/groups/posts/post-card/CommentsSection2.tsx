
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface CommentsSection2Props {
  commentsCount: number;
  onToggleComments?: () => void;
}

export const CommentsSection2 = ({
  commentsCount,
  onToggleComments
}: CommentsSection2Props) => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="flex items-center gap-1 text-xs md:text-sm px-2 py-1 h-auto text-gray-500 hover:text-gray-700"
      onClick={onToggleComments}
    >
      <MessageCircle className="h-3 w-3 md:h-4 md:w-4" />
      {commentsCount > 0 && <span>{commentsCount}</span>}
      <span className="hidden sm:inline">Comments</span>
    </Button>
  );
};
