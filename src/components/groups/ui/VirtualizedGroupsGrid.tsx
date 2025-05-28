
import React, { memo, useMemo, useCallback, useRef, useEffect, useState } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import { motion } from "framer-motion";
import type { UnifiedGroup } from "../hooks/types/unifiedGroupTypes";
import { OptimizedGroupCardHybrid1 } from "./OptimizedGroupCardHybrid1";
import { GroupsLoadingState } from "./GroupsLoadingState";
import { GroupComponentErrorBoundary } from "../error-boundaries/GroupComponentErrorBoundary";

interface VirtualizedGroupsGridProps {
  groups: UnifiedGroup[];
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  containerHeight?: number;
  itemsPerRow?: number;
}

// Grid item component for virtualization
const GridItem = memo(({ 
  columnIndex, 
  rowIndex, 
  style, 
  data 
}: {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    groups: UnifiedGroup[];
    itemsPerRow: number;
    containerWidth: number;
  };
}) => {
  const { groups, itemsPerRow } = data;
  const index = rowIndex * itemsPerRow + columnIndex;
  const group = groups[index];

  if (!group) {
    return <div style={style} />;
  }

  return (
    <div style={style}>
      <div className="p-2 h-full">
        <GroupComponentErrorBoundary
          fallback={
            <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Failed to load group</p>
            </div>
          }
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3,
              delay: index * 0.02 // Stagger animation
            }}
            className="h-full"
          >
            <OptimizedGroupCardHybrid1 
              group={group} 
              isMember={group.isMember}
            />
          </motion.div>
        </GroupComponentErrorBoundary>
      </div>
    </div>
  );
});

GridItem.displayName = "VirtualizedGridItem";

const VirtualizedGroupsGrid = memo(({ 
  groups, 
  loading = false, 
  emptyMessage = "No groups found",
  emptyDescription = "Try adjusting your search criteria or create a new group.",
  containerHeight = 600,
  itemsPerRow = 3
}: VirtualizedGroupsGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  console.log("VirtualizedGroupsGrid rendering with groups:", groups.length, "loading:", loading);

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Responsive items per row based on container width
  const responsiveItemsPerRow = useMemo(() => {
    if (containerWidth < 768) return 1; // Mobile: 1 column
    if (containerWidth < 1024) return 2; // Tablet: 2 columns
    return itemsPerRow; // Desktop: configurable columns
  }, [containerWidth, itemsPerRow]);

  // Calculate grid dimensions
  const itemWidth = useMemo(() => {
    return Math.floor((containerWidth - 32) / responsiveItemsPerRow); // 32px for padding
  }, [containerWidth, responsiveItemsPerRow]);

  const itemHeight = 320 + 16; // Card height + padding
  const rowCount = Math.ceil(groups.length / responsiveItemsPerRow);

  // Memoize grid data to prevent recreation
  const gridData = useMemo(() => ({
    groups,
    itemsPerRow: responsiveItemsPerRow,
    containerWidth
  }), [groups, responsiveItemsPerRow, containerWidth]);

  // Memoize empty state content
  const emptyStateContent = useMemo(() => (
    <motion.div 
      className="flex items-center justify-center h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-600">{emptyDescription}</p>
      </div>
    </motion.div>
  ), [emptyMessage, emptyDescription]);

  if (loading) {
    return <GroupsLoadingState count={6} variant="grid" />;
  }

  if (groups.length === 0) {
    return (
      <div ref={containerRef} style={{ height: containerHeight }}>
        {emptyStateContent}
      </div>
    );
  }

  if (containerWidth === 0) {
    // Show loading while measuring container width
    return (
      <div ref={containerRef} style={{ height: containerHeight }}>
        <GroupsLoadingState count={6} variant="grid" />
      </div>
    );
  }

  return (
    <GroupComponentErrorBoundary>
      <div ref={containerRef} className="w-full">
        <Grid
          columnCount={responsiveItemsPerRow}
          columnWidth={itemWidth}
          height={containerHeight}
          rowCount={rowCount}
          rowHeight={itemHeight}
          width={containerWidth}
          itemData={gridData}
          overscanRowCount={1} // Render 1 extra row for smooth scrolling
          style={{
            overflowX: 'hidden' // Prevent horizontal scrolling
          }}
        >
          {GridItem}
        </Grid>
      </div>
    </GroupComponentErrorBoundary>
  );
});

VirtualizedGroupsGrid.displayName = "VirtualizedGroupsGrid";

export { VirtualizedGroupsGrid };
