import { useState } from "react";
import { MobileGroupsHeader } from "@/components/groups/mobile/MobileGroupsHeader";
import { MobileGroupsBottomNav } from "@/components/groups/mobile/MobileGroupsBottomNav";
import { SearchFilter } from "@/components/groups/SearchFilter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { MyGroupsList } from "@/components/groups/MyGroupsList";
import { GroupsList } from "@/components/groups/GroupsList";
import { CreateGroupDialog } from "@/components/groups/CreateGroupDialog";
import { LoginPrompt } from "@/components/groups/LoginPrompt";
import { GroupCardShowcase } from "@/components/groups/ui/GroupCardShowcase";

const Groups = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showDesigns, setShowDesigns] = useState(true); // Show designs again
  const { user, isLoading } = useAuth();

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
  };

  const handleCreateClick = () => {
    // This will be handled by the CreateGroupDialog component
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log("Searching for:", term);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <MobileGroupsHeader 
          onSearchClick={handleSearchClick}
          onCreateClick={handleCreateClick}
        />
        <main className="flex-1 pt-20 pb-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
        <MobileGroupsBottomNav />
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <MobileGroupsHeader 
          onSearchClick={handleSearchClick}
          onCreateClick={handleCreateClick}
        />
        <main className="flex-1 pt-20 pb-24">
          <div className="px-3 py-4 md:px-6 md:py-8">
            <div className="container mx-auto max-w-6xl">
              <LoginPrompt />
            </div>
          </div>
        </main>
        <MobileGroupsBottomNav />
      </div>
    );
  }

  // Show design showcase
  if (showDesigns) {
    return <GroupCardShowcase />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <MobileGroupsHeader 
        onSearchClick={handleSearchClick}
        onCreateClick={handleCreateClick}
      />
      
      <main className="flex-1 pt-20 pb-24">
        <div className="bg-white border-b px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <SearchFilter 
                onSearch={handleSearch}
                placeholder="Search groups..."
              />
            </div>
            <CreateGroupDialog 
              onSuccess={handleRefresh}
            />
          </div>
        </div>
        
        <div className="px-3 py-4 md:px-6 md:py-8">
          <div className="container mx-auto max-w-6xl">
            {showSearch && (
              <div className="mb-4 p-4 bg-white rounded-lg border">
                <h3 className="font-medium mb-2">Advanced Search</h3>
                <p className="text-gray-600">Additional search options would go here</p>
              </div>
            )}

            <Tabs defaultValue="my-groups" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="my-groups">My Groups</TabsTrigger>
                <TabsTrigger value="all-groups">All Groups</TabsTrigger>
              </TabsList>
              
              <TabsContent value="my-groups" className="space-y-6">
                <MyGroupsList 
                  key={`my-groups-${refreshKey}`}
                  user={user}
                  onRefresh={handleRefresh}
                  searchTerm={searchTerm}
                />
              </TabsContent>
              
              <TabsContent value="all-groups" className="space-y-6">
                <GroupsList 
                  key={`all-groups-${refreshKey}`}
                  user={user}
                  searchTerm={searchTerm}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <MobileGroupsBottomNav />
    </div>
  );
};

export default Groups;
