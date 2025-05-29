
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { RouteErrorBoundary } from "@/components/error-boundaries";
import { SimpleGroupList, useSimpleGroups } from "@/components/groups/simple";
import { CreateGroupDialog } from "@/components/groups/CreateGroupDialog";
import { LoginPrompt } from "@/components/groups/LoginPrompt";

const Groups = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("my-groups"); // Changed default to my-groups
  const { user, isLoading } = useAuth();

  // Use our new simple hooks for both tabs
  const allGroupsQuery = useSimpleGroups({ 
    userId: user?.id, 
    searchTerm, 
    mode: 'all' 
  });
  
  const myGroupsQuery = useSimpleGroups({ 
    userId: user?.id, 
    searchTerm, 
    mode: 'my-groups' 
  });

  const handleRefresh = () => {
    allGroupsQuery.refetch();
    myGroupsQuery.refetch();
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
    <RouteErrorBoundary routeName="Groups">
      <AppLayout title="Groups">
        {/* Search and Create Section */}
        <div className="bg-white border-b px-3 py-3 md:px-4 md:py-4 -mx-3 mb-4 md:mb-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 md:h-4 md:w-4" />
              <Input
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 md:pl-10 text-sm md:text-base"
              />
            </div>
            <CreateGroupDialog 
              trigger={
                <Button className="flex items-center gap-1 md:gap-2 text-sm md:text-base px-3 md:px-4">
                  <Plus className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Create</span>
                </Button>
              }
              onSuccess={handleRefresh}
            />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="px-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6">
              <TabsTrigger value="my-groups" className="text-sm md:text-base">My Groups</TabsTrigger>
              <TabsTrigger value="all-groups" className="text-sm md:text-base">All Groups</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-groups" className="space-y-4 md:space-y-6">
              <SimpleGroupList 
                groups={myGroupsQuery.groups}
                loading={myGroupsQuery.loading}
                error={myGroupsQuery.error}
                onRetry={myGroupsQuery.refetch}
              />
            </TabsContent>
            
            <TabsContent value="all-groups" className="space-y-4 md:space-y-6">
              <SimpleGroupList 
                groups={allGroupsQuery.groups}
                loading={allGroupsQuery.loading}
                error={allGroupsQuery.error}
                onRetry={allGroupsQuery.refetch}
              />
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>
    </RouteErrorBoundary>
  );
};

export default Groups;
