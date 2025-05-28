
import React from 'react';
import { GroupCardHybrid1 } from './GroupCardHybrid1';
import type { Database } from "@/integrations/supabase/types";

type Group = Database['public']['Tables']['groups']['Row'] & {
  member_count: number;
  isMember: boolean;
  membershipRole?: string;
  membershipId?: string;
};

interface GroupCardShowcaseProps {
  group?: Group;
}

export const GroupCardShowcase = ({ group }: GroupCardShowcaseProps) => {
  // If no group is provided, don't render anything
  if (!group) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Group Card Showcase</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <GroupCardHybrid1 
          group={group}
          isAdmin={group.membershipRole === 'admin'}
        />
      </div>
    </div>
  );
};
