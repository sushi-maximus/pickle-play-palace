
import { MemberWithProfile } from "@/types/group";
import { Button } from "@/components/ui/button";

interface GroupMembersTabProps {
  members: MemberWithProfile[];
  isAdmin: boolean;
  isCurrentUser: (userId: string) => boolean;
}

export function GroupMembersTab({ members, isAdmin, isCurrentUser }: GroupMembersTabProps) {
  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h3 className="text-lg font-medium mb-4">Group Members</h3>
      
      <div className="space-y-4">
        {members.map(member => (
          <div 
            key={member.id} 
            className="flex items-center justify-between p-3 border-b last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                {member.profile.first_name ? (
                  `${member.profile.first_name.charAt(0)}${
                    member.profile.last_name ? member.profile.last_name.charAt(0) : ''
                  }`
                ) : 'U'}
              </div>
              <div>
                <p className="font-medium">
                  {member.profile.first_name} {member.profile.last_name}
                </p>
                {member.role === 'admin' && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    Admin
                  </span>
                )}
              </div>
            </div>
            
            {isAdmin && !isCurrentUser(member.user_id) && (
              <Button variant="ghost" size="sm">
                Manage
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
