
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const GroupCardDesign1 = () => {
  return (
    <Card className="h-80 overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all duration-300 border-0">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=300&fit=crop)`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="bg-white/20 border-white/30 text-white">
            <Lock className="h-3 w-3 mr-1" />
            Private
          </Badge>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            TC
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Tennis Club Downtown</h3>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>24 members</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>New York, NY</span>
              </div>
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
