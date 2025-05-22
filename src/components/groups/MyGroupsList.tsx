
import { useUserMemberships } from "./hooks/useUserMemberships";
import { GroupsLoadingState } from "./ui/GroupsLoadingState";
import { MyGroupsEmptyState } from "./ui/MyGroupsEmptyState";
import { MembershipsGrid } from "./ui/MembershipsGrid";

interface MyGroupsListProps {
  user: any;
  onRefresh: () => void;
  searchTerm?: string;
}

export const MyGroupsList = ({ user, onRefresh, searchTerm = "" }: MyGroupsListProps) => {
  const { filteredMemberships, loading, refreshMemberships } = useUserMemberships(user.id, searchTerm);

  if (loading) {
    return <GroupsLoadingState />;
  }

  if (filteredMemberships.length === 0 && searchTerm === "") {
    return (
      <MyGroupsEmptyState 
        type="no-groups" 
        onRefresh={async () => {
          await refreshMemberships();
          onRefresh();
        }} 
      />
    );
  }

  if (filteredMemberships.length === 0 && searchTerm !== "") {
    return <MyGroupsEmptyState type="no-search-results" searchTerm={searchTerm} />;
  }

  return <MembershipsGrid memberships={filteredMemberships} />;
};
