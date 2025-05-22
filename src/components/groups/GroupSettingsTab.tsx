
import { Group } from "@/types/group";
import { GroupSettings } from "./GroupSettings";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface GroupSettingsTabProps {
  group: Group;
}

export function GroupSettingsTab({ group }: GroupSettingsTabProps) {
  const navigate = useNavigate();
  
  const handleGroupUpdated = (updatedGroup: Group) => {
    // Update the UI with the updated group data
    toast.success("Group updated successfully!");
    
    // If the name has changed, we might want to redirect to maintain URL consistency
    if (updatedGroup.name !== group.name) {
      navigate(`/groups/${updatedGroup.id}`);
    }
  };
  
  return (
    <GroupSettings 
      group={group} 
      onGroupUpdated={handleGroupUpdated} 
    />
  );
}
