
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Check } from "lucide-react";

interface PostContentProps {
  content: string;
  mediaUrls?: string[] | null;
  isEditing: boolean;
  editableContent: string;
  setEditableContent: (content: string) => void;
  onCancelEditing: () => void;
  onSaveEditing: () => void;
  isEditSubmitting: boolean;
}

export const PostContent = ({
  content,
  mediaUrls,
  isEditing,
  editableContent,
  setEditableContent,
  onCancelEditing,
  onSaveEditing,
  isEditSubmitting
}: PostContentProps) => {
  if (isEditing) {
    return (
      <div className="space-y-2">
        <Textarea
          value={editableContent}
          onChange={(e) => setEditableContent(e.target.value)}
          className="w-full resize-none"
          rows={3}
          disabled={isEditSubmitting}
        />
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCancelEditing}
            disabled={isEditSubmitting}
          >
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <Button 
            size="sm" 
            onClick={onSaveEditing}
            disabled={!editableContent.trim() || isEditSubmitting}
          >
            <Check className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <p className="whitespace-pre-line">{content}</p>
      
      {mediaUrls && mediaUrls.length > 0 && (
        <div className="mt-3 grid gap-2 grid-cols-1 sm:grid-cols-2">
          {mediaUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Post attachment ${index + 1}`}
              className="rounded-md w-full object-cover"
              style={{ maxHeight: "300px" }}
            />
          ))}
        </div>
      )}
    </>
  );
};
