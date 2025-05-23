
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupSettingsGeneral } from "@/components/groups/settings/GroupSettingsGeneral";
import { GroupSettingsMembers } from "@/components/groups/settings/GroupSettingsMembers";
import { GroupSettingsPermissions } from "@/components/groups/settings/GroupSettingsPermissions";
import { fetchGroupDetails } from "@/components/groups/utils/groupUtils";
import { checkGroupAdmin } from "@/components/groups/utils/groupUtils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const GroupSettings = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const breadcrumbItems = [
    { label: "Groups", href: "/groups" },
    { label: group?.name || "Group", href: `/groups/${id}` },
    { label: "Settings" }
  ];

  useEffect(() => {
    const loadGroupAndCheckPermissions = async () => {
      setLoading(true);
      
      try {
        if (!id || !user) {
          navigate("/groups");
          return;
        }
        
        const [groupData, adminStatus] = await Promise.all([
          fetchGroupDetails(id),
          checkGroupAdmin(user.id, id)
        ]);
        
        if (!groupData) {
          toast.error("Group not found");
          navigate("/groups");
          return;
        }

        if (!adminStatus) {
          toast.error("You don't have permission to access group settings");
          navigate(`/groups/${id}`);
          return;
        }
        
        setGroup(groupData);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Failed to load group settings:", error);
        toast.error("Failed to load group settings");
        navigate(`/groups/${id}`);
      } finally {
        setLoading(false);
      }
    };
    
    loadGroupAndCheckPermissions();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <Skeleton className="h-8 w-64 mb-8" />
            <Card className="w-full mb-6">
              <div className="p-6">
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-32 w-full" />
              </div>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <BreadcrumbNav items={breadcrumbItems} className="mb-8" />
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{group.name} Settings</h1>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => navigate(`/groups/${id}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Group
            </Button>
          </div>
          
          <Card className="mb-6">
            <Tabs defaultValue="general" className="w-full p-6">
              <TabsList className="mb-6">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <GroupSettingsGeneral group={group} setGroup={setGroup} />
              </TabsContent>
              
              <TabsContent value="members">
                <GroupSettingsMembers group={group} />
              </TabsContent>
              
              <TabsContent value="permissions">
                <GroupSettingsPermissions group={group} setGroup={setGroup} />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GroupSettings;
