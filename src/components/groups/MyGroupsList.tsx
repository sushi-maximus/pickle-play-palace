
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CreateGroupDialog } from "@/components/groups/CreateGroupDialog";
import { fetchUserMemberships } from "./utils/groupUtils";
import { SearchFilter } from "./SearchFilter";

interface MyGroupsListProps {
  user: any;
  onRefresh: () => void;
}

export const MyGroupsList = ({ user, onRefresh }: MyGroupsListProps) => {
  const [memberships, setMemberships] = useState<any[]>([]);
  const [filteredMemberships, setFilteredMemberships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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
    if (user) {
      fetchMemberships();
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredMemberships(memberships);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredMemberships(
        memberships.filter(
          (membership) =>
            membership.group.name.toLowerCase().includes(lowercasedSearch) ||
            (membership.group.description && 
              membership.group.description.toLowerCase().includes(lowercasedSearch)) ||
            (membership.group.location && 
              membership.group.location.toLowerCase().includes(lowercasedSearch))
        )
      );
    }
  }, [searchTerm, memberships]);

  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const membershipData = await fetchUserMemberships(user.id);
      setMemberships(membershipData);
      setFilteredMemberships(membershipData);
    } catch (error) {
      console.error("Error fetching memberships:", error);
      toast.error("Failed to load your groups");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  if (loading) {
    return (
      <>
        <SearchFilter onSearch={handleSearch} placeholder="Search my groups..." />
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
      </>
    );
  }

  if (memberships.length === 0) {
    return (
      <>
        <SearchFilter onSearch={handleSearch} placeholder="Search my groups..." />
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-2xl font-bold mb-2">You haven't joined any groups yet</h3>
          <p className="text-muted-foreground mb-6">Create your first group or join an existing one</p>
          <CreateGroupDialog 
            trigger={
              <Button className="hover-scale">
                <Users className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            }
            onSuccess={() => {
              onRefresh();
              fetchMemberships();
            }}
          />
        </div>
      </>
    );
  }

  if (filteredMemberships.length === 0 && searchTerm) {
    return (
      <>
        <SearchFilter onSearch={handleSearch} placeholder="Search my groups..." />
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-2xl font-bold mb-2">No matching groups</h3>
          <p className="text-muted-foreground mb-6">
            None of your groups match "{searchTerm}". Try a different search term.
          </p>
          <Button variant="outline" onClick={() => setSearchTerm("")}>
            Clear search
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <SearchFilter onSearch={handleSearch} placeholder="Search my groups..." />
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredMemberships.map((membership) => (
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
                  {membership.role === "admin" && (
                    <div className="text-xs font-medium mt-2 inline-block bg-primary/20 px-2 py-0.5 rounded-full">
                      Admin
                    </div>
                  )}
                  {membership.group.is_private && (
                    <div className="text-xs font-medium mt-2 ml-2 inline-block bg-secondary/50 px-2 py-0.5 rounded-full">
                      Private
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {membership.group.description || "No description provided."}
                </p>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button 
                  variant="default" 
                  className="w-full hover:bg-primary/90"
                  onClick={() => navigate(`/groups/${membership.group.id}`)}
                >
                  View Group
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};
