
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
      className={`min-h-[48px] min-w-[48px] px-3 md:px-4 flex items-center gap-2 transition-all duration-200 text-sm font-medium touch-manipulation ${
        isActive 
          ? "text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700" 
          : "text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
      }`}
      onClick={onClick}
      disabled={disabled || isSubmitting}
    >
      {isSubmitting ? (
        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <ThumbsUp className={`h-4 w-4 transition-all duration-200 ${isActive ? "fill-current" : ""}`} />
      )}
      <span className="text-sm font-medium">
        {count > 0 ? count : ""}
      </span>
    </Button>
  );
};
