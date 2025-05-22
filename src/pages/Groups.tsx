
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Users, Plus, LogIn } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateGroupDialog } from "@/components/groups/CreateGroupDialog";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Group = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  created_at: string;
  member_count?: number;
};

const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const breadcrumbItems = [{ label: "Groups" }];

  useEffect(() => {
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

    fetchGroups();
  }, [user]);

  const handleRefreshGroups = async () => {
    setLoading(true);
    try {
      if (user) {
        const { data, error } = await supabase
          .from("groups")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setGroups(data || []);
      }
    } catch (error) {
      console.error("Error refreshing groups:", error);
      toast.error("Failed to refresh groups");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginPrompt = () => {
    toast.info("Please log in to create or view groups");
    navigate("/login", { state: { returnUrl: "/groups" } });
  };

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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <BreadcrumbNav items={breadcrumbItems} className="mb-8" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold">Groups</h1>
            
            {user ? (
              <CreateGroupDialog 
                trigger={
                  <Button className="hover-scale">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Group
                  </Button>
                }
                onSuccess={handleRefreshGroups}
              />
            ) : (
              <Button onClick={handleLoginPrompt} className="hover-scale">
                <LogIn className="mr-2 h-4 w-4" />
                Log in to Create Group
              </Button>
            )}
          </div>

          {!user ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-2xl font-bold mb-2">Please log in</h3>
              <p className="text-muted-foreground mb-6">You need to be logged in to view and create groups</p>
              <Button onClick={handleLoginPrompt}>
                <LogIn className="mr-2 h-4 w-4" />
                Log in
              </Button>
            </div>
          ) : loading ? (
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
          ) : groups.length > 0 ? (
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
                        <CardTitle className="text-xl">{group.name}</CardTitle>
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
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-2xl font-bold mb-2">No groups yet</h3>
              <p className="text-muted-foreground mb-6">Create your first group to get started</p>
              <CreateGroupDialog 
                trigger={
                  <Button className="hover-scale">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Group
                  </Button>
                }
                onSuccess={handleRefreshGroups}
              />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Groups;
