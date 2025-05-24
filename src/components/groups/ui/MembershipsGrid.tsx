
import { motion } from "framer-motion";
import { GroupCardHybrid1 } from "./GroupCardHybrid1";

interface Membership {
  id: string;
  role: string;
  group: any;
}

interface MembershipsGridProps {
  memberships: Membership[];
}

export const MembershipsGrid = ({ memberships }: MembershipsGridProps) => {
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
      {memberships.map((membership) => (
        <motion.div 
          key={membership.id}
          variants={itemVariants}
        >
          <GroupCardHybrid1 group={membership.group} isMember={true} />
        </motion.div>
      ))}
    </motion.div>
  );
};
