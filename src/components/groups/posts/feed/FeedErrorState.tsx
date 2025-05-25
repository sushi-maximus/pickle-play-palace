
import { Button } from "@/components/ui/button";

interface FeedErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const FeedErrorState = ({ error, onRetry }: FeedErrorStateProps) => {
  return (
    <div className="p-8 text-center">
      <div className="text-red-500 mb-4">{error}</div>
      <Button variant="outline" onClick={onRetry}>Try Again</Button>
    </div>
  );
};
