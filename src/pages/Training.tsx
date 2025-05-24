
import { AppLayout } from "@/components/layout/AppLayout";
import { TrainingContent } from "@/components/training/TrainingContent";
import { useAuth } from "@/contexts/AuthContext";

const Training = () => {
  const { profile } = useAuth();

  return (
    <AppLayout title="Training">
      <div className="py-6 md:py-12">
        <h1 className="text-3xl font-bold mb-4 hidden md:block">Training Guide</h1>
        <p className="text-slate-600 mb-6">Your personalized path to pickleball improvement</p>
      </div>
      
      <TrainingContent profile={profile} />
    </AppLayout>
  );
};

export default Training;
