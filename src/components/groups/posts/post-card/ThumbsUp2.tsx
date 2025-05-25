
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
      className={`h-11 w-auto px-3 md:h-12 md:px-4 flex items-center gap-2 transition-all duration-200 text-sm ${
        isActive ? "text-blue-500 bg-blue-50 hover:bg-blue-100" : "text-gray-600 hover:text-blue-500 hover:bg-blue-50"
      }`}
      onClick={onClick}
      disabled={disabled || isSubmitting}
    >
      {isSubmitting ? (
        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <ThumbsUp className={`h-4 w-4 ${isActive ? "fill-current" : ""}`} />
      )}
      <span className="text-sm font-medium">
        {count > 0 ? count : ""}
      </span>
    </Button>
  );
};
