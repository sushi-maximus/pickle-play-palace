
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ValidationIconProps {
  valid: boolean;
}

export function ValidationIcon({ valid }: ValidationIconProps) {
  return (
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-opacity duration-200">
      {valid ? (
        <CheckCircle2 className="h-5 w-5 text-primary animate-scale-in" />
      ) : (
        <AlertCircle className="h-5 w-5 text-destructive animate-scale-in" />
      )}
    </div>
  );
}
