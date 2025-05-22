
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

type Membership = {
  id: string;
  group: {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    created_at: string;
    is_private: boolean;
  };
  role: string;
};

interface MembershipCardProps {
  membership: Membership;
}

export const MembershipCard = ({ membership }: MembershipCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-300 border-2 border-transparent hover:border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            {membership.group.name}
            {membership.group.is_private && (
              <Lock className="h-4 w-4 ml-2 text-muted-foreground" />
            )}
          </CardTitle>
          <div className="p-2 bg-primary/10 rounded-full">
            <Users className="h-5 w-5 text-primary" />
          </div>
        </div>
        <CardDescription>
          {membership.group.location && (
            <div className="text-sm mt-1">{membership.group.location}</div>
          )}
          <div className="text-xs text-muted-foreground mt-1">
            Created {new Date(membership.group.created_at).toLocaleDateString()}
          </div>
          {membership.role === "admin" && (
            <div className="text-xs font-medium mt-2 inline-block bg-primary/20 px-2 py-0.5 rounded-full">
              Admin
            </div>
          )}
          {membership.group.is_private && (
            <div className="text-xs font-medium mt-2 ml-2 inline-block bg-secondary/50 px-2 py-0.5 rounded-full">
              Private
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground">
          {membership.group.description || "No description provided."}
        </p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button 
          variant="default" 
          className="w-full hover:bg-primary/90"
          onClick={() => navigate(`/groups/${membership.group.id}`)}
        >
          View Group
        </Button>
      </CardFooter>
    </Card>
  );
};
