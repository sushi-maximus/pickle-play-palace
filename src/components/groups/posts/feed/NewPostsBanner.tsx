
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewPostsBannerProps {
  show: boolean;
  onScrollToTop: () => void;
  className?: string;
}

const NewPostsBannerComponent = ({ 
  show, 
  onScrollToTop, 
  className 
}: NewPostsBannerProps) => {
  if (!show) return null;

  return (
    <div 
      className={cn(
        "fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out",
        "bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg border border-blue-600",
        "hover:bg-blue-600 cursor-pointer",
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
        className
      )}
      onClick={onScrollToTop}
    >
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:text-white hover:bg-transparent p-0 h-auto"
        onClick={onScrollToTop}
      >
        <ArrowUp className="h-4 w-4 mr-2" />
        <span className="text-sm font-medium">New posts available</span>
      </Button>
    </div>
  );
};

export const NewPostsBanner = memo(NewPostsBannerComponent);
