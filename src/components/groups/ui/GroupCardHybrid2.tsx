
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const GroupCardHybrid2 = () => {
  return (
    <Card className="h-80 overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all duration-300 border-0">
      {/* Background Image with Split Layout */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 h-full flex">
        {/* Left Content */}
        <div className="w-2/3 p-6 flex flex-col justify-between">
          <div>
            <Badge variant="outline" className="bg-green-500/20 border-green-400/50 text-green-100 mb-4">
              Public
            </Badge>
            <h3 className="text-xl font-bold text-white mb-2">Book Club Enthusiasts</h3>
            <p className="text-white/80 text-sm mb-3">
              A community for avid readers to discuss books
            </p>
            <div className="flex items-center gap-1 text-white/70 text-xs">
              <MapPin className="h-3 w-3" />
              <span>San Francisco</span>
            </div>
          </div>
          
          <Button className="w-full bg-green-500 text-white hover:bg-green-600">
            Join Group
          </Button>
        </div>
        
        {/* Right Stats Panel */}
        <div className="w-1/3 bg-white/95 backdrop-blur-sm p-4 flex flex-col justify-center">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">156</div>
              <div className="text-xs text-gray-600">Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">43</div>
              <div className="text-xs text-gray-600">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">8</div>
              <div className="text-xs text-gray-600">Events</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
