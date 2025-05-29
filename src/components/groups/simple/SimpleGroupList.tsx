
import { SimpleGroupCard } from "./SimpleGroupCard";
import type { Database } from "@/integrations/supabase/types";

type Group = Database['public']['Tables']['groups']['Row'];

interface SimpleGroupListProps {
  groups: Group[];
  loading?: boolean;
}

export const SimpleGroupList = ({ groups, loading }: SimpleGroupListProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-48"></div>
          </div>
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-2">No groups found</div>
        <p className="text-sm text-gray-400">
          Try adjusting your search or check back later
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <SimpleGroupCard key={group.id} group={group} />
      ))}
    </div>
  );
};
