
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";

interface ResendVerificationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResendVerificationDialog = ({ isOpen, onOpenChange }: ResendVerificationDialogProps) => {
  const [resendEmail, setResendEmail] = useState("");
  const [resendStatus, setResendStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { resendVerificationEmail } = useAuth();
  
  const handleResendVerification = async () => {
    if (!resendEmail) return;
    
    setResendStatus("loading");
    try {
      const { error } = await resendVerificationEmail(resendEmail);
      
      if (error) {
        setResendStatus("error");
        return;
      }
      
      setResendStatus("success");
      setTimeout(() => {
        onOpenChange(false);
        // Reset after dialog closes
        setTimeout(() => setResendStatus("idle"), 500);
      }, 3000);
    } catch (error) {
      setResendStatus("error");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resend verification email</DialogTitle>
          <DialogDescription>
            Enter your email address to receive a new verification link.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                type="email"
              />
            </FormControl>
          </FormItem>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleResendVerification}
            disabled={resendStatus === "loading" || !resendEmail}
          >
            {resendStatus === "loading" 
              ? "Sending..." 
              : resendStatus === "success" 
              ? "Email sent!" 
              : "Send verification email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
