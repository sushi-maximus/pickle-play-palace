
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trash2, Download } from "lucide-react";
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

export const AccountSettingsCard = () => {
  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    console.log("Delete account requested");
  };

  const handleExportData = () => {
    // TODO: Implement data export
    console.log("Export data requested");
  };

  return (
    <Card className="border border-gray-200 border-l-primary/30 border-l-4 hover:shadow-md transition-shadow bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-normal">Group invitations</Label>
                <p className="text-xs text-gray-600">Receive emails when invited to groups</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-normal">Group activity</Label>
                <p className="text-xs text-gray-600">Get notified about posts and comments</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-normal">Weekly digest</Label>
                <p className="text-xs text-gray-600">Summary of your group activities</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-900">Data Management</h4>
          <div className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="w-full justify-start"
            >
              <Download className="mr-2 h-3 w-3 md:h-4 md:w-4" />
              Export my data
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                  Delete account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
