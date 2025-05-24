
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/Navbar";
import { MobilePageHeader } from "@/components/navigation/MobilePageHeader";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";

export const GroupDetailsLoading = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navbar />
      </div>
      
      {/* Mobile Header */}
      <MobilePageHeader title="Loading..." />
      
      <main className="flex-1 px-3 py-4 md:px-6 md:py-8 pt-16 md:pt-4 pb-20 md:pb-4">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </main>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};
