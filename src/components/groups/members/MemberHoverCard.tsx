
import { useState } from "react";
import { Shield, UserMinus } from "lucide-react";
import { differenceInYears } from "date-fns";
import { useNavigate } from "react-router-dom";
import { HoverCardContent } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getSkillLevelColor } from "@/lib/constants/skill-levels";
import { toast } from "sonner";
import { promoteMemberToAdmin } from "../utils/groupDetailsUtils";
import { MemberHoverCardProps } from "./types";

export const MemberHoverCard = ({
  member,
  isAdmin,
  currentUserId,
  groupId,
  onMemberUpdate,
  onClose,
}: MemberHoverCardProps) => {
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Calculate age from birthday
  const calculateAge = (birthday: string | null | undefined) => {
    if (!birthday) return null;
    return differenceInYears(new Date(), new Date(birthday));
  };

  // Get skill or DUPR rating display
  const getRatingDisplay = () => {
    if (member.profiles.dupr_rating) {
      return { label: "DUPR", value: member.profiles.dupr_rating };
    } else {
      return { label: "Skill Level", value: member.profiles.skill_level || "2.5" };
    }
  };

  // Handle promoting a member to admin
  const handlePromoteToAdmin = async () => {
    try {
      setActionLoading(member.id);
      await promoteMemberToAdmin(member.id, groupId);
      toast.success("Member has been promoted to admin");
      if (onMemberUpdate) onMemberUpdate();
    } catch (error) {
      console.error("Error promoting member:", error);
      toast.error("Failed to promote member");
    } finally {
      setActionLoading(null);
      onClose();
    }
  };

  return (
    <HoverCardContent className="w-80 p-0 fixed-center-popup" onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-col">
        <div className="flex items-center gap-4 p-4">
          <Avatar className="h-16 w-16 border-2" style={{ 
            borderColor: getSkillLevelColor(member.profiles.dupr_rating, member.profiles.skill_level) 
          }}>
            <AvatarImage 
              src={member.profiles.avatar_url || ""} 
              alt={`${member.profiles.first_name} ${member.profiles.last_name}`}
            />
            <AvatarFallback className="bg-primary/10 text-lg">
              {member.profiles.first_name?.charAt(0)}{member.profiles.last_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-medium text-lg">
              {member.profiles.first_name} {member.profiles.last_name}
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {/* Skill Level or DUPR Rating */}
              {getRatingDisplay().value && (
                <Badge variant="outline" className="bg-primary/5">
                  {getRatingDisplay().label}: {getRatingDisplay().value}
                </Badge>
              )}
              
              {/* Age (if available) */}
              {member.profiles.birthday && (
                <Badge variant="outline" className="bg-secondary/5">
                  Age: {calculateAge(member.profiles.birthday)}
                </Badge>
              )}

              {/* Role Badge */}
              <Badge variant={member.role === "admin" ? "default" : "outline"}>
                {member.role === "admin" ? "Admin" : "Member"}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Admin actions section */}
        {isAdmin && member.user_id !== currentUserId && (
          <div className="border-t p-3 flex flex-col gap-2">
            <p className="text-sm font-medium mb-1">Admin Actions:</p>
            <div className="flex flex-wrap gap-2">
              {member.role !== "admin" && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex gap-1"
                  disabled={!!actionLoading}
                  onClick={handlePromoteToAdmin}
                >
                  <Shield className="h-4 w-4" />
                  {actionLoading === member.id ? "Processing..." : "Promote to Admin"}
                </Button>
              )}
              <Button 
                size="sm" 
                variant="destructive"
                className="flex gap-1"
                disabled={!!actionLoading}
                onClick={() => {
                  onClose();
                  document.dispatchEvent(new CustomEvent('removeMember', { detail: member }));
                }}
              >
                <UserMinus className="h-4 w-4" />
                {actionLoading === member.id ? "Processing..." : "Remove Member"}
              </Button>
            </div>
          </div>
        )}
        
        <div className="border-t p-3 bg-muted/30 flex justify-end">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              onClose();
              navigate(`/profile/${member.user_id}`);
            }}
          >
            View Full Profile
          </Button>
        </div>
      </div>
    </HoverCardContent>
  );
};
