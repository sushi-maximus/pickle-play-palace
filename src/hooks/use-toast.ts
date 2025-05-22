
// Re-export Sonner toast for simplified usage
import { toast } from "@/components/ui/sonner";

// Export Sonner's toast as default
export { toast };

// For components still using the old useToast hook pattern
export const useToast = () => {
  return {
    toast,
    // Provide empty functions to maintain API compatibility
    toasts: [],
    dismiss: () => {},
  };
};
