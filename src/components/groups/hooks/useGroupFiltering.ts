
import { useState, useEffect } from "react";

type Group = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  created_at: string;
  is_private: boolean;
  member_count?: number;
};

export const useGroupFiltering = (groups: Group[], searchTerm: string) => {
  const [filteredGroups, setFilteredGroups] = useState<Group[]>(groups);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredGroups(groups);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredGroups(
        groups.filter(
          (group) =>
            group.name.toLowerCase().includes(lowercasedSearch) ||
            (group.description && group.description.toLowerCase().includes(lowercasedSearch)) ||
            (group.location && group.location.toLowerCase().includes(lowercasedSearch))
        )
      );
    }
  }, [searchTerm, groups]);

  return { filteredGroups };
};
