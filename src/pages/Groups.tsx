
import { useState } from "react";
import { MobileGroupsHeader } from "@/components/groups/mobile/MobileGroupsHeader";
import { MobileGroupsBottomNav } from "@/components/groups/mobile/MobileGroupsBottomNav";

const Groups = () => {
  const [showSearch, setShowSearch] = useState(false);

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
  };

  const handleCreateClick = () => {
    // TODO: Open create group dialog
    console.log("Create group clicked");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <MobileGroupsHeader 
        onSearchClick={handleSearchClick}
        onCreateClick={handleCreateClick}
      />
      
      <main className="flex-1 mt-16 pb-20 px-3 py-4 md:px-6 md:py-8">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold mb-4">Groups Page</h1>
          <p className="text-slate-600">Basic HTML content with navigation</p>
          
          {showSearch && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <p>Search functionality would go here</p>
            </div>
          )}
        </div>
      </main>
      
      <MobileGroupsBottomNav />
    </div>
  );
};

export default Groups;
