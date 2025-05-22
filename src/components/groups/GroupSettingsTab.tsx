
import { Group } from "@/types/group";
import { GroupSettings } from "./GroupSettings";

interface GroupSettingsTabProps {
  group: Group;
}

export function GroupSettingsTab({ group }: GroupSettingsTabProps) {
  return (
    <GroupSettings 
      group={group} 
      onGroupUpdated={(updatedGroup) => {
        // This will be handled by the parent component
        console.log("Group updated:", updatedGroup);
      }} 
    />
  );
}
