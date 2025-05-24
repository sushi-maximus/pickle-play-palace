
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { GroupsLoadingState } from "./ui/GroupsLoadingState";
import { GroupsEmptyState } from "./ui/GroupsEmptyState";
import { GroupsGridHybrid } from "./ui/GroupsGridHybrid";
import { GroupsPagination } from "./ui/GroupsPagination";
import { useUnifiedGroups } from "./hooks/useUnifiedGroups";

interface GroupsListProps {
  user: any;
  searchTerm?: string;
}

export const GroupsList = ({ user, searchTerm = "" }: GroupsListProps) => {
  const { 
    filteredGroups, 
    loading, 
    refreshData 
  } = useUnifiedGroups({
    mode: 'all',
    searchTerm,
    userId: user?.id
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Show 6 groups per page (2 rows of 3)

  useEffect(() => {
    // Reset to first page when search term changes
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchGroups = async () => {
    try {
      await refreshData();
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Failed to load groups");
    }
  };

  if (loading) {
    console.log("Groups loading...");
    return <GroupsLoadingState />;
  }

  if (filteredGroups.length === 0 && !searchTerm) {
    console.log("No groups found, showing empty state");
    return <GroupsEmptyState type="no-groups" onRefresh={fetchGroups} />;
  }

  if (filteredGroups.length === 0 && searchTerm) {
    console.log("No search results for:", searchTerm);
    return <GroupsEmptyState type="no-search-results" searchTerm={searchTerm} />;
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGroups = filteredGroups.slice(startIndex, endIndex);

  console.log("Rendering GroupsGridHybrid with unified groups:", currentGroups);

  return (
    <>
      <GroupsGridHybrid groups={currentGroups} />
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
