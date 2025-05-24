
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ProfilePageLayout } from "@/components/profile/ProfilePageLayout";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { ProfileErrorState } from "@/components/profile/ProfileErrorState";
import { ProfileNotFound } from "@/components/profile/ProfileNotFound";
import { ProfileContent } from "@/components/profile/ProfileContent";
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

  return (
    <ProfilePageLayout profile={profile}>
      {loading && <ProfileSkeleton />}
      
      {error && (
        <ProfileErrorState 
          error={error} 
          onRetry={fetchProfile} 
        />
      )}
      
      {!loading && !error && !profile && <ProfileNotFound />}
      
      {!loading && !error && profile && (
        <ProfileContent
          profile={profile}
          onProfileUpdate={handleProfileUpdate}
          onLogout={handleLogout}
        />
      )}
    </ProfilePageLayout>
  );
};

export default Profile;
