
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
    console.log(`=== POST HEART COMPONENT CLICK ===`);
    console.log('Heart button clicked with state:', {
      count,
      isActive,
      isSubmitting,
      disabled
    });
    onClick();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-8 w-auto px-2 md:h-9 md:px-3 flex items-center gap-1 md:gap-2 transition-colors text-xs md:text-sm ${
        isActive ? "text-red-500 bg-red-50 hover:bg-red-100" : "text-gray-600 hover:text-red-500 hover:bg-red-50"
      }`}
      onClick={handleClick}
      disabled={disabled || isSubmitting}
    >
      {isSubmitting ? (
        <div className="h-3 w-3 md:h-4 md:w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <Heart className={`h-3 w-3 md:h-4 md:w-4 ${isActive ? "fill-current" : ""}`} />
      )}
      <span className="text-xs md:text-sm font-medium">
        {count > 0 ? count : ""}
      </span>
    </Button>
  );
};
