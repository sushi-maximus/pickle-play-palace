
import { useAuth } from "@/contexts/AuthContext";
import { CreatePostForm2 } from "../posts/CreatePostForm2";

interface MobileHome2TabProps {
  groupId: string;
  user: any;
  onPostCreated?: () => void;
}

export const MobileHome2Tab = ({ 
  groupId, 
  user, 
  onPostCreated 
}: MobileHome2TabProps) => {
  return (
    <div className="flex-1 px-4 py-6 relative z-0">
      {/* Post Creation Form at the top */}
      {user && (
        <div className="mb-6">
          <CreatePostForm2
            groupId={groupId}
            user={user}
            onPostCreated={onPostCreated}
          />
        </div>
      )}
      
      <div className="p-4 bg-white rounded-lg shadow-sm border">
        <p className="text-center text-gray-500">More features coming soon...</p>
      </div>
    </div>
  );
};
