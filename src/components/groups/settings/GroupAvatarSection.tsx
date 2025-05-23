
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { GroupAvatarUpload } from "@/components/groups/details/GroupAvatarUpload";

interface GroupAvatarSectionProps {
  group: any;
  onGroupUpdate: (updatedGroup: any) => void;
}

export const GroupAvatarSection = ({ group, onGroupUpdate }: GroupAvatarSectionProps) => {
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);

  const handleAvatarUploaded = (avatarUrl: string) => {
    setShowAvatarUpload(false);
    onGroupUpdate({ ...group, avatar_url: avatarUrl });
  };

  return (
    <div className="flex-shrink-0">
      {showAvatarUpload ? (
        <GroupAvatarUpload
          groupId={group.id}
          onSuccess={handleAvatarUploaded}
          onCancel={() => setShowAvatarUpload(false)}
        />
      ) : (
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 cursor-pointer" onClick={() => setShowAvatarUpload(true)}>
            {group.avatar_url ? (
              <AvatarImage src={group.avatar_url} alt={group.name} />
            ) : (
              <AvatarFallback className="text-2xl">
                {group.name?.substring(0, 2).toUpperCase() || "GP"}
              </AvatarFallback>
            )}
          </Avatar>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2" 
            onClick={() => setShowAvatarUpload(true)}
          >
            <Upload className="h-4 w-4 mr-1" />
            Change Avatar
          </Button>
        </div>
      )}
    </div>
  );
};
