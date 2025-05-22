
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { GroupHeader } from "@/components/groups/GroupHeader";
import { GroupMembers } from "@/components/groups/GroupMembers";
import { GroupSettings } from "@/components/groups/GroupSettings";
import { 
  getGroupById, 
  getGroupMembers, 
  checkIfUserIsMember,
  checkIfUserIsAdmin,
  joinGroup,
  leaveGroup,
  removeMember
} from "@/services/groupService";
import { Group } from "@/types/group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus, UserMinus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [isMember, setIsMember] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("about");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadGroupData = async () => {
    if (!groupId) return;

    setLoading(true);
    try {
      // Load group data
      const groupData = await getGroupById(groupId);
      if (!groupData) {
        toast.error("Group not found");
        navigate("/groups");
        return;
      }
      setGroup(groupData);

      // Load group members
      const membersData = await getGroupMembers(groupId);
      setMembers(membersData);

      // Check if current user is a member and/or admin
      if (user) {
        const userIsMember = await checkIfUserIsMember(groupId, user.id);
        setIsMember(userIsMember);

        const userIsAdmin = await checkIfUserIsAdmin(groupId, user.id);
        setIsAdmin(userIsAdmin);
      }
    } catch (error) {
      console.error("Error loading group:", error);
      toast.error("Failed to load group information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroupData();
  }, [groupId, user]);

  const handleJoinLeave = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/groups/${groupId}` } });
      return;
    }

    if (!group) return;

    setActionLoading(true);
    try {
      if (isMember) {
        await leaveGroup(group.id);
        toast.success("You have left the group");
        setIsMember(false);
        setIsAdmin(false);
      } else {
        if (group.is_private) {
          toast.error("This is a private group. You need an invitation to join.");
        } else {
          await joinGroup(group.id);
          toast.success("You have joined the group");
          setIsMember(true);
        }
      }
      // Refresh group data
      loadGroupData();
    } catch (error) {
      console.error("Error joining/leaving group:", error);
      toast.error(isMember ? "Failed to leave group" : "Failed to join group");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember(memberId);
      // Refresh members list
      const updatedMembers = await getGroupMembers(groupId!);
      setMembers(updatedMembers);
      return Promise.resolve();
    } catch (error) {
      console.error("Error removing member:", error);
      return Promise.reject(error);
    }
  };

  const handleGroupUpdated = (updatedGroup: Group) => {
    setGroup(updatedGroup);
  };

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: "Groups", link: "/groups" },
    { label: group?.name || "Group Details" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!group) {
    navigate("/groups");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <BreadcrumbNav items={breadcrumbItems} className="mb-6" />
          
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <Button 
                variant="ghost"
                className="mb-4"
                onClick={() => navigate("/groups")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Groups
              </Button>
              
              {user && (
                <Button
                  variant={isMember ? "destructive" : "default"}
                  onClick={handleJoinLeave}
                  disabled={actionLoading || (group.is_private && !isMember)}
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isMember ? "Leaving..." : "Joining..."}
                    </>
                  ) : (
                    <>
                      {isMember ? (
                        <>
                          <UserMinus className="mr-2 h-4 w-4" /> Leave Group
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" /> Join Group
                        </>
                      )}
                    </>
                  )}
                </Button>
              )}
            </div>
            
            <GroupHeader 
              group={group} 
              memberCount={members.length}
              isAdmin={isAdmin}
            />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                {isAdmin && <TabsTrigger value="settings">Settings</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="about">
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-semibold mb-4">Group Description</h2>
                    <p className="text-muted-foreground">
                      {group.description || "This group has no description."}
                    </p>
                  </div>
                  
                  {group.location && (
                    <div className="bg-card rounded-lg border p-6">
                      <h2 className="text-xl font-semibold mb-4">Location</h2>
                      <p className="text-muted-foreground">{group.location}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="members">
                <GroupMembers 
                  members={members} 
                  currentUserId={user?.id}
                  isCurrentUserAdmin={isAdmin}
                  onRemoveMember={handleRemoveMember}
                />
              </TabsContent>
              
              {isAdmin && (
                <TabsContent value="settings">
                  <GroupSettings 
                    group={group}
                    onGroupUpdated={handleGroupUpdated} 
                  />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GroupDetail;
