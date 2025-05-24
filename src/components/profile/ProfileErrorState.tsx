
import { Card, CardContent } from "@/components/ui/card";
import { ProfileErrorMessage } from "@/components/profile/ProfileErrorMessage";
import { DataFetchErrorBoundary } from "@/components/error-boundaries";

interface ProfileErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ProfileErrorState = ({ error, onRetry }: ProfileErrorStateProps) => {
  return (
    <DataFetchErrorBoundary componentName="Profile" onRetry={onRetry}>
      <Card className="border border-gray-200 border-l-primary/30 border-l-4 hover:shadow-md transition-shadow bg-white">
        <CardContent className="pt-6">
          <ProfileErrorMessage 
            error={error} 
            onRetry={onRetry} 
          />
        </CardContent>
      </Card>
    </DataFetchErrorBoundary>
  );
};
