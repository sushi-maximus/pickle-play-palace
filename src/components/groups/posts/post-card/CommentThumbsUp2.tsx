
import { Button } from "@/components/ui/button";
import { ThumbsUp, Loader2 } from "lucide-react";

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
      onClick={onClick}
      disabled={disabled || isSubmitting}
      className={`min-h-[44px] min-w-[44px] h-11 px-2 py-2 transition-all duration-200 touch-manipulation ${
        isActive 
          ? "text-blue-600 bg-blue-50 hover:bg-blue-100" 
          : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
      }`}
    >
      <div className="flex items-center gap-1">
        {isSubmitting ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <ThumbsUp className={`h-3 w-3 transition-all duration-200 ${isActive ? "fill-current" : ""}`} />
        )}
        {count > 0 && (
          <span className="text-xs font-medium min-w-[1ch]">
            {count}
          </span>
        )}
      </div>
    </Button>
  );
};
