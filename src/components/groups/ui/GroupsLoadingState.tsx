
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface GroupsLoadingStateProps {
  count?: number;
  variant?: 'grid' | 'list';
}

export const GroupsLoadingState = ({ count = 6, variant = 'grid' }: GroupsLoadingStateProps) => {
  return (
    <div className={`${variant === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6' : 'space-y-4'}`}>
      {Array.from({ length: count }).map((_, index) => (
        <GroupCardSkeleton key={index} variant={variant} />
      ))}
    </div>
  );
};

const GroupCardSkeleton = ({ variant }: { variant: 'grid' | 'list' }) => {
  if (variant === 'list') {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-80 overflow-hidden">
      <CardContent className="p-0 h-full relative">
        {/* Background skeleton */}
        <Skeleton className="absolute inset-0" />
        
        {/* Content overlay skeleton */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          {/* Top section */}
          <div className="flex justify-between items-start">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          
          {/* Stats section */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-white/10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-6 w-8 mx-auto mb-1 bg-white/20" />
                <Skeleton className="h-3 w-12 mx-auto bg-white/20" />
              </div>
            ))}
          </div>
          
          {/* Bottom section */}
          <div className="space-y-3">
            <div>
              <Skeleton className="h-6 w-3/4 mb-2 bg-white/30" />
              <Skeleton className="h-4 w-1/2 bg-white/20" />
            </div>
            <Skeleton className="h-10 w-full rounded bg-white/30" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
