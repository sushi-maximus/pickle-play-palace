
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Calendar, Lock, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface GroupDetailsHeaderProps {
  group: any;
  breadcrumbItems: { label: string; href?: string }[];
}

export const GroupDetailsHeader = ({ group, breadcrumbItems }: GroupDetailsHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <>
      <BreadcrumbNav items={breadcrumbItems} className="mb-8" />
          
      <Button 
        variant="outline"
        size="sm"
        className="mb-6"
        onClick={() => navigate("/groups")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Groups
      </Button>
      
      <Card className="w-full mb-6 overflow-hidden bg-gradient-to-r from-primary/10 to-transparent">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                {group?.avatar_url ? (
                  <AvatarImage src={group.avatar_url} alt={group.name} />
                ) : (
                  <AvatarFallback className="text-xl bg-primary/20 text-primary">
                    {group?.name?.substring(0, 2).toUpperCase() || "GP"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h2 className="text-3xl font-bold flex items-center">
                  {group?.name}
                  {group?.is_private && (
                    <Lock className="h-5 w-5 ml-2 text-muted-foreground" />
                  )}
                </h2>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {group?.member_count || 0} {group?.member_count === 1 ? 'member' : 'members'}
                  </Badge>
                  
                  {group?.is_private && (
                    <Badge variant="secondary">Private</Badge>
                  )}
                  
                  {group?.location && (
                    <Badge variant="outline" className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {group.location}
                    </Badge>
                  )}
                  
                  <Badge variant="outline" className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Created {new Date(group?.created_at).toLocaleDateString()}
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
