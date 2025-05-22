
import { useState, useEffect, useCallback } from "react";
import { fetchUserMemberships } from "../utils/groupUtils";
import { supabase } from "@/integrations/supabase/client";

type Membership = {
  id: string;
  role: string;
  group: {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    created_at: string;
    is_private: boolean;
    member_count?: number;
  };
};

export const useUserMemberships = (userId: string, searchTerm: string = "") => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMemberships = useCallback(async () => {
    try {
      if (!userId) {
        setMemberships([]);
        return;
      }

      setLoading(true);
      const data = await fetchUserMemberships(userId);
      
      // For each group, get the member count
      const membershipsWithCount = await Promise.all(
        data.map(async (membership) => {
          const { count, error } = await supabase
            .from("group_members")
            .select("*", { count: "exact", head: true })
            .eq("group_id", membership.group.id)
            .eq("status", "active");
            
          if (error) {
            console.error(`Error counting members for group ${membership.group.id}:`, error);
            return membership;
          }
          
          return {
            ...membership,
            group: {
              ...membership.group,
              member_count: count || 0
            }
          };
        })
      );
      
      setMemberships(membershipsWithCount);
    } catch (error) {
      console.error("Error in useUserMemberships:", error);
      setMemberships([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMemberships();
  }, [fetchMemberships]);

  // Filter memberships based on searchTerm
  const filteredMemberships = memberships.filter(membership => {
    const searchLower = searchTerm.toLowerCase();
    return (
      membership.group.name.toLowerCase().includes(searchLower) ||
      (membership.group.description && 
       membership.group.description.toLowerCase().includes(searchLower)) ||
      (membership.group.location && 
       membership.group.location.toLowerCase().includes(searchLower))
    );
  });

  const refreshMemberships = async () => {
    return fetchMemberships();
  };

  return { 
    memberships,
    filteredMemberships,
    loading,
    refreshMemberships 
  };
};
