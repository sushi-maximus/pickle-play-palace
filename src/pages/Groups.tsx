
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { 
  fetchPublicGroups, 
  fetchUserGroups, 
  joinGroup, 
  leaveGroup 
} from "@/services/groups";
import { GroupWithMemberCount } from "@/types/group";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CreateGroupDialog } from "@/components/groups/CreateGroupDialog";
import { GroupsGrid } from "@/components/groups/GroupsGrid";
import { GroupSearchBar } from "@/components/groups/GroupSearchBar";

const Groups = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [publicGroups, setPublicGroups] = useState<GroupWithMemberCount[]>([]);
  const [myGroups, setMyGroups] = useState<GroupWithMemberCount[]>([]);
  const [loading, setLoading] = useState({ public: true, my: true });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("discover");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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
              <Button onClick={() => setIsCreateDialogOpen(true)}>Create Group</Button>
            )}
          </div>
          
          <GroupSearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="discover">Discover Groups</TabsTrigger>
              {user && <TabsTrigger value="my">My Groups</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="discover" className="space-y-6">
              <GroupsGrid
                groups={filteredPublicGroups}
                myGroupIds={myGroupIds}
                loading={loading.public}
                emptyMessage="There are no public groups yet"
                searchQuery={searchQuery}
                onJoinGroup={handleJoinGroup}
                onLeaveGroup={handleLeaveGroup}
              />
            </TabsContent>
            
            {user && (
              <TabsContent value="my" className="space-y-6">
                <GroupsGrid
                  groups={filteredMyGroups}
                  myGroupIds={myGroupIds}
                  loading={loading.my}
                  emptyMessage="You haven't joined any groups yet. Join groups to connect with other players or create your own"
                  searchQuery={searchQuery}
                  onJoinGroup={handleJoinGroup}
                  onLeaveGroup={handleLeaveGroup}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      
      <Footer />

      {/* Create Group Dialog */}
      <CreateGroupDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onGroupCreated={loadGroups}
      />
    </div>
  );
};

export default Groups;
