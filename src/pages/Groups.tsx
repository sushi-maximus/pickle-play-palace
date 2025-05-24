
import { useState } from "react";
import { MobileGroupsHeader } from "@/components/groups/mobile/MobileGroupsHeader";
import { MobileGroupsBottomNav } from "@/components/groups/mobile/MobileGroupsBottomNav";
import { SearchFilter } from "@/components/groups/SearchFilter";

const Groups = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
  };

  const handleCreateClick = () => {
    // TODO: Open create group dialog
    console.log("Create group clicked");
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log("Searching for:", term);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <MobileGroupsHeader 
        onSearchClick={handleSearchClick}
        onCreateClick={handleCreateClick}
      />
      
      <main className="flex-1 pt-20 pb-24 px-3 py-4 md:px-6 md:py-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-4 md:mb-6">
            <SearchFilter 
              onSearch={handleSearch}
              placeholder="Search groups..."
            />
          </div>
          
          {showSearch && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <h3 className="font-medium mb-2">Advanced Search</h3>
              <p className="text-gray-600">Additional search options would go here</p>
            </div>
          )}
        </div>
      </main>
      
      <MobileGroupsBottomNav />
    </div>
  );
};

export default Groups;
