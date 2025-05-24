import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchAllGroupsOptimized } from "./utils/groupDataUtils"; // Phase 2: Use optimized function
import { GroupsLoadingState } from "./ui/GroupsLoadingState";
import { GroupsEmptyState } from "./ui/GroupsEmptyState";
import { GroupsGridHybrid } from "./ui/GroupsGridHybrid";
import { useGroupFiltering } from "./hooks/useGroupFiltering";
import { GroupsPagination } from "./ui/GroupsPagination";
import { Database } from "@/integrations/supabase/types";

type Group = Database['public']['Tables']['groups']['Row'];

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
        console.log("Fetching groups for user:", user?.email);
        const data = await fetchAllGroupsOptimized(); // Phase 2: Use optimized function
        console.log("Fetched groups data:", data);
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
    console.log("Groups loading...");
    return <GroupsLoadingState />;
  }

  if (groups.length === 0) {
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

  console.log("Rendering GroupsGridHybrid with groups:", currentGroups);

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
