
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonLoaderProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const ButtonLoader = ({ 
  isLoading, 
  loadingText, 
  children, 
  className,
  size = "md"
}: ButtonLoaderProps) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Loader2 className={cn("animate-spin", sizeClasses[size])} />
        <span>{loadingText || "Loading..."}</span>
      </div>
    );
  }

  return <>{children}</>;
};
