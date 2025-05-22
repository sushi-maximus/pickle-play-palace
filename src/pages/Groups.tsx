
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { useAuth } from "@/contexts/AuthContext";
import { GroupsList } from "@/components/groups/GroupsList";
import { GroupsHeader } from "@/components/groups/GroupsHeader";
import { LoginPrompt } from "@/components/groups/LoginPrompt";
import { MyGroupsList } from "@/components/groups/MyGroupsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Groups = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user } = useAuth();
  const breadcrumbItems = [{ label: "Groups" }];

  const handleRefreshGroups = async () => {
    // Increment the refresh trigger to cause the GroupsList to refetch data
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <BreadcrumbNav items={breadcrumbItems} className="mb-8" />
          
          <GroupsHeader 
            user={user} 
            onRefresh={handleRefreshGroups} 
          />

          {!user ? (
            <LoginPrompt />
          ) : (
            <Tabs defaultValue="all" className="mt-8">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Groups</TabsTrigger>
                <TabsTrigger value="my-groups">My Groups</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <GroupsList 
                  user={user} 
                  key={`all-${refreshTrigger}`} 
                />
              </TabsContent>
              <TabsContent value="my-groups">
                <MyGroupsList 
                  user={user} 
                  onRefresh={handleRefreshGroups}
                  key={`my-${refreshTrigger}`} 
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Groups;
