
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
          className="w-full resize-none text-sm md:text-base"
          rows={3}
          disabled={isEditSubmitting}
        />
        <div className="flex justify-end gap-1 md:gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCancelEditing}
            disabled={isEditSubmitting}
            className="text-xs md:text-sm px-2 md:px-3"
          >
            <X className="h-3 w-3 md:h-4 md:w-4 mr-1" /> Cancel
          </Button>
          <Button 
            size="sm" 
            onClick={onSaveEditing}
            disabled={!editableContent.trim() || isEditSubmitting}
            className="text-xs md:text-sm px-2 md:px-3"
          >
            <Check className="h-3 w-3 md:h-4 md:w-4 mr-1" /> Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <p className="text-sm md:text-base text-gray-900 whitespace-pre-line leading-relaxed">{content}</p>
      
      {mediaUrls && mediaUrls.length > 0 && (
        <div className="mt-2 md:mt-3 grid gap-1 md:gap-2 grid-cols-1 sm:grid-cols-2">
          {mediaUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Post attachment ${index + 1}`}
              className="rounded-md w-full object-cover"
              style={{ maxHeight: "250px" }}
            />
          ))}
        </div>
      )}
    </>
  );
};
