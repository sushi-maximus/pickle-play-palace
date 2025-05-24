
import { Button } from "@/components/ui/button";
import { Plus, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CreateGroupDialog } from "@/components/groups/CreateGroupDialog";
import { toast } from "sonner";
import { DataFetchErrorBoundary } from "@/components/error-boundaries";

interface GroupsHeaderProps {
  user: any;
  onRefresh: () => Promise<void>;
}

export const GroupsHeader = ({ user, onRefresh }: GroupsHeaderProps) => {
  const navigate = useNavigate();

  const handleLoginPrompt = () => {
    toast.info("Please log in to create or view groups");
    navigate("/login", { state: { returnUrl: "/groups" } });
  };

  return (
    <DataFetchErrorBoundary componentName="Groups Header" onRetry={onRefresh}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Groups</h1>
        
        {user ? (
          <CreateGroupDialog 
            trigger={
              <Button className="hover-scale">
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            }
            onSuccess={onRefresh}
          />
        ) : (
          <Button onClick={handleLoginPrompt} className="hover-scale">
            <LogIn className="mr-2 h-4 w-4" />
            Log in to Create Group
          </Button>
        )}
      </div>
    </DataFetchErrorBoundary>
  );
};
