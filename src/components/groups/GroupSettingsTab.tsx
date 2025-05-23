
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface GroupSettingsTabProps {
  group: any;
  onGroupUpdate: (updatedGroup: any) => void;
}

export const GroupSettingsTab = ({ group, onGroupUpdate }: GroupSettingsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium">Group Settings</h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Admin Only</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Manage the basic details of your group.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            <AlertCircle className="h-4 w-4 inline-block mr-2" />
            Coming soon: Edit group name, description, location, and privacy settings.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Member Management</CardTitle>
          <CardDescription>
            Manage group memberships and roles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            <AlertCircle className="h-4 w-4 inline-block mr-2" />
            Coming soon: Promote members to admins or remove members from the group.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>
            Configure advanced group settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            <AlertCircle className="h-4 w-4 inline-block mr-2" />
            Coming soon: Manage skill level ranges and maximum number of members.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
