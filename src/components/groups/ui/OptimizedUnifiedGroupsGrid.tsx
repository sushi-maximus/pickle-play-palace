
import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { UnifiedGroup } from "../hooks/types/unifiedGroupTypes";
import { OptimizedGroupCardHybrid1 } from "./OptimizedGroupCardHybrid1";
import { GroupsLoadingState } from "./GroupsLoadingState";
import { GroupComponentErrorBoundary } from "../error-boundaries/GroupComponentErrorBoundary";

interface UnifiedGroupsGridProps {
  groups: UnifiedGroup[];
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

const OptimizedUnifiedGroupsGrid = memo(({ 
  groups, 
  loading = false, 
  emptyMessage = "No groups found",
  emptyDescription = "Try adjusting your search criteria or create a new group."
}: UnifiedGroupsGridProps) => {
  console.log("OptimizedUnifiedGroupsGrid rendering with groups:", groups.length, "loading:", loading);

  // Memoize animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  }), []);
  
  const itemVariants = useMemo(() => ({
    hidden: { 
      y: 20, 
      opacity: 0,
      scale: 0.95
    },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }), []);

  // Memoize empty state JSX
  const emptyStateContent = useMemo(() => (
    <motion.div 
      className="text-center py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
      <p className="text-gray-600">{emptyDescription}</p>
    </motion.div>
  ), [emptyMessage, emptyDescription]);

  if (loading) {
    return <GroupsLoadingState count={6} />;
  }

  // Defensive check for groups array
  if (!groups || !Array.isArray(groups) || groups.length === 0) {
    return emptyStateContent;
  }

  return (
    <GroupComponentErrorBoundary>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {groups.map((group, index) => (
          <GroupGridItem
            key={group?.id || `group-${index}`}
            group={group}
            index={index}
            variants={itemVariants}
          />
        ))}
      </motion.div>
    </GroupComponentErrorBoundary>
  );
});

const GroupGridItem = memo(({ group, index, variants }: {
  group: UnifiedGroup;
  index: number;
  variants: any;
}) => {
  // Defensive check for group data
  if (!group || !group.id) {
    console.warn(`Invalid group data at index ${index}:`, group);
    return null;
  }

  return (
    <GroupComponentErrorBoundary
      fallback={
        <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Failed to load group</p>
        </div>
      }
    >
      <motion.div 
        variants={variants}
        style={{
          transitionDelay: `${index * 50}ms`
        }}
      >
        <OptimizedGroupCardHybrid1 
          group={group} 
          isMember={group.isMember}
        />
      </motion.div>
    </GroupComponentErrorBoundary>
  );
});

OptimizedUnifiedGroupsGrid.displayName = "OptimizedUnifiedGroupsGrid";
GroupGridItem.displayName = "GroupGridItem";

export { OptimizedUnifiedGroupsGrid };
