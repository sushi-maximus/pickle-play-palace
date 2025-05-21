
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoginErrorMessageProps {
  errorMessage: string;
  onResendVerification?: () => void;
}

export const LoginErrorMessage = ({ errorMessage, onResendVerification }: LoginErrorMessageProps) => {
  const isEmailNotConfirmed = errorMessage.includes("Email not confirmed");
  
  return (
    <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm flex items-start">
      <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
      <div>
        <p>{errorMessage}</p>
        {isEmailNotConfirmed && onResendVerification && (
          <Button variant="link" className="h-auto p-0 text-sm" onClick={onResendVerification}>
            Resend verification email
          </Button>
        )}
      </div>
    </div>
  );
};
