
import { useNavigate } from "react-router-dom";

interface GroupDetailsErrorStatesProps {
  error?: string | null;
  group?: any;
}

export const GroupDetailsErrorStates = ({ error, group }: GroupDetailsErrorStatesProps) => {
  const navigate = useNavigate();

  if (error) {
    console.error("GroupDetails: Rendering error state:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4 p-6">
          <h2 className="text-xl font-medium text-gray-900">Error Loading Group</h2>
          <p className="text-gray-600">{error}</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/groups")}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Back to Groups
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    console.log("GroupDetails: Group not found");
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4 p-6">
          <h2 className="text-xl font-medium text-gray-900">Group Not Found</h2>
          <p className="text-gray-600">The group you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/groups")}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Back to Groups
          </button>
        </div>
      </div>
    );
  }

  return null;
};
