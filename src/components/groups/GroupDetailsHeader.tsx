
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Calendar, Lock, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Database } from "@/integrations/supabase/types";

type Group = Database['public']['Tables']['groups']['Row'] & {
  member_count: number;
};

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface GroupDetailsHeaderProps {
  group: Group | null;
  breadcrumbItems: BreadcrumbItem[];
}

export const GroupDetailsHeader = ({ group, breadcrumbItems }: GroupDetailsHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <>
      <BreadcrumbNav items={breadcrumbItems} className="mb-8" />
          
      <Button 
        variant="outline"
        size="sm"
        className="mb-6 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 hover:scale-105 font-medium"
        onClick={() => navigate("/groups")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Groups
      </Button>
      
      <Card className="w-full mb-6 overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-l-primary/50 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-md">
                {group?.avatar_url ? (
                  <AvatarImage src={group.avatar_url} alt={group.name} />
                ) : (
                  <AvatarFallback className="text-xl bg-primary/20 text-primary font-semibold">
                    {group?.name?.substring(0, 2).toUpperCase() || "GP"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold flex items-center text-gray-900 leading-tight">
                  {group?.name}
                  {group?.is_private && (
                    <Lock className="h-5 w-5 ml-2 text-muted-foreground" />
                  )}
                </h2>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="flex items-center hover:bg-primary/5 transition-colors font-medium">
                    <Users className="h-3 w-3 mr-1" />
                    {group?.member_count || 0} {group?.member_count === 1 ? 'member' : 'members'}
                  </Badge>
                  
                  {group?.is_private && (
                    <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200 font-medium">
                      Private
                    </Badge>
                  )}
                  
                  {group?.location && (
                    <Badge variant="outline" className="flex items-center hover:bg-primary/5 transition-colors font-medium">
                      <MapPin className="h-3 w-3 mr-1" />
                      {group.location}
                    </Badge>
                  )}
                  
                  <Badge variant="outline" className="flex items-center hover:bg-primary/5 transition-colors font-medium">
                    <Calendar className="h-3 w-3 mr-1" />
                    Created {group?.created_at ? new Date(group.created_at).toLocaleDateString() : 'Unknown'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </>
  );
};
