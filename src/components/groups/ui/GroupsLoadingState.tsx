
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface GroupsLoadingStateProps {
  count?: number;
  variant?: 'grid' | 'list';
}

export const GroupsLoadingState = ({ count = 6, variant = 'grid' }: GroupsLoadingStateProps) => {
  return (
    <div 
      className={`${variant === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6' : 'space-y-4'}`}
      role="status"
      aria-label="Loading groups"
    >
      {Array.from({ length: count }).map((_, index) => (
        <GroupCardSkeleton 
          key={index} 
          variant={variant}
          aria-label={`Loading group ${index + 1} of ${count}`}
        />
      ))}
      <span className="sr-only">Loading groups, please wait...</span>
    </div>
  );
};

const GroupCardSkeleton = ({ 
  variant, 
  ...props 
}: { 
  variant: 'grid' | 'list';
  'aria-label'?: string;
}) => {
  if (variant === 'list') {
    return (
      <Card className="w-full" {...props}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Skeleton 
              className="h-12 w-12 rounded-full" 
              aria-label="Group avatar loading"
            />
            <div className="space-y-2 flex-1">
              <Skeleton 
                className="h-4 w-[200px]" 
                aria-label="Group name loading"
              />
              <Skeleton 
                className="h-4 w-[150px]" 
                aria-label="Group details loading"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-80 overflow-hidden" {...props}>
      <CardContent className="p-0 h-full relative">
        {/* Background skeleton */}
        <Skeleton 
          className="absolute inset-0" 
          aria-label="Group cover image loading"
        />
        
        {/* Content overlay skeleton */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          {/* Top section */}
          <div className="flex justify-between items-start">
            <div className="flex gap-2">
              <Skeleton 
                className="h-6 w-16 rounded-full" 
                aria-label="Group privacy badge loading"
              />
              <Skeleton 
                className="h-6 w-20 rounded-full" 
                aria-label="Group membership badge loading"
              />
            </div>
            <Skeleton 
              className="h-10 w-10 rounded-full" 
              aria-label="Group actions loading"
            />
          </div>
          
          {/* Stats section */}
          <div 
            className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-white/10"
            aria-label="Group statistics loading"
          >
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
              <Skeleton 
                className="h-6 w-3/4 mb-2 bg-white/30" 
                aria-label="Group name loading"
              />
              <Skeleton 
                className="h-4 w-1/2 bg-white/20" 
                aria-label="Group location loading"
              />
            </div>
            <Skeleton 
              className="h-10 w-full rounded bg-white/30" 
              aria-label="View group button loading"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
