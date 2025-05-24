
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Users, MessageCircle, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export const GroupCardHybrid3 = () => {
  return (
    <Card className="h-80 overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all duration-300 border-0">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/95 via-blue-900/60 to-blue-800/30" />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col p-6">
        {/* Top Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="bg-blue-500/20 border-blue-400/50 text-blue-100">
              <Lock className="h-3 w-3 mr-1" />
              Private
            </Badge>
          </div>
        </div>
        
        {/* Title */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-1">Tech Startup Network</h3>
          <p className="text-blue-100/80 text-sm">Connect with entrepreneurs and innovators</p>
        </div>
        
        {/* Stats Grid - Horizontal Layout */}
        <div className="flex justify-between bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-6">
          <div className="text-center">
            <div className="text-lg font-bold text-white">89</div>
            <div className="text-xs text-white/80 flex items-center justify-center gap-1">
              <Users className="h-3 w-3" />
              Members
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">24</div>
            <div className="text-xs text-white/80 flex items-center justify-center gap-1">
              <MessageCircle className="h-3 w-3" />
              Posts
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">12</div>
            <div className="text-xs text-white/80 flex items-center justify-center gap-1">
              <Calendar className="h-3 w-3" />
              Events
            </div>
          </div>
        </div>
        
        {/* Bottom Button */}
        <div className="mt-auto">
          <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
            Request to Join
          </Button>
        </div>
      </div>
    </Card>
  );
};
