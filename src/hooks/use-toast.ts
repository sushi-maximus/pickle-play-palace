
// Direct re-export of Sonner toast 
import { toast } from "@/components/ui/sonner";

export { toast };

// Minimal compatibility layer for old useToast pattern
export const useToast = () => {
  return {
    toast,
    // Empty values for backward compatibility
    toasts: [],
    dismiss: () => {},
  };
};
