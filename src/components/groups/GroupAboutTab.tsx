
import { Group } from "@/types/group";

interface GroupAboutTabProps {
  group: Group;
}

export function GroupAboutTab({ group }: GroupAboutTabProps) {
  return (
    <div className="space-y-6 bg-card p-6 rounded-lg border border-border">
      <div>
        <h3 className="text-lg font-medium mb-2">Description</h3>
        <p className="text-muted-foreground">
          {group.description || "No description provided."}
        </p>
      </div>
      
      {group.location && (
        <div>
          <h3 className="text-lg font-medium mb-2">Location</h3>
          <p className="text-muted-foreground">{group.location}</p>
        </div>
      )}
    </div>
  );
}
