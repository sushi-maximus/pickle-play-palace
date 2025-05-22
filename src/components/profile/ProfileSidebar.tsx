
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

interface ProfileSidebarProps {
  onLogout: () => Promise<void>;
}

export const ProfileSidebar = ({ onLogout }: ProfileSidebarProps) => {
  return (
    <Card className="w-full md:w-64 p-4">
      <h3 className="font-medium text-lg border-b pb-2 mb-4">Account Menu</h3>
      <div className="flex flex-col gap-2">
        <Button variant="ghost" className="justify-start bg-primary/10 text-primary">
          <User className="mr-2 h-4 w-4" />
          My Profile
        </Button>
        <Button variant="ghost" className="justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Preferences
        </Button>
        <Button variant="ghost" className="justify-start">
          <Bell className="mr-2 h-4 w-4" />
          Notifications
        </Button>
        <Button variant="ghost" className="justify-start">
          <Shield className="mr-2 h-4 w-4" />
          Privacy & Security
        </Button>
        
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
                <AlertDialogAction onClick={onLogout}>Log out</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  );
};
