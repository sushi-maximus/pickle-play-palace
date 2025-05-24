
import { Skeleton } from "@/components/ui/skeleton";

export const LandingPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <section className="py-20 md:py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left space-y-6">
              <Skeleton className="h-6 w-48 mx-auto lg:mx-0" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-3/4 mx-auto lg:mx-0" />
              </div>
              <Skeleton className="h-6 w-5/6 mx-auto lg:mx-0" />
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-24" />
              </div>
            </div>
            <div className="flex-1">
              <Skeleton className="w-full aspect-square max-w-md mx-auto rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <Skeleton className="h-6 w-20 mx-auto" />
            <Skeleton className="h-10 w-80 mx-auto" />
            <Skeleton className="h-1 w-24 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-8 border">
                <Skeleton className="w-16 h-16 rounded-full mb-6" />
                <Skeleton className="h-6 w-32 mb-3" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Model Section Skeleton */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <Skeleton className="h-6 w-24 mx-auto" />
            <Skeleton className="h-10 w-72 mx-auto" />
            <Skeleton className="h-1 w-24 mx-auto" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl p-8 border">
                <Skeleton className="w-16 h-16 rounded-full mb-6" />
                <Skeleton className="h-6 w-32 mb-5" />
                <div className="space-y-5">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Skeleton */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-r from-pickle-600 to-secondary rounded-3xl p-10 md:p-16 text-center">
            <div className="space-y-6">
              <Skeleton className="h-12 w-96 mx-auto bg-white/20" />
              <Skeleton className="h-6 w-80 mx-auto bg-white/20" />
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Skeleton className="h-12 w-32 bg-white/20" />
                <Skeleton className="h-12 w-28 bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
