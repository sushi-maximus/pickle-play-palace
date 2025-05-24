
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileErrorMessage } from "@/components/profile/ProfileErrorMessage";
import { MobileProfileBottomNav } from "@/components/profile/MobileProfileBottomNav";
import { Skeleton } from "@/components/ui/skeleton";
import { MobilePageHeader } from "@/components/navigation/MobilePageHeader";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

const Profile = () => {
  const { user, signOut } = useAuth();
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

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <MobilePageHeader title="Profile" />
        
        <main className="flex-1 px-3 py-4 md:px-6 md:py-8 pt-16 md:pt-4 pb-20 md:pb-4">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-6">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </main>
        
        <MobileProfileBottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <MobilePageHeader title="Profile" />
        
        <main className="flex-1 px-3 py-4 md:px-6 md:py-8 pt-16 md:pt-4 pb-20 md:pb-4">
          <div className="container mx-auto max-w-4xl">
            <ProfileErrorMessage 
              error={error} 
              onRetry={fetchProfile} 
            />
          </div>
        </main>
        
        <MobileProfileBottomNav />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <MobilePageHeader title="Profile" />
        
        <main className="flex-1 px-3 py-4 md:px-6 md:py-8 pt-16 md:pt-4 pb-20 md:pb-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center py-12">
              <p className="text-slate-600">Profile not found</p>
            </div>
          </div>
        </main>
        
        <MobileProfileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <MobilePageHeader title="Profile" />
      
      <main className="flex-1 px-3 py-4 md:px-6 md:py-8 pt-16 md:pt-4 pb-20 md:pb-4">
        <div className="container mx-auto max-w-4xl">
          {/* Desktop Header - Hidden on mobile, shown on desktop */}
          <div className="hidden md:block mb-8">
            <ProfileHeader profile={profile} />
          </div>
          
          {/* Profile Form - Full width */}
          <div className="w-full">
            <ProfileForm 
              profile={profile} 
              onProfileUpdate={handleProfileUpdate}
            />
          </div>

          {/* Logout Button at Bottom */}
          <div className="mt-8 pt-4 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="justify-start w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will need to sign in again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>Log out</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </main>
      
      <MobileProfileBottomNav />
    </div>
  );
};

export default Profile;
