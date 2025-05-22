
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
import { SearchFilter } from "@/components/groups/SearchFilter";

const Groups = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const breadcrumbItems = [{ label: "Groups" }];

  const handleRefreshGroups = async () => {
    // Increment the refresh trigger to cause the GroupsList to refetch data
    setRefreshTrigger(prev => prev + 1);
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
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
            <>
              <div className="mt-8 mb-4">
                <SearchFilter onSearch={handleSearch} placeholder="Search all groups..." />
              </div>
              <Tabs defaultValue="my-groups" className="mt-4">
                <TabsList className="mb-6">
                  <TabsTrigger value="my-groups">My Groups</TabsTrigger>
                  <TabsTrigger value="all">All Groups</TabsTrigger>
                </TabsList>
                <TabsContent value="my-groups">
                  <MyGroupsList 
                    user={user} 
                    onRefresh={handleRefreshGroups}
                    searchTerm={searchTerm}
                    key={`my-${refreshTrigger}`} 
                  />
                </TabsContent>
                <TabsContent value="all">
                  <GroupsList 
                    user={user} 
                    searchTerm={searchTerm}
                    key={`all-${refreshTrigger}`} 
                  />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Groups;
