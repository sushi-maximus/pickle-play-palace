
import { Textarea } from "@/components/ui/textarea";

interface CommentContentProps {
  content: string;
  isEditing: boolean;
  editableContent: string;
  setEditableContent: (content: string) => void;
  isEditSubmitting: boolean;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const CommentContent = ({
  content,
  isEditing,
  editableContent,
  setEditableContent,
  isEditSubmitting,
  onKeyDown
}: CommentContentProps) => {
  if (isEditing) {
    return (
      <div className="space-y-3">
        <Textarea
          value={editableContent}
          onChange={(e) => setEditableContent(e.target.value)}
          onKeyDown={onKeyDown}
          className="text-sm md:text-base min-h-[80px] md:min-h-[60px] resize-none border-gray-200 focus:border-blue-300"
          disabled={isEditSubmitting}
          autoFocus
          placeholder="Edit your comment..."
        />
        <p className="text-xs text-gray-500">
          Press Enter to save, Esc to cancel
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
      <p className="text-sm md:text-base text-gray-900 whitespace-pre-line leading-relaxed">
        {content}
      </p>
    </div>
  );
};
