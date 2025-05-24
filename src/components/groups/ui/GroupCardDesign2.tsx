
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const GroupCardDesign2 = () => {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 border-2 border-green-100">
            <AvatarFallback className="bg-green-50 text-green-700 font-semibold">
              BG
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              Book Club Enthusiasts
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              A community for avid readers to discuss and share book recommendations
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>156 members</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>San Francisco</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>Created March 2024</span>
          </div>
          
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">
              Public
            </Badge>
            <Badge variant="outline" className="text-xs">
              Active
            </Badge>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 border-t">
        <Button variant="outline" className="w-full hover:bg-green-50 hover:border-green-200">
          Join Group
        </Button>
      </CardFooter>
    </Card>
  );
};
