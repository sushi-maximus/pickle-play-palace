
import { Skeleton } from "@/components/ui/skeleton";

export const ProfileSkeleton = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Desktop Profile Header - Hidden on mobile */}
      <div className="hidden md:block">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Progression Card */}
      <div className="bg-white rounded-lg border border-gray-200 border-l-primary/30 border-l-4 p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Profile Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 border-l-primary/30 border-l-4 p-6">
        <div className="space-y-6">
          <Skeleton className="h-6 w-28" />
          
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-24 w-full" />
          </div>
          
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      
      {/* Logout Card */}
      <div className="bg-white rounded-lg border p-6">
        <div className="space-y-4">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
};
