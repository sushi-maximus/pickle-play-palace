
import { memo } from "react";

interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
}

interface FacebookCommentEditFormProps {
  comment: Comment;
  editableContent: string;
  setEditableContent: (content: string) => void;
  isSubmitting: boolean;
  onSave: () => void;
  onCancel: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const FacebookCommentEditFormComponent = ({
  comment,
  editableContent,
  setEditableContent,
  isSubmitting,
  onSave,
  onCancel,
  onKeyPress
}: FacebookCommentEditFormProps) => {
  return (
    <div className="bg-gray-100 rounded-lg px-3 py-2">
      <div className="font-semibold text-sm text-gray-900 mb-1">
        {comment.user.first_name} {comment.user.last_name}
      </div>
      <textarea
        value={editableContent}
        onChange={(e) => setEditableContent(e.target.value)}
        onKeyDown={onKeyPress}
        className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm resize-none"
        rows={2}
        disabled={isSubmitting}
      />
      <div className="flex items-center space-x-2 mt-2">
        <button
          onClick={onSave}
          disabled={isSubmitting || !editableContent.trim()}
          className="text-xs font-medium text-blue-600 hover:underline disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="text-xs font-medium text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export const FacebookCommentEditForm = memo(FacebookCommentEditFormComponent);
