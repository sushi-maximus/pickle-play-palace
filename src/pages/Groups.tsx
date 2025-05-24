
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { useAuth } from "@/contexts/AuthContext";
import { GroupsList } from "@/components/groups/GroupsList";
import { GroupsHeader } from "@/components/groups/GroupsHeader";
import { LoginPrompt } from "@/components/groups/LoginPrompt";
import { MyGroupsList } from "@/components/groups/MyGroupsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchFilter } from "@/components/groups/SearchFilter";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";
import { MobilePageHeader } from "@/components/navigation/MobilePageHeader";

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
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navbar />
      </div>
      
      {/* Mobile Header */}
      <MobilePageHeader title="Groups" />
      
      <main className="flex-1 px-3 py-4 md:px-6 md:py-8 pt-16 md:pt-4 pb-20 md:pb-4">
        <div className="container mx-auto max-w-6xl">
          {/* Desktop Breadcrumb */}
          <div className="hidden md:block">
            <BreadcrumbNav items={breadcrumbItems} className="mb-4 md:mb-6" />
          </div>
          
          {/* Desktop Header */}
          <div className="hidden md:block">
            <GroupsHeader 
              user={user} 
              onRefresh={handleRefreshGroups} 
            />
          </div>

          {!user ? (
            <LoginPrompt />
          ) : (
            <div className="space-y-6">
              <div className="space-y-3 md:space-y-4">
                <SearchFilter onSearch={handleSearch} placeholder="Search all groups..." />
              </div>
              
              <Tabs defaultValue="my-groups" className="space-y-4">
                <TabsList className="w-full">
                  <TabsTrigger value="my-groups">My Groups</TabsTrigger>
                  <TabsTrigger value="all">All Groups</TabsTrigger>
                </TabsList>
                <TabsContent value="my-groups" className="space-y-3 md:space-y-4">
                  <MyGroupsList 
                    user={user} 
                    onRefresh={handleRefreshGroups}
                    searchTerm={searchTerm}
                    key={`my-${refreshTrigger}`} 
                  />
                </TabsContent>
                <TabsContent value="all" className="space-y-3 md:space-y-4">
                  <GroupsList 
                    user={user} 
                    searchTerm={searchTerm}
                    key={`all-${refreshTrigger}`} 
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default Groups;
