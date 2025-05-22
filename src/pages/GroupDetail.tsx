
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { GroupHeader } from "@/components/groups/GroupHeader";
import { 
  getGroupById, 
  getGroupMembers, 
  checkIfUserIsMember,
  checkIfUserIsAdmin,
  joinGroup,
  leaveGroup
} from "@/services/groupService";
import { Group, MemberWithProfile } from "@/types/group";

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<MemberWithProfile[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!groupId) return;
      
      setLoading(true);
      try {
        const groupData = await getGroupById(groupId);
        
        if (!groupData) {
          toast.error("Group not found");
          navigate("/groups");
          return;
        }
        
        setGroup(groupData);
        
        const members = await getGroupMembers(groupId);
        setMembers(members);
        
        if (user) {
          const [memberStatus, adminStatus] = await Promise.all([
            checkIfUserIsMember(groupId, user.id),
            checkIfUserIsAdmin(groupId, user.id)
          ]);
          
          setIsMember(memberStatus);
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error("Error fetching group details:", error);
        toast.error("Failed to load group details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroupDetails();
  }, [groupId, user, navigate]);

  const handleJoin = async () => {
    if (!groupId || !user) return;
    
    setJoining(true);
    try {
      await joinGroup(groupId);
      toast.success("Successfully joined group!");
      setIsMember(true);
      
      // Refresh member list
      const members = await getGroupMembers(groupId);
      setMembers(members);
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error("Failed to join group");
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!groupId || !user) return;
    
    setLeaving(true);
    try {
      await leaveGroup(groupId);
      toast.success("Successfully left group");
      setIsMember(false);
      setIsAdmin(false);
      
      // Refresh member list
      const members = await getGroupMembers(groupId);
      setMembers(members);
    } catch (error) {
      console.error("Error leaving group:", error);
      toast.error("Failed to leave group");
    } finally {
      setLeaving(false);
    }
  };

  const breadcrumbItems = [
    { label: "Groups", href: "/groups" },
    { label: group?.name || "Group Details" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost"
              size="sm"
              className="mr-4"
              onClick={() => navigate("/groups")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Groups
            </Button>
            <BreadcrumbNav items={breadcrumbItems} />
          </div>
          
          {group && (
            <div className="space-y-6">
              <GroupHeader 
                group={group} 
                memberCount={members.length}
                isAdmin={isAdmin} 
              />
              
              <div className="flex items-center justify-between">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList>
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
                    {isAdmin && <TabsTrigger value="settings">Settings</TabsTrigger>}
                  </TabsList>
                </Tabs>
                
                {!isMember ? (
                  <Button 
                    onClick={handleJoin} 
                    disabled={joining}
                    className="ml-4"
                  >
                    {joining ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Joining...
                      </>
                    ) : "Join Group"}
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={handleLeave}
                    disabled={leaving}
                    className="ml-4"
                  >
                    {leaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Leaving...
                      </>
                    ) : "Leave Group"}
                  </Button>
                )}
              </div>
              
              <TabsContent value="about" className="pt-4">
                <div className="space-y-6 bg-card p-6 rounded-lg border border-border">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground">
                      {group.description || "No description provided."}
                    </p>
                  </div>
                  
                  {group.location && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Location</h3>
                      <p className="text-muted-foreground">{group.location}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="members" className="pt-4">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="text-lg font-medium mb-4">Group Members</h3>
                  
                  <div className="space-y-4">
                    {members.map(member => (
                      <div 
                        key={member.id} 
                        className="flex items-center justify-between p-3 border-b last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                            {member.profile.first_name ? (
                              `${member.profile.first_name.charAt(0)}${
                                member.profile.last_name ? member.profile.last_name.charAt(0) : ''
                              }`
                            ) : 'U'}
                          </div>
                          <div>
                            <p className="font-medium">
                              {member.profile.first_name} {member.profile.last_name}
                            </p>
                            {member.role === 'admin' && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                Admin
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {isAdmin && member.user_id !== user?.id && (
                          <Button variant="ghost" size="sm">
                            Manage
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              {isAdmin && (
                <TabsContent value="settings" className="pt-4">
                  <div className="bg-card p-6 rounded-lg border border-border">
                    <h3 className="text-lg font-medium mb-4">Group Settings</h3>
                    
                    <div className="space-y-4">
                      <Button>Edit Group Details</Button>
                    </div>
                  </div>
                </TabsContent>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GroupDetail;
