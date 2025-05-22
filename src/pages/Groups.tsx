
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { fetchPublicGroups, fetchUserGroups, joinGroup, leaveGroup } from "@/services/groupService";
import { GroupWithMemberCount } from "@/types/group";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const Groups = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [publicGroups, setPublicGroups] = useState<GroupWithMemberCount[]>([]);
  const [myGroups, setMyGroups] = useState<GroupWithMemberCount[]>([]);
  const [loading, setLoading] = useState({ public: true, my: true });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("discover");

  const loadGroups = async () => {
    if (user) {
      setLoading(prev => ({ ...prev, my: true }));
      try {
        const userGroups = await fetchUserGroups();
        setMyGroups(userGroups);
      } catch (error) {
        console.error("Error fetching user groups:", error);
        toast.error("Failed to load your groups");
      } finally {
        setLoading(prev => ({ ...prev, my: false }));
      }
    }
    
    setLoading(prev => ({ ...prev, public: true }));
    try {
      const groups = await fetchPublicGroups();
      setPublicGroups(groups);
    } catch (error) {
      console.error("Error fetching public groups:", error);
      toast.error("Failed to load groups");
    } finally {
      setLoading(prev => ({ ...prev, public: false }));
    }
  };

  useEffect(() => {
    loadGroups();
  }, [user]);

  const handleJoinGroup = async (groupId: string) => {
    if (!user) {
      navigate("/login", { state: { from: "/groups" } });
      return;
    }

    try {
      await joinGroup(groupId);
      toast.success("Successfully joined group!");
      loadGroups(); // Refresh group lists
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error("Failed to join group");
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    try {
      await leaveGroup(groupId);
      toast.success("Successfully left group");
      loadGroups(); // Refresh group lists
    } catch (error) {
      console.error("Error leaving group:", error);
      toast.error("Failed to leave group");
    }
  };

  const filteredPublicGroups = publicGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (group.location && group.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredMyGroups = myGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (group.location && group.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get IDs of groups the user is a member of for the join/leave button logic
  const myGroupIds = myGroups.map(group => group.id);

  const breadcrumbItems = [{ label: "Groups" }];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <BreadcrumbNav items={breadcrumbItems} className="mb-6" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Pickleball Groups</h1>
              <p className="text-muted-foreground mt-1">Join groups to connect with other players and organize games</p>
            </div>
            
            {user && (
              <Button onClick={() => navigate('/create-group')}>Create Group</Button>
            )}
          </div>
          
          <div className="relative mb-6">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search groups..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="discover">Discover Groups</TabsTrigger>
              {user && <TabsTrigger value="my">My Groups</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="discover" className="space-y-6">
              {loading.public ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredPublicGroups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPublicGroups.map(group => (
                    <div 
                      key={group.id}
                      className="border rounded-lg p-4 hover:shadow-md transition"
                      onClick={() => navigate(`/groups/${group.id}`)}
                    >
                      <h3 className="font-semibold text-lg">{group.name}</h3>
                      {group.description && (
                        <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                          {group.description}
                        </p>
                      )}
                      <div className="flex items-center mt-4">
                        <span className="text-sm text-muted-foreground">
                          {group.member_count} members
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="ml-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            myGroupIds.includes(group.id) 
                              ? handleLeaveGroup(group.id)
                              : handleJoinGroup(group.id);
                          }}
                        >
                          {myGroupIds.includes(group.id) ? "Leave" : "Join"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">No groups found</h3>
                  <p className="text-muted-foreground mt-1">
                    {searchQuery ? `No groups matching "${searchQuery}"` : "There are no public groups yet"}
                  </p>
                </div>
              )}
            </TabsContent>
            
            {user && (
              <TabsContent value="my" className="space-y-6">
                {loading.my ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredMyGroups.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMyGroups.map(group => (
                      <div 
                        key={group.id}
                        className="border rounded-lg p-4 hover:shadow-md transition"
                        onClick={() => navigate(`/groups/${group.id}`)}
                      >
                        <h3 className="font-semibold text-lg">{group.name}</h3>
                        {group.description && (
                          <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                            {group.description}
                          </p>
                        )}
                        <div className="flex items-center mt-4">
                          <span className="text-sm text-muted-foreground">
                            {group.member_count} members
                          </span>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="ml-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLeaveGroup(group.id);
                            }}
                          >
                            Leave
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium">You haven't joined any groups yet</h3>
                    <p className="text-muted-foreground mt-1">
                      {searchQuery 
                        ? `No groups matching "${searchQuery}"` 
                        : "Join groups to connect with other players or create your own"}
                    </p>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Groups;
