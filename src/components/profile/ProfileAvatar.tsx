
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage, AvatarWithBorder } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getSkillLevelColor } from "@/lib/constants/skill-levels";

interface ProfileAvatarProps {
  userId: string;
  avatarUrl: string | null;
  getInitials: () => string;
}

export const ProfileAvatar = ({ userId, avatarUrl, getInitials }: ProfileAvatarProps) => {
  const [uploading, setUploading] = useState(false);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(avatarUrl);
  const { refreshProfile, profile } = useAuth();

  // Get the appropriate color based on DUPR or skill level
  const borderColor = getSkillLevelColor(profile?.dupr_rating, profile?.skill_level);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/avatar.${fileExt}`;
      
      setUploading(true);
      
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update the profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      setLocalAvatarUrl(publicUrl);
      
      // Refresh profile data in context
      await refreshProfile();
      
      toast.success("Avatar updated successfully");
      
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast.error(`Error uploading avatar: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative mb-4 md:mb-0 flex items-center justify-center">
      <AvatarWithBorder className="h-24 w-24" borderColor={borderColor} borderWidth={4}>
        <AvatarImage src={localAvatarUrl || avatarUrl || ""} alt="Profile" className="rounded-full" />
        <AvatarFallback className="text-lg rounded-full">{getInitials()}</AvatarFallback>
      </AvatarWithBorder>
      <div className="absolute bottom-0 right-0">
        <label htmlFor="avatar-upload" className="cursor-pointer">
          <div className="bg-primary text-primary-foreground rounded-full p-1">
            {uploading ? (
              <span className="animate-spin">⋯</span>
            ) : (
              <Pencil className="h-4 w-4" />
            )}
          </div>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
};
