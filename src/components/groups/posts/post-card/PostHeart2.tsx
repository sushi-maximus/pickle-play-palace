
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
      className={`h-11 w-auto px-3 md:h-12 md:px-4 flex items-center gap-2 transition-all duration-200 text-sm ${
        isActive ? "text-red-500 bg-red-50 hover:bg-red-100" : "text-gray-600 hover:text-red-500 hover:bg-red-50"
      }`}
      onClick={handleClick}
      disabled={disabled || isSubmitting}
    >
      {isSubmitting ? (
        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <Heart className={`h-4 w-4 ${isActive ? "fill-current" : ""}`} />
      )}
      <span className="text-sm font-medium">
        {count > 0 ? count : ""}
      </span>
    </Button>
  );
};
