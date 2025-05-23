
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";

interface ThumbsUp2Props {
  count: number;
  isActive: boolean;
  isSubmitting: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const ThumbsUp2 = ({
  count,
  isActive,
  isSubmitting,
  onClick,
  disabled = false
}: ThumbsUp2Props) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-8 w-auto px-2 md:h-9 md:px-3 flex items-center gap-1 md:gap-2 transition-colors ${
        isActive ? "text-blue-500 bg-blue-50 hover:bg-blue-100" : "text-gray-600 hover:text-blue-500 hover:bg-blue-50"
      }`}
      onClick={onClick}
      disabled={disabled || isSubmitting}
    >
      {isSubmitting ? (
        <div className="h-3 w-3 md:h-4 md:w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <ThumbsUp className={`h-3 w-3 md:h-4 md:w-4 ${isActive ? "fill-current" : ""}`} />
      )}
      <span className="text-xs md:text-sm font-medium">
        {count > 0 ? count : ""}
      </span>
    </Button>
  );
};
