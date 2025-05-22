
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { useAuth } from "@/contexts/AuthContext";
import { GroupsList } from "@/components/groups/GroupsList";
import { GroupsHeader } from "@/components/groups/GroupsHeader";
import { LoginPrompt } from "@/components/groups/LoginPrompt";

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
            <GroupsList 
              user={user} 
              key={refreshTrigger} // This key change will force the component to remount when refreshTrigger changes
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Groups;
