
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchAllGroups } from "./utils/groupUtils";
import { GroupsLoadingState } from "./ui/GroupsLoadingState";
import { GroupsEmptyState } from "./ui/GroupsEmptyState";
import { GroupsGrid } from "./ui/GroupsGrid";
import { useGroupFiltering } from "./hooks/useGroupFiltering";

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

  useEffect(() => {
    fetchGroups();
  }, [user]);

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

  return <GroupsGrid groups={filteredGroups} />;
};
