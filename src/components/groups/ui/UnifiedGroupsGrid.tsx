
import { OptimizedUnifiedGroupsGrid } from "./OptimizedUnifiedGroupsGrid";
import { VirtualizedGroupsGrid } from "./VirtualizedGroupsGrid";
import type { UnifiedGroup } from "../hooks/types/unifiedGroupTypes";

interface UnifiedGroupsGridProps {
  groups: UnifiedGroup[];
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  virtualizationThreshold?: number;
  containerHeight?: number;
}

export const UnifiedGroupsGrid = ({ 
  groups, 
  loading = false, 
  emptyMessage = "No groups found",
  emptyDescription = "Try adjusting your search criteria or create a new group.",
  virtualizationThreshold = 50, // Use virtualization for 50+ groups
  containerHeight = 600
}: UnifiedGroupsGridProps) => {
  // Use virtualization for large lists to improve performance
  const shouldVirtualize = groups.length >= virtualizationThreshold;

  console.log("UnifiedGroupsGrid: groups count:", groups.length, "shouldVirtualize:", shouldVirtualize);

  if (shouldVirtualize) {
    return (
      <VirtualizedGroupsGrid
        groups={groups}
        loading={loading}
        emptyMessage={emptyMessage}
        emptyDescription={emptyDescription}
        containerHeight={containerHeight}
      />
    );
  }

  // Use regular grid for smaller lists
  return (
    <OptimizedUnifiedGroupsGrid
      groups={groups}
      loading={loading}
      emptyMessage={emptyMessage}
      emptyDescription={emptyDescription}
    />
  );
};
