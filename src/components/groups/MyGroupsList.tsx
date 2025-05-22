import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, LogOut, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { fetchUserMemberships } from "./utils/groupUtils";

type GroupMembership = {
  id: string;
  group: {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    created_at: string;
    is_private: boolean;
  };
  role: string;
};

interface MyGroupsListProps {
  user: any;
  onRefresh: () => void;
}

export const MyGroupsList = ({ user, onRefresh }: MyGroupsListProps) => {
  const [groupMemberships, setGroupMemberships] = useState<GroupMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchMyGroups();
  }, [user]);

  const fetchMyGroups = async () => {
    setLoading(true);
    try {
      if (!user) {
        setGroupMemberships([]);
        return;
      }
      
      const memberships = await fetchUserMemberships(user.id);
      setGroupMemberships(memberships);
    } catch (error) {
      console.error("Error fetching my groups:", error);
      toast.error("Failed to load your groups");
    } finally {
      setLoading(false);
    }
  };

  const leaveGroup = async (groupMembershipId: string, groupName: string) => {
    try {
      // Don't allow leaving groups you created (only actual memberships have valid UUIDs)
      if (groupMembershipId.startsWith('created-')) {
        toast.error("You cannot leave a group you created");
        return;
      }
      
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("id", groupMembershipId);

      if (error) throw error;
      
      toast.success(`You have left the group "${groupName}"`);
      fetchMyGroups();
      onRefresh(); // Refresh the main groups list
    } catch (error) {
      console.error("Error leaving group:", error);
      toast.error("Failed to leave group");
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-card border-2 border-transparent opacity-50">
            <CardHeader className="animate-pulse bg-muted h-32"></CardHeader>
            <CardContent className="pt-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-5/6"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (groupMemberships.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-bold mb-2">You haven't joined any groups yet</h3>
        <p className="text-muted-foreground mb-6">Join a group to connect with others</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {groupMemberships.map((membership) => (
        <motion.div 
          key={membership.id}
          variants={itemVariants}
        >
          <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-300 border-2 border-transparent hover:border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center">
                  {membership.group.name}
                  {membership.group.is_private && (
                    <Lock className="h-4 w-4 ml-2 text-muted-foreground" />
                  )}
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
              <CardDescription>
                {membership.group.location && (
                  <div className="text-sm mt-1">{membership.group.location}</div>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  Created {new Date(membership.group.created_at).toLocaleDateString()}
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="text-xs font-medium inline-block bg-secondary/50 px-2 py-0.5 rounded-full">
                    Role: {membership.role === "admin" ? "Admin" : "Member"}
                  </div>
                  {membership.group.is_private && (
                    <div className="text-xs font-medium inline-block bg-secondary/50 px-2 py-0.5 rounded-full">
                      Private Group
                    </div>
                  )}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                {membership.group.description || "No description provided."}
              </p>
            </CardContent>
            <CardFooter className="border-t pt-4 flex gap-2">
              <Button 
                variant="default" 
                className="flex-1"
                onClick={() => navigate(`/groups/${membership.group.id}`)}
              >
                View Group
              </Button>
              <Button 
                variant="outline" 
                className="flex-none text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-800"
                onClick={() => leaveGroup(membership.id, membership.group.name)}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
