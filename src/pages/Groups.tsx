
import React from "react";
import { GroupsHeader } from "@/components/groups/header/GroupsHeader";
import { UnifiedGroupsGrid } from "@/components/groups/ui/UnifiedGroupsGrid";
import { DatabaseDateChecker } from "@/components/groups/events/forms/DatabaseDateChecker";

const Groups = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <GroupsHeader />
      
      {/* Temporary database checker */}
      <div className="max-w-7xl mx-auto px-3 py-4 md:px-6 md:py-8">
        <DatabaseDateChecker />
      </div>
      
      <main className="max-w-7xl mx-auto px-3 py-4 md:px-6 md:py-8">
        <UnifiedGroupsGrid />
      </main>
    </div>
  );
};

export default Groups;
