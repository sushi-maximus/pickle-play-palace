
import { Card, CardContent } from "@/components/ui/card";

export const ProfileNotFound = () => {
  return (
    <Card className="border border-gray-200 border-l-primary/30 border-l-4 hover:shadow-md transition-shadow bg-white">
      <CardContent className="pt-6">
        <div className="text-center py-12">
          <p className="text-slate-600">Profile not found</p>
        </div>
      </CardContent>
    </Card>
  );
};
