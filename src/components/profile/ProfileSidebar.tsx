
import { User, LogOut, Settings, Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface ProfileSidebarProps {
  profile: any;
}

export const ProfileSidebar = ({ profile }: ProfileSidebarProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Card className="w-full md:w-64 p-4">
      <h3 className="font-medium text-lg border-b pb-2 mb-4">Account Menu</h3>
      <div className="flex flex-col gap-2">
        <Button variant="ghost" className="justify-start bg-primary/10 text-primary">
          <User className="mr-2 h-4 w-4" />
          My Profile
        </Button>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                className="justify-start text-muted-foreground pointer-events-none"
                disabled
              >
                <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                Preferences
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">Coming soon</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                className="justify-start text-muted-foreground pointer-events-none"
                disabled
              >
                <Bell className="mr-2 h-4 w-4 text-muted-foreground" />
                Notifications
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">Coming soon</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                className="justify-start text-muted-foreground pointer-events-none"
                disabled
              >
                <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                Privacy & Security
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs">Coming soon</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="mt-auto pt-4 border-t mt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                className="justify-start w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will need to sign in again to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Log out</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
};
