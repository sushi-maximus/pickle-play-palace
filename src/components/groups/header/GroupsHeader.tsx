
import { DataFetchErrorBoundary } from "@/components/error-boundaries";
import { LoginPromptButton } from "./LoginPromptButton";
import { CreateGroupButton } from "./CreateGroupButton";

interface GroupsHeaderProps {
  user: any;
  onRefresh: () => Promise<void>;
}

export const GroupsHeader = ({ user, onRefresh }: GroupsHeaderProps) => {
  return (
    <DataFetchErrorBoundary componentName="Groups Header" onRetry={onRefresh}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Groups</h1>
        
        {user ? (
          <CreateGroupButton onSuccess={onRefresh} />
        ) : (
          <LoginPromptButton />
        )}
      </div>
    </DataFetchErrorBoundary>
  );
};
