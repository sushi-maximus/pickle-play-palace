
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SearchFilter } from "@/components/groups/SearchFilter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { MyGroupsList } from "@/components/groups/MyGroupsList";
import { GroupsList } from "@/components/groups/GroupsList";
import { CreateGroupDialog } from "@/components/groups/CreateGroupDialog";
import { LoginPrompt } from "@/components/groups/LoginPrompt";

const Groups = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const { user, isLoading } = useAuth();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log("Searching for:", term);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Show login prompt if user is not authenticated
  if (!user && !isLoading) {
    return (
      <AppLayout title="Groups">
        <LoginPrompt />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Groups">
      {/* Search and Create Section */}
      <div className="bg-white border-b px-4 py-4 -mx-3 mb-4">
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
      
      {/* Main Content */}
      <div className="px-3">
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
    </AppLayout>
  );
};

export default Groups;
