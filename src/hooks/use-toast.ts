
// Re-export Sonner toast for backward compatibility
import { toast, toastWithCloseButton } from "@/components/ui/sonner";

// Export Sonner's toast as default
export { toast, toastWithCloseButton };

// For components still using the old useToast hook pattern
export const useToast = () => {
  return {
    toast,
    toastWithCloseButton,
    // Provide empty functions to maintain API compatibility
    toasts: [],
    dismiss: () => {},
  };
};
