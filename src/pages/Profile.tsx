
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { ProfileErrorMessage } from "@/components/profile/ProfileErrorMessage";
import { Skeleton } from "@/components/ui/skeleton";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";
import { MobilePageHeader } from "@/components/navigation/MobilePageHeader";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <Navbar />
        </div>
        
        {/* Mobile Header */}
        <MobilePageHeader title="Profile" />
        
        <main className="flex-1 px-3 py-4 md:px-6 md:py-8 pt-16 md:pt-4 pb-20 md:pb-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <Skeleton className="h-48 w-full" />
              </div>
              <div className="lg:col-span-3 space-y-6">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </div>
        </main>
        
        {/* Desktop Footer */}
        <div className="hidden md:block">
          <Footer />
        </div>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <Navbar />
        </div>
        
        {/* Mobile Header */}
        <MobilePageHeader title="Profile" />
        
        <main className="flex-1 px-3 py-4 md:px-6 md:py-8 pt-16 md:pt-4 pb-20 md:pb-4">
          <div className="container mx-auto max-w-4xl">
            <ProfileErrorMessage 
              error={error} 
              onRetry={fetchProfile} 
            />
          </div>
        </main>
        
        {/* Desktop Footer */}
        <div className="hidden md:block">
          <Footer />
        </div>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <Navbar />
        </div>
        
        {/* Mobile Header */}
        <MobilePageHeader title="Profile" />
        
        <main className="flex-1 px-3 py-4 md:px-6 md:py-8 pt-16 md:pt-4 pb-20 md:pb-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center py-12">
              <p className="text-slate-600">Profile not found</p>
            </div>
          </div>
        </main>
        
        {/* Desktop Footer */}
        <div className="hidden md:block">
          <Footer />
        </div>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navbar />
      </div>
      
      {/* Mobile Header */}
      <MobilePageHeader title="Profile" />
      
      <main className="flex-1 px-3 py-4 md:px-6 md:py-8 pt-16 md:pt-4 pb-20 md:pb-4">
        <div className="container mx-auto max-w-4xl">
          {/* Desktop Header */}
          <div className="hidden md:block mb-8">
            <ProfileHeader profile={profile} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Sidebar */}
            <div className="lg:col-span-1 hidden md:block">
              <ProfileSidebar profile={profile} />
            </div>
            
            {/* Profile Form */}
            <div className="lg:col-span-3">
              <ProfileForm 
                profile={profile} 
                onProfileUpdate={handleProfileUpdate}
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Desktop Footer */}
      <div className="hidden md:block">
        <Footer />
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default Profile;
