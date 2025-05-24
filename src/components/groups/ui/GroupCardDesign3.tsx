
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, TrendingUp, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const GroupCardDesign3 = () => {
  return (
    <Card className="h-full hover:shadow-md transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Tech Startup Network
              </h3>
              <Lock className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Connect with entrepreneurs, investors, and innovators in the startup ecosystem
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">89</div>
            <div className="text-xs text-gray-600">Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">24</div>
            <div className="text-xs text-gray-600">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">12</div>
            <div className="text-xs text-gray-600">Events</div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Technology
          </Badge>
          <Badge variant="outline" className="border-blue-200 text-blue-700">
            Business
          </Badge>
        </div>
        
        <div className="pt-2">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            Request to Join
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
