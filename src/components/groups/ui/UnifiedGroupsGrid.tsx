
import { OptimizedUnifiedGroupsGrid } from "./OptimizedUnifiedGroupsGrid";
import type { UnifiedGroup } from "../hooks/types/unifiedGroupTypes";

interface UnifiedGroupsGridProps {
  groups: UnifiedGroup[];
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

// Use the optimized version directly
export const UnifiedGroupsGrid = OptimizedUnifiedGroupsGrid;
