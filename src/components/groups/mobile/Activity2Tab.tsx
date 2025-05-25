
import type { Database } from "@/integrations/supabase/types";
import type { Profile } from "../posts/hooks/types/groupPostTypes";

interface Activity2TabProps {
  groupId: string;
  user: Profile | null;
  onPostCreated: () => void;
}

export const Activity2Tab = ({ groupId, user, onPostCreated }: Activity2TabProps) => {
  console.log("Activity2Tab - Rendering with:", { groupId, userId: user?.id });

  return (
    <main className="flex-1 bg-gray-50">
      <div className="container mx-auto max-w-4xl h-full">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-white border-b px-4 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Activity2 - Facebook Style</h2>
            <p className="text-sm text-gray-600 mt-1">New Facebook-style activity feed</p>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4">
            <div className="bg-white rounded-lg border p-6 text-center">
              <h3 className="text-lg font-medium mb-2">Activity2 Tab Ready</h3>
              <p className="text-gray-600">Facebook-style activity feed will be built here</p>
              <div className="mt-4 text-sm text-gray-500">
                <p>Group ID: {groupId}</p>
                <p>User: {user?.first_name} {user?.last_name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
