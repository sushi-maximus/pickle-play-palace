
import { ThumbsUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { useTouchFeedback } from "@/hooks/useTouchFeedback";

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
  const debouncedClick = useDebounce(onClick, { delay: 250, leading: true });
  const { isPressed, touchProps } = useTouchFeedback({ feedbackDuration: 100 });

  const handleClick = () => {
    if (disabled || isSubmitting) return;
    debouncedClick();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={disabled || isSubmitting}
      {...touchProps}
      className={`min-h-[52px] min-w-[52px] px-4 py-3 transition-all duration-200 touch-manipulation active:scale-95 ${
        isPressed ? 'scale-95 bg-opacity-80' : ''
      } ${
        isActive
          ? "text-blue-600 bg-blue-50 hover:bg-blue-100 active:bg-blue-200"
          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100"
      }`}
    >
      <div className="flex items-center gap-2">
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ThumbsUp className={`h-5 w-5 transition-all duration-200 ${isActive ? "fill-current" : ""}`} />
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
