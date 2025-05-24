
import { cn } from "@/lib/utils";
import { SkeletonVariants } from "./SkeletonVariants";

interface LoadingContainerProps {
  isLoading: boolean;
  children: React.ReactNode;
  skeleton?: "card" | "text" | "list" | "form";
  skeletonCount?: number;
  className?: string;
  loadingClassName?: string;
}

export const LoadingContainer = ({
  isLoading,
  children,
  skeleton = "card",
  skeletonCount = 1,
  className,
  loadingClassName
}: LoadingContainerProps) => {
  if (isLoading) {
    return (
      <div className={cn("animate-pulse", loadingClassName, className)}>
        <SkeletonVariants 
          variant={skeleton} 
          count={skeletonCount}
        />
      </div>
    );
  }

  return <div className={className}>{children}</div>;
};
