
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Users } from "lucide-react";

type Group = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  created_at: string;
  is_private: boolean;
  member_count?: number;
};

interface GroupsGridProps {
  groups: Group[];
}

const SimpleGroupCard = ({ group }: { group: Group }) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {group.name}
          {group.is_private && <Lock className="h-4 w-4" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-gray-600 mb-3">
          {group.description || "No description available"}
        </p>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            {group.member_count || 0}
          </Badge>
          {group.location && (
            <Badge variant="secondary" className="text-xs">
              {group.location}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const GroupsGrid = ({ groups }: GroupsGridProps) => {
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
          <SimpleGroupCard group={group} />
        </motion.div>
      ))}
    </motion.div>
  );
};
