
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { updateGroupAvatar } from "@/components/groups/utils/updateGroupUtils";
import { Upload, X, Check, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GroupAvatarUploadProps {
  groupId: string;
  onSuccess: (avatarUrl: string) => void;
  onCancel: () => void;
}

export const GroupAvatarUpload = ({ groupId, onSuccess, onCancel }: GroupAvatarUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed");
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log("Selected file:", file.name, file.size, file.type);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      console.log("Preview URL created:", objectUrl);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    console.log("Starting upload for group:", groupId);
    setIsUploading(true);

    try {
      // Generate a unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${groupId}_${Date.now()}.${fileExt}`;
      const filePath = `group_avatars/${fileName}`;
      
      console.log("Uploading to path:", filePath);
      
      // Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }
      
      console.log("Upload successful:", uploadData);
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error("Failed to get public URL for uploaded file");
      }
      
      console.log("Public URL:", publicUrlData.publicUrl);
      
      // Update the group's avatar URL in the database
      await updateGroupAvatar(groupId, publicUrlData.publicUrl);
      
      console.log("Database updated successfully");
      toast.success("Avatar updated successfully!");
      
      // Call the onSuccess callback
      onSuccess(publicUrlData.publicUrl);
      
    } catch (error) {
      console.error("Error uploading avatar:", error);
      if (error.message?.includes('Bucket not found')) {
        toast.error("Storage not configured. Please contact support.");
      } else {
        toast.error("Failed to upload avatar. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    console.log("Triggering file input");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange} 
        accept="image/*"
        className="hidden" 
      />
      
      {previewUrl ? (
        <Avatar className="h-24 w-24 border-2 border-primary">
          <AvatarImage src={previewUrl} alt="Preview" />
          <AvatarFallback>
            <Image className="h-8 w-8 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      ) : (
        <Button 
          variant="outline" 
          onClick={triggerFileInput}
          className="h-24 w-24 rounded-full flex flex-col items-center justify-center"
        >
          <Upload className="h-8 w-8 mb-1" />
          <span className="text-xs">Select Image</span>
        </Button>
      )}
      
      <div className="flex gap-2">
        {previewUrl ? (
          <>
            <Button 
              onClick={handleUpload} 
              disabled={isUploading}
              size="sm"
              variant="default"
            >
              {isUploading ? (
                "Uploading..."
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" /> Save
                </>
              )}
            </Button>
            <Button onClick={onCancel} size="sm" variant="outline">
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </>
        ) : (
          <Button onClick={onCancel} size="sm" variant="outline">
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground max-w-xs text-center">
        Recommended: Square image, at least 200x200 pixels. Max file size: 5MB.
      </p>
    </div>
  );
};
