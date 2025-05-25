
import { memo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface PostContentProps {
  content: string;
  mediaUrls?: string[] | null;
  isEditing?: boolean;
  editableContent?: string;
  setEditableContent?: (content: string) => void;
  onCancelEditing?: () => void;
  onSaveEditing?: () => void;
  isEditSubmitting?: boolean;
}

const PostContentComponent = ({
  content,
  mediaUrls,
  isEditing = false,
  editableContent = "",
  setEditableContent,
  onCancelEditing,
  onSaveEditing,
  isEditSubmitting = false
}: PostContentProps) => {
  if (isEditing) {
    return (
      <div className="space-y-3">
        <Textarea
          value={editableContent}
          onChange={(e) => setEditableContent?.(e.target.value)}
          className="min-h-[100px] resize-none border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="What's on your mind?"
        />
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancelEditing}
            disabled={isEditSubmitting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onSaveEditing}
            disabled={isEditSubmitting || !editableContent.trim()}
          >
            {isEditSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="px-1 py-2">
        <p className="text-gray-900 text-base leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </p>
      </div>
      
      {mediaUrls && mediaUrls.length > 0 && (
        <div className="space-y-3">
          {mediaUrls.map((url, index) => (
            <div key={index} className="rounded-lg overflow-hidden border border-gray-200">
              <img
                src={url}
                alt={`Post media ${index + 1}`}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const PostContent = memo(PostContentComponent);
