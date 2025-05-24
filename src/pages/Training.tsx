
import { useAuth } from "@/contexts/AuthContext";
import { MobilePageHeader } from "@/components/navigation/MobilePageHeader";
import { MobileGroupsBottomNav } from "@/components/groups/mobile/MobileGroupsBottomNav";
import { Navbar } from "@/components/Navbar";
import { TrainingContent } from "@/components/training/TrainingContent";

const Training = () => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="hidden md:block">
          <Navbar />
        </div>
        <MobilePageHeader title="Training" />
        <main className="flex-1 pt-20 pb-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
        <MobileGroupsBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navbar />
      </div>
      
      {/* Mobile Header */}
      <MobilePageHeader title="Training" />
      
      <main className="flex-1 px-1 py-4 md:px-6 md:py-8 pt-16 md:pt-4 pb-20 md:pb-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-3 md:space-y-4">
            <div className="text-center py-6 md:py-12">
              <h1 className="text-3xl font-bold mb-4 hidden md:block">Training Guide</h1>
              <p className="text-slate-600 mb-6">Your personalized path to pickleball improvement</p>
            </div>
            
            <TrainingContent profile={profile} />
          </div>
        </div>
      </main>
      
      <MobileGroupsBottomNav />
    </div>
  );
};

export default Training;
