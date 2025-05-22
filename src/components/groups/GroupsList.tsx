
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchAllGroups } from "./utils/groupUtils";
import { GroupsLoadingState } from "./ui/GroupsLoadingState";
import { GroupsEmptyState } from "./ui/GroupsEmptyState";
import { GroupsGrid } from "./ui/GroupsGrid";
import { useGroupFiltering } from "./hooks/useGroupFiltering";
import { GroupsPagination } from "./ui/GroupsPagination";

type Group = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  created_at: string;
  is_private: boolean;
  member_count?: number;
};

interface GroupsListProps {
  user: any;
  searchTerm?: string;
}

export const GroupsList = ({ user, searchTerm = "" }: GroupsListProps) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { filteredGroups } = useGroupFiltering(groups, searchTerm);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Show 6 groups per page (2 rows of 3)

  useEffect(() => {
    fetchGroups();
  }, [user]);

  useEffect(() => {
    // Reset to first page when search term changes
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      // Only fetch groups if the user is logged in
      if (user) {
        const data = await fetchAllGroups();
        setGroups(data || []);
      } else {
        setGroups([]);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <GroupsLoadingState />;
  }

  if (groups.length === 0) {
    return <GroupsEmptyState type="no-groups" onRefresh={fetchGroups} />;
  }

  if (filteredGroups.length === 0 && searchTerm) {
    return <GroupsEmptyState type="no-search-results" searchTerm={searchTerm} />;
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGroups = filteredGroups.slice(startIndex, endIndex);

  return (
    <>
      <GroupsGrid groups={currentGroups} />
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
