
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { GroupDetailsLoading } from "@/components/groups/GroupDetailsLoading";
import { GroupDetailsContainer } from "@/components/groups/details/GroupDetailsContainer";

const GroupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const breadcrumbItems = [
    { label: "Groups", href: "/groups" },
    { label: "Group Details" }
  ];

  if (!id) {
    return <GroupDetailsLoading />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <GroupDetailsContainer
          id={id}
          user={user}
          breadcrumbItems={breadcrumbItems}
        />
      </main>
      <Footer />
    </div>
  );
};

export default GroupDetails;
