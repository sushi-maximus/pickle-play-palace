
import { Button } from "@/components/ui/button";
import { Users, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const LoginPrompt = () => {
  const navigate = useNavigate();
  
  const handleLoginPrompt = () => {
    navigate("/login", { state: { returnUrl: "/groups" } });
  };
  
  return (
    <div className="text-center py-12">
      <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-2xl font-bold mb-2">Please log in</h3>
      <p className="text-muted-foreground mb-6">You need to be logged in to view and create groups</p>
      <Button onClick={handleLoginPrompt}>
        <LogIn className="mr-2 h-4 w-4" />
        Log in
      </Button>
    </div>
  );
};
