
import { useState, useEffect } from "react";
import { fetchUserMembershipsOptimized } from "../utils/groupDataUtils"; // Phase 2: Use optimized function

interface Membership {
  id: string;
  role: string;
  group: any; // Using Database types now
}

export const useUserMemberships = (userId: string, searchTerm: string) => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [filteredMemberships, setFilteredMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshMemberships = async () => {
    setLoading(true);
    try {
      const data = await fetchUserMembershipsOptimized(userId); // Phase 2: Use optimized function
      setMemberships(data);
    } catch (error) {
      console.error("Error fetching user memberships:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMemberships();
  }, [userId]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = memberships.filter(membership => {
      if (!membership.group) return false; // Skip if group is null
      return membership.group.name.toLowerCase().includes(lowerCaseSearchTerm);
    });
    setFilteredMemberships(filtered);
  }, [memberships, searchTerm]);

  return {
    memberships,
    filteredMemberships,
    loading,
    refreshMemberships
  };
};
