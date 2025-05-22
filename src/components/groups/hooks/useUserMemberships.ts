
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchUserMemberships } from "../utils/groupUtils";

type Membership = {
  id: string;
  group: {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    created_at: string;
    is_private: boolean;
  };
  role: string;
};

export const useUserMemberships = (userId: string, searchTerm: string = "") => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [filteredMemberships, setFilteredMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchMemberships();
    }
  }, [userId]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredMemberships(memberships);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredMemberships(
        memberships.filter(
          (membership) =>
            membership.group.name.toLowerCase().includes(lowercasedSearch) ||
            (membership.group.description && 
              membership.group.description.toLowerCase().includes(lowercasedSearch)) ||
            (membership.group.location && 
              membership.group.location.toLowerCase().includes(lowercasedSearch))
        )
      );
    }
  }, [searchTerm, memberships]);

  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const membershipData = await fetchUserMemberships(userId);
      setMemberships(membershipData);
      setFilteredMemberships(membershipData);
    } catch (error) {
      console.error("Error fetching memberships:", error);
      toast.error("Failed to load your groups");
    } finally {
      setLoading(false);
    }
  };

  return { memberships, filteredMemberships, loading, refreshMemberships: fetchMemberships };
};
