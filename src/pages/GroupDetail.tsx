
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { GroupHeader } from "@/components/groups/GroupHeader";
import { GroupDetailTabs } from "@/components/groups/GroupDetailTabs";
import { GroupDetailActions } from "@/components/groups/GroupDetailActions";
import { 
  getGroupById, 
  getGroupMembers, 
  checkIfUserIsMember,
  checkIfUserIsAdmin,
  joinGroup,
  leaveGroup
} from "@/services/groups";
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

  // Helper function to check if a member is the current user
  const isCurrentUser = (userId: string) => {
    return user?.id === userId;
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
                <GroupDetailTabs
                  group={group}
                  members={members}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  isAdmin={isAdmin}
                  isCurrentUser={isCurrentUser}
                />
                
                <GroupDetailActions
                  isMember={isMember}
                  joining={joining}
                  leaving={leaving}
                  onJoin={handleJoin}
                  onLeave={handleLeave}
                />
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GroupDetail;
