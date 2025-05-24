
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
      
      <main className="flex-1 pt-20 pb-24 px-3 py-4 md:px-6 md:py-8">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Groups Page</h1>
          <p className="text-slate-600 mb-6">Basic HTML content with navigation</p>
          
          <div className="bg-white rounded-lg border p-6 mb-4">
            <h2 className="text-lg font-semibold mb-2">Welcome to Groups</h2>
            <p className="text-gray-600">This is where you can find and join groups.</p>
          </div>
          
          {showSearch && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <h3 className="font-medium mb-2">Search Groups</h3>
              <p className="text-gray-600">Search functionality would go here</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-medium mb-2">Sample Group 1</h3>
              <p className="text-sm text-gray-600">This is a sample group card</p>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-medium mb-2">Sample Group 2</h3>
              <p className="text-sm text-gray-600">This is another sample group card</p>
            </div>
          </div>
        </div>
      </main>
      
      <MobileGroupsBottomNav />
    </div>
  );
};

export default Groups;
