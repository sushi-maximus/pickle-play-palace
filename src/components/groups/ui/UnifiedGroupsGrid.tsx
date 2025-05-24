
import { UnifiedGroup } from "../hooks/types/unifiedGroupTypes";
import { GroupCardHybrid1 } from "./GroupCardHybrid1";

interface UnifiedGroupsGridProps {
  groups: UnifiedGroup[];
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

export const UnifiedGroupsGrid = ({ 
  groups, 
  loading = false, 
  emptyMessage = "No groups found",
  emptyDescription = "Try adjusting your search criteria or create a new group."
}: UnifiedGroupsGridProps) => {
  console.log("UnifiedGroupsGrid rendering with groups:", groups.length, "loading:", loading);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-80 bg-white rounded-lg border animate-pulse">
            <div className="h-full flex flex-col justify-between p-6">
              <div className="flex justify-between items-start">
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              </div>
              <div className="grid grid-cols-3 gap-3 bg-gray-100 rounded-lg p-3">
                <div className="text-center">
                  <div className="h-6 w-8 bg-gray-200 rounded mx-auto mb-1"></div>
                  <div className="h-3 w-12 bg-gray-200 rounded mx-auto"></div>
                </div>
                <div className="text-center">
                  <div className="h-6 w-8 bg-gray-200 rounded mx-auto mb-1"></div>
                  <div className="h-3 w-8 bg-gray-200 rounded mx-auto"></div>
                </div>
                <div className="text-center">
                  <div className="h-6 w-8 bg-gray-200 rounded mx-auto mb-1"></div>
                  <div className="h-3 w-12 bg-gray-200 rounded mx-auto"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                </div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-600">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {groups.map((group) => (
        <GroupCardHybrid1 
          key={group.id} 
          group={group} 
          isMember={group.isMember}
        />
      ))}
    </div>
  );
};
