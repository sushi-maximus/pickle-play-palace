
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CreateGroupDialog } from "@/components/groups/CreateGroupDialog";

type Group = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  created_at: string;
  is_private: boolean;
  member_count?: number;
};

interface GroupsListProps {
  user: any;
}

export const GroupsList = ({ user }: GroupsListProps) => {
  const [groups, setGroups] = useState<Group[]>([]);
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
    fetchGroups();
  }, [user]);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      // Only fetch groups if the user is logged in
      if (user) {
        const { data, error } = await supabase
          .from("groups")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setGroups(data || []);
      } else {
        setGroups([]);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Failed to load groups");
    } finally {
      setLoading(false);
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

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-bold mb-2">No groups yet</h3>
        <p className="text-muted-foreground mb-6">Create your first group to get started</p>
        <CreateGroupDialog 
          trigger={
            <Button className="hover-scale">
              <Users className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          }
          onSuccess={fetchGroups}
        />
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
      {groups.map((group) => (
        <motion.div 
          key={group.id}
          variants={itemVariants}
        >
          <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-300 border-2 border-transparent hover:border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center">
                  {group.name}
                  {group.is_private && (
                    <Lock className="h-4 w-4 ml-2 text-muted-foreground" />
                  )}
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
              <CardDescription>
                {group.location && (
                  <div className="text-sm mt-1">{group.location}</div>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  Created {new Date(group.created_at).toLocaleDateString()}
                </div>
                {group.is_private && (
                  <div className="text-xs font-medium mt-2 inline-block bg-secondary/50 px-2 py-0.5 rounded-full">
                    Private Group
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">
                {group.description || "No description provided."}
              </p>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button 
                variant="default" 
                className="w-full hover:bg-primary/90"
                onClick={() => navigate(`/groups/${group.id}`)}
              >
                View Group
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
