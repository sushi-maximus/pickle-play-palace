
import { useState, useEffect } from "react";
import { useUserMemberships } from "./hooks/useUserMemberships";
import { GroupsLoadingState } from "./ui/GroupsLoadingState";
import { MyGroupsEmptyState } from "./ui/MyGroupsEmptyState";
import { MembershipsGrid } from "./ui/MembershipsGrid";
import { GroupsPagination } from "./ui/GroupsPagination";

type Membership = {
  id: string;
  role: string;
  joined_at: string;
  group: {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    created_at: string;
    is_private: boolean;
    member_count?: number;
  };
};

interface MyGroupsListProps {
  user: any;
  onRefresh: () => void;
  searchTerm?: string;
}

export const MyGroupsList = ({ user, onRefresh, searchTerm = "" }: MyGroupsListProps) => {
  const { filteredMemberships, loading, refreshMemberships } = useUserMemberships(user.id, searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Show 6 groups per page (2 rows of 3)

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  // Calculate pagination
  const totalPages = Math.ceil(filteredMemberships.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMemberships = filteredMemberships.slice(startIndex, endIndex);

  return (
    <>
      <MembershipsGrid memberships={currentMemberships} />
      {totalPages > 1 && (
        <GroupsPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};
