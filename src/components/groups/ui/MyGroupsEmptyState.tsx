
import { Button } from "@/components/ui/button";
import { Users, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CreateGroupDialog } from "@/components/groups/CreateGroupDialog";

interface MyGroupsEmptyStateProps {
  type: "no-groups" | "no-search-results";
  searchTerm?: string;
  onRefresh?: () => Promise<void>;
}

export const MyGroupsEmptyState = ({ type, searchTerm, onRefresh }: MyGroupsEmptyStateProps) => {
  const navigate = useNavigate();
  
  if (type === "no-groups") {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-bold mb-2">You haven't joined any groups yet</h3>
        <p className="text-muted-foreground mb-6">Create your first group or join an existing one</p>
        <CreateGroupDialog 
          trigger={
            <Button className="hover-scale">
              <Users className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          }
          onSuccess={onRefresh}
        />
      </div>
    );
  }
  
  if (type === "no-search-results") {
    return (
      <div className="text-center py-12">
        <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-bold mb-2">No matching groups</h3>
        <p className="text-muted-foreground mb-6">
          None of your groups match "{searchTerm}". Try a different search term.
        </p>
        <Button variant="outline" onClick={() => navigate("/groups")}>
          Clear search
        </Button>
      </div>
    );
  }
  
  return null;
};
