
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";

interface CommentThumbsUp2Props {
  count: number;
  isActive: boolean;
  isSubmitting: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const CommentThumbsUp2 = ({
  count,
  isActive,
  isSubmitting,
  onClick,
  disabled = false
}: CommentThumbsUp2Props) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-8 w-auto px-2 flex items-center gap-1 transition-all duration-200 text-xs ${
        isActive ? "text-blue-500 bg-blue-50 hover:bg-blue-100" : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
      }`}
      onClick={onClick}
      disabled={disabled || isSubmitting}
    >
      {isSubmitting ? (
        <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <ThumbsUp className={`h-3 w-3 ${isActive ? "fill-current" : ""}`} />
      )}
      {count > 0 && (
        <span className="text-xs font-medium">
          {count}
        </span>
      )}
    </Button>
  );
};
