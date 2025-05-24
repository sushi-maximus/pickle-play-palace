
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ProgressionCard = () => {
  return (
    <Card className="border border-gray-200 border-l-primary/30 border-l-4 hover:shadow-md transition-shadow bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">My Progression</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Progression content will be added here.</p>
      </CardContent>
    </Card>
  );
};
