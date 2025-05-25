
import { ThumbsUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      onClick={onClick}
      disabled={disabled || isSubmitting}
      className={`min-h-[48px] min-w-[48px] h-12 px-3 py-2 transition-all duration-200 touch-manipulation ${
        isActive
          ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
      }`}
    >
      <div className="flex items-center gap-1.5">
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ThumbsUp className={`h-4 w-4 transition-all duration-200 ${isActive ? "fill-current" : ""}`} />
        )}
        {count > 0 && (
          <span className="text-sm font-medium min-w-[1ch]">
            {count}
          </span>
        )}
      </div>
    </Button>
  );
};
