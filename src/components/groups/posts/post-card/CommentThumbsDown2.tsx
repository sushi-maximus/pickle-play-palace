
import { Button } from "@/components/ui/button";
import { ThumbsDown, Loader2 } from "lucide-react";

interface CommentThumbsDown2Props {
  count: number;
  isActive: boolean;
  isSubmitting: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const CommentThumbsDown2 = ({
  count,
  isActive,
  isSubmitting,
  onClick,
  disabled = false
}: CommentThumbsDown2Props) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled || isSubmitting}
      className={`min-h-[48px] min-w-[48px] px-2 py-2 transition-all duration-200 touch-manipulation ${
        isActive 
          ? "text-red-600 bg-red-50 hover:bg-red-100" 
          : "text-gray-500 hover:text-red-600 hover:bg-red-50"
      }`}
    >
      <div className="flex items-center gap-1">
        {isSubmitting ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <ThumbsDown className={`h-3 w-3 transition-all duration-200 ${isActive ? "fill-current" : ""}`} />
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
