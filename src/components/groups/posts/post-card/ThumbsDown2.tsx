
import { Button } from "@/components/ui/button";
import { ThumbsDown } from "lucide-react";

interface ThumbsDown2Props {
  count: number;
  isActive: boolean;
  isSubmitting: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const ThumbsDown2 = ({
  count,
  isActive,
  isSubmitting,
  onClick,
  disabled = false
}: ThumbsDown2Props) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-11 w-auto px-3 md:h-12 md:px-4 flex items-center gap-2 transition-all duration-200 text-sm ${
        isActive ? "text-red-500 bg-red-50 hover:bg-red-100" : "text-gray-600 hover:text-red-500 hover:bg-red-50"
      }`}
      onClick={onClick}
      disabled={disabled || isSubmitting}
    >
      {isSubmitting ? (
        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <ThumbsDown className={`h-4 w-4 ${isActive ? "fill-current" : ""}`} />
      )}
      <span className="text-sm font-medium">
        {count > 0 ? count : ""}
      </span>
    </Button>
  );
};
