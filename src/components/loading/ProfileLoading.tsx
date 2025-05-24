
import { SkeletonVariants } from "@/components/ui/SkeletonVariants";

export const ProfileLoading = () => {
  return (
    <div className="space-y-6">
      {/* Desktop Profile Header - Hidden on mobile */}
      <div className="hidden md:block">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Progression Card */}
      <div className="bg-white rounded-lg border border-gray-200 border-l-primary/30 border-l-4 p-6">
        <div className="space-y-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Profile Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 border-l-primary/30 border-l-4 p-6">
        <SkeletonVariants variant="form" />
      </div>
    </div>
  );
};
