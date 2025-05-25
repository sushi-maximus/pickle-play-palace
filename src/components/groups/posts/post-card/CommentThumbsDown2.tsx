
import { Button } from "@/components/ui/button";
import { ThumbsDown } from "lucide-react";

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
      className={`min-h-[44px] min-w-[44px] px-2 flex items-center gap-1 transition-all duration-200 text-xs touch-manipulation ${
        isActive ? "text-red-500 bg-red-50 hover:bg-red-100" : "text-gray-500 hover:text-red-500 hover:bg-red-50"
      }`}
      onClick={onClick}
      disabled={disabled || isSubmitting}
    >
      {isSubmitting ? (
        <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <ThumbsDown className={`h-3 w-3 ${isActive ? "fill-current" : ""}`} />
      )}
      {count > 0 && (
        <span className="text-xs font-medium">
          {count}
        </span>
      )}
    </Button>
  );
};
