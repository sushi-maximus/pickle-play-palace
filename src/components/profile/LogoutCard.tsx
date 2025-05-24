
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
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

interface LogoutCardProps {
  onLogout: () => void;
}

export const LogoutCard = ({ onLogout }: LogoutCardProps) => {
  return (
    <Card className="border border-gray-200 border-l-primary/30 border-l-4 hover:shadow-md transition-shadow bg-white">
      <CardContent className="pt-6 pb-6">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              className="justify-start w-full text-destructive hover:text-destructive hover:bg-destructive/10 h-10 px-4"
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
      </CardContent>
    </Card>
  );
};
