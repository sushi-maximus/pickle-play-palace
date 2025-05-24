
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Users, MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export const GroupCardHybrid1 = () => {
  return (
    <Card className="h-80 overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all duration-300 border-0">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6">
        {/* Top Section */}
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="bg-white/20 border-white/30 text-white">
            <Lock className="h-3 w-3 mr-1" />
            Private
          </Badge>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            TC
          </div>
        </div>
        
        {/* Stats Section - NEW */}
        <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <div className="text-center">
            <div className="text-xl font-bold text-white">89</div>
            <div className="text-xs text-white/80">Members</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">24</div>
            <div className="text-xs text-white/80">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">12</div>
            <div className="text-xs text-white/80">Events</div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="space-y-3">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Tennis Club Downtown</h3>
            <div className="flex items-center gap-1 text-white/80 text-sm">
              <Users className="h-4 w-4" />
              <span>New York, NY</span>
            </div>
          </div>
          
          <Button className="w-full bg-white text-black hover:bg-white/90">
            View Group
          </Button>
        </div>
      </div>
    </Card>
  );
};
