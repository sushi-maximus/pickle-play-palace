
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

type Group = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  created_at: string;
  is_private: boolean;
  member_count?: number;
};

interface GroupCardProps {
  group: Group;
}

export const GroupCard = ({ group }: GroupCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-300 border-2 border-transparent hover:border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            {group.name}
            {group.is_private && (
              <Lock className="h-4 w-4 ml-2 text-muted-foreground" />
            )}
          </CardTitle>
          <div className="p-2 bg-primary/10 rounded-full">
            <Users className="h-5 w-5 text-primary" />
          </div>
        </div>
        <CardDescription>
          {group.location && (
            <div className="text-sm mt-1">{group.location}</div>
          )}
          <div className="text-xs text-muted-foreground mt-1">
            Created {new Date(group.created_at).toLocaleDateString()}
          </div>
          {group.is_private && (
            <div className="text-xs font-medium mt-2 inline-block bg-secondary/50 px-2 py-0.5 rounded-full">
              Private Group
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground">
          {group.description || "No description provided."}
        </p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button 
          variant="default" 
          className="w-full hover:bg-primary/90"
          onClick={() => navigate(`/groups/${group.id}`)}
        >
          View Group
        </Button>
      </CardFooter>
    </Card>
  );
};
