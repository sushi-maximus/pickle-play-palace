
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface PostHeart2Props {
  count: number;
  isActive: boolean;
  isSubmitting: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const PostHeart2 = ({
  count,
  isActive,
  isSubmitting,
  onClick,
  disabled = false
}: PostHeart2Props) => {
  const handleClick = () => {
    if (disabled || isSubmitting) {
      return;
    }
    onClick();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`min-h-[48px] min-w-[48px] px-3 md:px-4 flex items-center gap-2 transition-all duration-200 text-sm font-medium touch-manipulation ${
        isActive 
          ? "text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700" 
          : "text-muted-foreground hover:text-red-600 hover:bg-red-50"
      }`}
      onClick={handleClick}
      disabled={disabled || isSubmitting}
    >
      {isSubmitting ? (
        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <Heart className={`h-4 w-4 transition-all duration-200 ${isActive ? "fill-current" : ""}`} />
      )}
      <span className="text-sm font-medium">
        {count > 0 ? count : ""}
      </span>
    </Button>
  );
};
