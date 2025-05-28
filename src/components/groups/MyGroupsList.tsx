
import { useState, useEffect } from "react";
import { useUnifiedGroups } from "./hooks/useUnifiedGroups";
import { GroupsLoadingState } from "./ui/GroupsLoadingState";
import { GroupsEmptyState } from "./ui/GroupsEmptyState";
import { UnifiedGroupsGrid } from "./ui/UnifiedGroupsGrid";
import { GroupsPagination } from "./ui/GroupsPagination";

interface MyGroupsListProps {
  user: any;
  onRefresh: () => void;
  searchTerm?: string;
}

export const MyGroupsList = ({ user, onRefresh, searchTerm = "" }: MyGroupsListProps) => {
  const { 
    filteredGroups, 
    loading, 
    refreshData 
  } = useUnifiedGroups({
    mode: 'my-groups',
    searchTerm,
    userId: user?.id
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 6;

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
      onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Show loading skeleton during initial load or refresh
  if (loading || isRefreshing) {
    return <GroupsLoadingState count={6} variant="grid" />;
  }

  if (filteredGroups.length === 0 && searchTerm === "") {
    return (
      <GroupsEmptyState 
        type="no-groups" 
        onRefresh={handleRefresh}
      />
    );
  }

  if (filteredGroups.length === 0 && searchTerm !== "") {
    return <GroupsEmptyState type="no-search-results" searchTerm={searchTerm} />;
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGroups = filteredGroups.slice(startIndex, endIndex);

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
