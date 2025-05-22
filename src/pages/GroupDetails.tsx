import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { fetchGroupDetails } from "@/components/groups/utils/groupUtils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Lock, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";
import { GroupMembersList } from "@/components/groups/GroupMembersList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GroupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <BreadcrumbNav items={breadcrumbItems} className="mb-8" />
            <Card className="w-full mb-6">
              <CardHeader>
                <Skeleton className="h-8 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-10 w-1/4" />
              </CardContent>
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
          
          <Button 
            variant="outline"
            size="sm"
            className="mb-6"
            onClick={() => navigate("/groups")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Groups
          </Button>
          
          <Card className="w-full mb-6 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl flex items-center">
                  {group.name}
                  {group.is_private && (
                    <Lock className="h-5 w-5 ml-2 text-muted-foreground" />
                  )}
                </CardTitle>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {group.member_count || 0} {group.member_count === 1 ? 'member' : 'members'}
                </Badge>
                
                {group.is_private && (
                  <Badge variant="outline">Private</Badge>
                )}
                
                {group.location && (
                  <Badge variant="outline" className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {group.location}
                  </Badge>
                )}
                
                <Badge variant="outline" className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Created {new Date(group.created_at).toLocaleDateString()}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="members">
                    Members ({group.member_count || 0})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="about">
                  <div className="prose dark:prose-invert">
                    <h3 className="text-lg font-medium mb-2">About this group</h3>
                    <p className="text-muted-foreground">
                      {group.description || "No description provided."}
                    </p>
                  </div>
                  
                  {user && (
                    <div className="mt-6 flex gap-4">
                      <Button>Join Group</Button>
                      <Button variant="outline">Contact Admin</Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="members">
                  <h3 className="text-lg font-medium mb-4">Group Members</h3>
                  <GroupMembersList members={group.members || []} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GroupDetails;
