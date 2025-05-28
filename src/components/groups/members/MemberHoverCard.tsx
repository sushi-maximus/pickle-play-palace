
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
import { promoteMemberToAdmin } from "../utils"; // Updated import path
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
    if (member.profile?.dupr_rating) {
      return { label: "DUPR", value: member.profile.dupr_rating };
    } else {
      return { label: "Skill Level", value: member.profile?.skill_level || "2.5" };
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
        <div className="flex items-center gap-2 md:gap-3 px-3 py-4 md:px-6 md:py-6">
          <Avatar className="h-12 w-12 md:h-16 md:w-16 border-2" style={{ 
            borderColor: getSkillLevelColor(member.profile?.dupr_rating, member.profile?.skill_level) 
          }}>
            <AvatarImage 
              src={member.profile?.avatar_url || ""} 
              alt={`${member.profile?.first_name} ${member.profile?.last_name}`}
            />
            <AvatarFallback className="bg-primary/10 text-sm md:text-lg">
              {member.profile?.first_name?.charAt(0)}{member.profile?.last_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-medium text-sm md:text-lg">
              {member.profile?.first_name} {member.profile?.last_name}
            </h3>
            <div className="flex flex-wrap gap-1 md:gap-2 mt-1">
              {/* Skill Level or DUPR Rating */}
              {getRatingDisplay().value && (
                <Badge variant="outline" className="bg-primary/5 text-xs">
                  {getRatingDisplay().label}: {getRatingDisplay().value}
                </Badge>
              )}
              
              {/* Age (if available) */}
              {member.profile?.birthday && (
                <Badge variant="outline" className="bg-secondary/5 text-xs">
                  Age: {calculateAge(member.profile.birthday)}
                </Badge>
              )}

              {/* Role Badge */}
              <Badge variant={member.role === "admin" ? "default" : "outline"} className="text-xs">
                {member.role === "admin" ? "Admin" : "Member"}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Admin actions section */}
        {isAdmin && member.user_id !== currentUserId && (
          <div className="border-t px-3 py-3 md:px-4 md:py-4 flex flex-col gap-2 md:gap-3">
            <p className="text-xs md:text-sm font-medium mb-1">Admin Actions:</p>
            <div className="flex flex-wrap gap-1 md:gap-2">
              {member.role !== "admin" && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex gap-1 text-xs md:text-sm px-2 md:px-3"
                  disabled={!!actionLoading}
                  onClick={handlePromoteToAdmin}
                >
                  <Shield className="h-3 w-3 md:h-4 md:w-4" />
                  {actionLoading === member.id ? "Processing..." : "Promote to Admin"}
                </Button>
              )}
              <Button 
                size="sm" 
                variant="destructive"
                className="flex gap-1 text-xs md:text-sm px-2 md:px-3"
                disabled={!!actionLoading}
                onClick={() => {
                  onClose();
                  document.dispatchEvent(new CustomEvent('removeMember', { detail: member }));
                }}
              >
                <UserMinus className="h-3 w-3 md:h-4 md:w-4" />
                {actionLoading === member.id ? "Processing..." : "Remove Member"}
              </Button>
            </div>
          </div>
        )}
        
        <div className="border-t px-3 py-3 md:px-4 md:py-4 bg-muted/30 flex justify-end">
          <Button 
            size="sm" 
            variant="outline"
            className="text-xs md:text-sm px-2 md:px-3"
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
