
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface LoadingStateProps {
  count?: number;
}

export const GroupsLoadingState = ({ count = 3 }: LoadingStateProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="bg-card border-2 border-transparent opacity-50">
          <CardHeader className="animate-pulse bg-muted h-32"></CardHeader>
          <CardContent className="pt-6">
            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-muted rounded w-full mb-2"></div>
            <div className="h-3 bg-muted rounded w-5/6"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
