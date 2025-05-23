
import { useState } from "react";
import { useParams } from "react-router-dom";
import { updateGroupPermissions } from "../services/groupService";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Lock, Shield, Users } from "lucide-react";

interface GroupSettingsPermissionsProps {
  group: any;
  setGroup: (group: any) => void;
}

// In a real app, this would be fetched from the database
// For now, we'll simulate with mock data
const permissionSettings = [
  {
    id: "is_private",
    name: "Private Group",
    description: "Only approved members can view and join the group",
    icon: Lock,
    default: false
  },
  // More permission settings would go here in a real app
  // These would be stored in the group table or a separate permissions table
];

export const GroupSettingsPermissions = ({ group, setGroup }: GroupSettingsPermissionsProps) => {
  const { id } = useParams<{ id: string }>();
  const [permissions, setPermissions] = useState({
    is_private: group.is_private || false,
    // Add more permissions as needed
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handlePermissionChange = (key: string, value: boolean) => {
    setPermissions({
      ...permissions,
      [key]: value
    });
  };
  
  const savePermissions = async () => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      const updatedGroup = await updateGroupPermissions(id, permissions);
      
      if (updatedGroup) {
        setGroup({
          ...group,
          ...updatedGroup
        });
        toast.success("Group permissions updated successfully");
      } else {
        toast.error("Failed to update group permissions");
      }
    } catch (error) {
      console.error("Error updating permissions:", error);
      toast.error("An error occurred while updating permissions");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2 flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          Group Permissions
        </h2>
        <p className="text-sm text-muted-foreground">
          Control who can view and join your group.
        </p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Setting</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissionSettings.map((setting) => {
            const Icon = setting.icon;
            return (
              <TableRow key={setting.id}>
                <TableCell className="font-medium flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{setting.name}</span>
                </TableCell>
                <TableCell>{setting.description}</TableCell>
                <TableCell className="text-right">
                  <Switch
                    checked={permissions[setting.id as keyof typeof permissions]}
                    onCheckedChange={(checked) => 
                      handlePermissionChange(setting.id, checked)
                    }
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      <div className="border-t pt-4 flex justify-end">
        <Button
          onClick={savePermissions}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      
      {/* Admin section - Shows which members have admin privileges */}
      <div className="space-y-2 mt-8">
        <h3 className="text-lg font-medium flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Group Administrators
        </h3>
        <p className="text-sm text-muted-foreground">
          Administrators can manage group settings and members. You can manage admin privileges in the Members tab.
        </p>
        
        <div className="mt-2 text-sm">
          {group.members?.filter((m: any) => m.role === "admin").map((admin: any) => (
            <div key={admin.id} className="px-4 py-2 bg-muted rounded-md mb-2">
              {admin.profiles?.first_name} {admin.profiles?.last_name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
