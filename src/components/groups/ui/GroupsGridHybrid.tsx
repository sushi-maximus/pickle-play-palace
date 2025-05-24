
import { motion } from "framer-motion";
import { GroupCardHybrid1 } from "./GroupCardHybrid1";
import { UnifiedGroup } from "../hooks/types/unifiedGroupTypes";

interface GroupsGridHybridProps {
  groups: UnifiedGroup[];
}

export const GroupsGridHybrid = ({ groups }: GroupsGridHybridProps) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {groups.map((group) => (
        <motion.div 
          key={group.id}
          variants={itemVariants}
        >
          <GroupCardHybrid1 group={group} />
        </motion.div>
      ))}
    </motion.div>
  );
};
