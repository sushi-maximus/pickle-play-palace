
import { useAuth } from "@/contexts/AuthContext";

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
      <div className="p-4 bg-white rounded-lg shadow-sm border">
        <p className="text-center text-gray-500">Coming soon...</p>
      </div>
    </div>
  );
};
