
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { GroupDetailsLoading } from "@/components/groups/GroupDetailsLoading";
import { GroupDetailsContainer } from "@/components/groups/details/GroupDetailsContainer";
import { GroupPostsFeed } from "@/components/groups/posts/GroupPostsFeed";
import { GroupDetailsHeader } from "@/components/groups/GroupDetailsHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const GroupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  
  const breadcrumbItems = [
    { label: "Groups", href: "/groups" },
    { label: "Group Details" }
  ];

  if (!id) {
    return <GroupDetailsLoading />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <GroupDetailsHeader 
            group={null} // Will be loaded by the container
            breadcrumbItems={breadcrumbItems} 
          />
          
          <Tabs 
            defaultValue="posts" 
            className="w-full mt-6"
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList className="mb-6 w-full justify-start bg-card border shadow-sm">
              <TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger>
              <TabsTrigger value="details" className="flex-1">Group Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="mt-0">
              {activeTab === "posts" && (
                <GroupPostsFeed
                  groupId={id}
                  user={user}
                  membershipStatus={{ isMember: true, isPending: false, isAdmin: false }}
                  standalone={true}
                />
              )}
            </TabsContent>
            
            <TabsContent value="details" className="mt-0">
              {activeTab === "details" && (
                <GroupDetailsContainer
                  id={id}
                  user={user}
                  breadcrumbItems={breadcrumbItems}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GroupDetails;
