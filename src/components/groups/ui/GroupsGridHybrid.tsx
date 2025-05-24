
import { motion } from "framer-motion";
import { GroupCardHybrid1 } from "./GroupCardHybrid1";

type Group = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  created_at: string;
  is_private: boolean;
  member_count?: number;
};

interface GroupsGridHybridProps {
  groups: Group[];
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
