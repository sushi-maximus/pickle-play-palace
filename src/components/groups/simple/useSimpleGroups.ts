
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Group = Database['public']['Tables']['groups']['Row'];

interface SimpleGroupsHookProps {
  userId?: string;
  searchTerm?: string;
  mode?: 'all' | 'my-groups';
}

export const useSimpleGroups = ({ userId, searchTerm = "", mode = 'all' }: SimpleGroupsHookProps) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false });

      // If mode is 'my-groups', only fetch groups where user is a member
      if (mode === 'my-groups' && userId) {
        const { data: memberGroups, error: memberError } = await supabase
          .from('group_members')
          .select('group_id')
          .eq('user_id', userId)
          .eq('status', 'active');

        if (memberError) {
          throw memberError;
        }

        if (memberGroups && memberGroups.length > 0) {
          const groupIds = memberGroups.map(mg => mg.group_id);
          query = query.in('id', groupIds);
        } else {
          // User has no groups
          setGroups([]);
          setLoading(false);
          return;
        }
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setGroups(data || []);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch groups');
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter groups based on search term
  const filteredGroups = groups.filter(group => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      group.name.toLowerCase().includes(searchLower) ||
      (group.description && group.description.toLowerCase().includes(searchLower)) ||
      (group.location && group.location.toLowerCase().includes(searchLower))
    );
  });

  useEffect(() => {
    fetchGroups();
  }, [userId, mode]);

  return {
    groups: filteredGroups,
    loading,
    error,
    refetch: fetchGroups
  };
};
