
import { useState } from "react";

interface UsePostEditorProps {
  postId: string;
  content: string;
  isEditing: boolean;
  isSubmitting: boolean;
  onStartEditing: (postId: string, content: string) => void;
  onCancelEditing: () => void;
  onSaveEditing: () => void;
}

export const usePostEditor = ({
  postId,
  content,
  isEditing,
  isSubmitting,
  onStartEditing,
  onCancelEditing,
  onSaveEditing
}: UsePostEditorProps) => {
  const [editableContent, setEditableContent] = useState(content);

  const handleStartEditing = () => {
    onStartEditing(postId, content);
    setEditableContent(content);
  };

  const handleSaveEditing = () => {
    if (editableContent.trim() && editableContent !== content) {
      onSaveEditing();
    } else {
      onCancelEditing();
    }
  };

  const handleCancelEditing = () => {
    setEditableContent(content);
    onCancelEditing();
  };

  return {
    editableContent,
    setEditableContent,
    handleStartEditing,
    handleSaveEditing,
    handleCancelEditing,
    isEditing,
    isSubmitting
  };
};
