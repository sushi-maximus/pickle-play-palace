
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const LoginPromptButton = () => {
  const navigate = useNavigate();

  const handleLoginPrompt = () => {
    toast.info("Please log in to create or view groups");
    navigate("/login", { state: { returnUrl: "/groups" } });
  };

  return (
    <Button onClick={handleLoginPrompt} className="hover-scale">
      <LogIn className="mr-2 h-4 w-4" />
      Log in to Create Group
    </Button>
  );
};
