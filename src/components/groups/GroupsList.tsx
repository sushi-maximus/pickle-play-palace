
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { GroupsLoadingState } from "./ui/GroupsLoadingState";
import { GroupsEmptyState } from "./ui/GroupsEmptyState";
import { UnifiedGroupsGrid } from "./ui/UnifiedGroupsGrid";
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
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Failed to load groups");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Show consistent loading state during initial load or refresh
  if (loading || isRefreshing) {
    console.log("Groups loading...");
    return <GroupsLoadingState count={6} variant="grid" />;
  }

  if (filteredGroups.length === 0 && !searchTerm) {
    console.log("No groups found, showing empty state");
    return <GroupsEmptyState type="no-groups" onRefresh={handleRefresh} />;
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

  console.log("Rendering UnifiedGroupsGrid with unified groups:", currentGroups);

  return (
    <div className="space-y-6">
      <UnifiedGroupsGrid groups={currentGroups} />
      {totalPages > 1 && (
        <GroupsPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};
