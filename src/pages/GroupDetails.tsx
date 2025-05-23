import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { fetchGroupDetails } from "@/components/groups/utils";
import { checkMembershipStatus } from "@/components/groups/services";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { GroupMembersList } from "@/components/groups/GroupMembersList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JoinRequestDialog } from "@/components/groups/JoinRequestDialog";
import { JoinRequestsManager } from "@/components/groups/JoinRequestsManager";
import { GroupDetailsHeader } from "@/components/groups/GroupDetailsHeader";
import { GroupAboutTab } from "@/components/groups/GroupAboutTab";
import { GroupDetailsLoading } from "@/components/groups/GroupDetailsLoading";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const GroupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [membershipStatus, setMembershipStatus] = useState({
    isMember: false,
    isPending: false,
    isAdmin: false
  });
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [hasPendingRequests, setHasPendingRequests] = useState(false);
  
  const breadcrumbItems = [
    { label: "Groups", href: "/groups" },
    { label: group?.name || "Group Details" }
  ];

  useEffect(() => {
    const loadGroupDetails = async () => {
      setLoading(true);
      
      try {
        if (!id) {
          toast.error("Group ID is missing");
          navigate("/groups");
          return;
        }
        
        const groupData = await fetchGroupDetails(id);
        
        if (!groupData) {
          toast.error("Group not found");
          navigate("/groups");
          return;
        }
        
        setGroup(groupData);
      } catch (error) {
        console.error("Failed to load group details:", error);
        toast.error("Failed to load group details");
      } finally {
        setLoading(false);
      }
    };
    
    loadGroupDetails();
  }, [id, navigate]);
  
  useEffect(() => {
    const checkMembership = async () => {
      if (user && group) {
        const status = await checkMembershipStatus(user.id, group.id);
        setMembershipStatus(status);
      }
    };
    
    checkMembership();
  }, [user, group]);
  
  useEffect(() => {
    const checkPendingRequests = async () => {
      if (user && group && membershipStatus.isAdmin) {
        try {
          const { data, error } = await supabase
            .from("group_members")
            .select("id")
            .eq("group_id", group.id)
            .eq("status", "pending")
            .limit(1);
            
          if (!error && data) {
            setHasPendingRequests(data.length > 0);
          }
        } catch (error) {
          console.error("Error checking pending requests:", error);
        }
      }
    };
    
    checkPendingRequests();
  }, [group, user, membershipStatus.isAdmin]);
  
  const handleJoinRequest = () => {
    if (!user) {
      toast.error("You need to be logged in to request to join");
      navigate("/login", { state: { from: `/groups/${id}` } });
      return;
    }
    
    setJoinDialogOpen(true);
  };
  
  const handleJoinSuccess = () => {
    setMembershipStatus(prev => ({ ...prev, isPending: true }));
  };

  // Determine the default tab based on admin status and pending requests
  const getDefaultTab = () => {
    if (membershipStatus.isAdmin && hasPendingRequests) {
      return "requests";
    }
    return "members";
  };

  if (loading) {
    return <GroupDetailsLoading />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <GroupDetailsHeader 
            group={group} 
            breadcrumbItems={breadcrumbItems} 
          />
          
          <Card className="w-full mb-6 overflow-hidden">
            <CardContent className="pt-6">
              <Tabs defaultValue={getDefaultTab()} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="members">
                    Members ({group?.member_count || 0})
                  </TabsTrigger>
                  {membershipStatus.isAdmin && (
                    <TabsTrigger value="requests">Requests</TabsTrigger>
                  )}
                  <TabsTrigger value="about">About</TabsTrigger>
                </TabsList>
                
                <TabsContent value="members">
                  <h3 className="text-lg font-medium mb-4">Group Members</h3>
                  <GroupMembersList members={group?.members || []} />
                </TabsContent>
                
                {membershipStatus.isAdmin && (
                  <TabsContent value="requests">
                    <JoinRequestsManager 
                      groupId={group?.id} 
                      isAdmin={membershipStatus.isAdmin} 
                    />
                  </TabsContent>
                )}
                
                <TabsContent value="about">
                  <GroupAboutTab 
                    description={group?.description} 
                    user={user} 
                    membershipStatus={membershipStatus}
                    onJoinRequest={handleJoinRequest}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {group && user && (
            <JoinRequestDialog
              groupId={group.id}
              groupName={group.name}
              userId={user.id}
              isOpen={joinDialogOpen}
              onClose={() => setJoinDialogOpen(false)}
              onSuccess={handleJoinSuccess}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GroupDetails;
