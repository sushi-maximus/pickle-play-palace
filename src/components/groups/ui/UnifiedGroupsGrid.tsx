
import { motion } from "framer-motion";
import { UnifiedGroup } from "../hooks/types/unifiedGroupTypes";
import { GroupCardHybrid1 } from "./GroupCardHybrid1";
import { GroupsLoadingState } from "./GroupsLoadingState";

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

  // Enhanced animation variants with staggered timing
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
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
  };

  if (loading) {
    return <GroupsLoadingState count={6} />;
  }

  if (groups.length === 0) {
    return (
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
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {groups.map((group, index) => (
        <motion.div 
          key={group.id}
          variants={itemVariants}
          style={{
            // Additional stagger delay for larger lists
            transitionDelay: `${index * 50}ms`
          }}
        >
          <GroupCardHybrid1 
            group={group} 
            isMember={group.isMember}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
