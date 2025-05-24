
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { MobilePageHeader } from "@/components/navigation/MobilePageHeader";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";

const Groups = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <Navbar />
      </div>
      
      {/* Mobile Header */}
      <MobilePageHeader title="Groups" />
      
      <main className="flex-1 px-3 py-4 md:px-6 md:py-8 pt-16 md:pt-4 pb-20 md:pb-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4 hidden md:block">Groups</h1>
            <p className="text-slate-600">Groups page - ready to add elements one by one</p>
            {user ? (
              <p className="text-sm text-slate-500 mt-2">Logged in as: {user.email}</p>
            ) : (
              <p className="text-sm text-slate-500 mt-2">Not logged in</p>
            )}
          </div>
        </div>
      </main>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default Groups;
