
import { useState } from "react";
import { GroupMember } from "@/types/group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Shield, UserMinus, UserX } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface MemberWithProfile extends GroupMember {
  profile: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
    skill_level: string;
    dupr_rating: number | null;
  };
}

interface GroupMembersProps {
  members: MemberWithProfile[];
  currentUserId: string | undefined;
  isCurrentUserAdmin: boolean;
  onRemoveMember: (memberId: string) => Promise<void>;
}

export const GroupMembers = ({ 
  members, 
  currentUserId,
  isCurrentUserAdmin,
  onRemoveMember
}: GroupMembersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<MemberWithProfile | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveMember = async () => {
    if (!selectedMember) return;
    
    setIsRemoving(true);
    try {
      await onRemoveMember(selectedMember.id);
      toast.success(`${selectedMember.profile.first_name} ${selectedMember.profile.last_name} has been removed from the group`);
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    } finally {
      setIsRemoving(false);
      setSelectedMember(null);
    }
  };

  const filteredMembers = members.filter(member => {
    const fullName = `${member.profile.first_name} ${member.profile.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members ({members.length})</CardTitle>
        <CardDescription>People in this group</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredMembers.length > 0 ? (
          <div className="space-y-2">
            {filteredMembers.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center justify-between p-2 rounded hover:bg-accent/50"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.profile.avatar_url || ""} />
                    <AvatarFallback>
                      {member.profile.first_name[0]}
                      {member.profile.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {member.profile.first_name} {member.profile.last_name}
                      {member.user_id === currentUserId && " (You)"}
                    </p>
                    <div className="flex items-center gap-2">
                      {member.role === "admin" && (
                        <Badge variant="outline" className="flex items-center gap-1 text-xs">
                          <Shield className="h-3 w-3" />
                          Admin
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {member.profile.dupr_rating ? (
                          `DUPR: ${member.profile.dupr_rating}`
                        ) : (
                          `Skill: ${member.profile.skill_level}`
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                {isCurrentUserAdmin && member.user_id !== currentUserId && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSelectedMember(member)}
                      >
                        <UserX className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove member</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove {member.profile.first_name} {member.profile.last_name} from this group?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleRemoveMember}
                          disabled={isRemoving}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isRemoving ? "Removing..." : "Remove"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p>No members found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
