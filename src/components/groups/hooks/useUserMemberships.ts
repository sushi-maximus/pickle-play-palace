import { useState, useEffect } from "react";
import { fetchUserMemberships } from "../utils";

interface Membership {
  id: string;
  role: string;
  group: any; // Adjust type as needed
}

export const useUserMemberships = (userId: string, searchTerm: string) => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [filteredMemberships, setFilteredMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshMemberships = async () => {
    setLoading(true);
    try {
      const data = await fetchUserMemberships(userId);
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
