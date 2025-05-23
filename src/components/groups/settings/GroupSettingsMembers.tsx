
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  getGroupMembers, 
  updateMemberRole, 
  removeMember,
  handleJoinRequest 
} from "../services/groupService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/stringUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  Crown, 
  MoreVertical, 
  UserMinus, 
  UserCheck, 
  UserX, 
  UsersRound,
  ShieldCheck
} from "lucide-react";

interface GroupSettingsMembersProps {
  group: any;
}

export const GroupSettingsMembers = ({ group }: GroupSettingsMembersProps) => {
  const { id: groupId } = useParams<{ id: string }>();
  const [members, setMembers] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  
  useEffect(() => {
    const loadMembers = async () => {
      if (!groupId) return;
      
      setLoading(true);
      try {
        const { activeMembers, pendingMembers } = await getGroupMembers(groupId);
        setMembers(activeMembers || []);
        setPendingRequests(pendingMembers || []);
      } catch (error) {
        console.error("Error loading members:", error);
        toast.error("Failed to load group members");
      } finally {
        setLoading(false);
      }
    };
    
    loadMembers();
  }, [groupId]);
  
  const handleRoleChange = async (memberId: string, newRole: "admin" | "member") => {
    try {
      await updateMemberRole(groupId as string, memberId, newRole);
      
      setMembers(members.map(member => 
        member.id === memberId ? { ...member, role: newRole } : member
      ));
      
      toast.success(`Member role updated to ${newRole}`);
    } catch (error) {
      console.error("Error updating member role:", error);
      toast.error("Failed to update member role");
    }
  };
  
  const confirmRemoveMember = (member: any) => {
    setSelectedMember(member);
    setShowRemoveDialog(true);
  };
  
  const handleRemoveMember = async () => {
    if (!selectedMember || !groupId) return;
    
    try {
      await removeMember(groupId, selectedMember.id);
      
      setMembers(members.filter(m => m.id !== selectedMember.id));
      toast.success("Member removed from group");
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    } finally {
      setShowRemoveDialog(false);
      setSelectedMember(null);
    }
  };
  
  const handleRequest = async (requestId: string, status: "approved" | "rejected") => {
    if (!groupId) return;
    
    try {
      await handleJoinRequest(groupId, requestId, status);
      
      if (status === "approved") {
        // Move the approved member from pending to active members
        const approvedRequest = pendingRequests.find(req => req.id === requestId);
        if (approvedRequest) {
          setMembers([...members, { ...approvedRequest, status: "active" }]);
        }
      }
      
      // Remove from pending requests
      setPendingRequests(pendingRequests.filter(req => req.id !== requestId));
      
      toast.success(`Request ${status}`);
    } catch (error) {
      console.error(`Error ${status} request:`, error);
      toast.error(`Failed to ${status} request`);
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium flex items-center">
              <UserCheck className="mr-2 h-5 w-5" />
              Pending Requests
            </h3>
            <p className="text-sm text-muted-foreground">
              Users who have requested to join your group
            </p>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={request.profiles?.avatar_url} 
                        alt={`${request.profiles?.first_name} ${request.profiles?.last_name}`} 
                      />
                      <AvatarFallback>
                        {getInitials(`${request.profiles?.first_name} ${request.profiles?.last_name}`)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{request.profiles?.first_name} {request.profiles?.last_name}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {request.request_message || "No message provided"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleRequest(request.id, "rejected")}
                      >
                        <UserX className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleRequest(request.id, "approved")}
                      >
                        <UserCheck className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium flex items-center">
            <UsersRound className="mr-2 h-5 w-5" />
            Members
            <Badge className="ml-2" variant="secondary">{members.length}</Badge>
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage the members of your group
          </p>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={member.profiles?.avatar_url} 
                      alt={`${member.profiles?.first_name} ${member.profiles?.last_name}`} 
                    />
                    <AvatarFallback>
                      {getInitials(`${member.profiles?.first_name} ${member.profiles?.last_name}`)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{member.profiles?.first_name} {member.profiles?.last_name}</span>
                </TableCell>
                <TableCell>
                  {member.role === "admin" ? (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 flex w-fit items-center">
                      <Crown className="mr-1 h-3 w-3" />
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="w-fit">Member</Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(member.joined_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {member.role === "member" ? (
                        <DropdownMenuItem onClick={() => handleRoleChange(member.id, "admin")}>
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Make Admin
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleRoleChange(member.id, "member")}>
                          <UsersRound className="mr-2 h-4 w-4" />
                          Remove Admin
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => confirmRemoveMember(member)}
                      >
                        <UserMinus className="mr-2 h-4 w-4" />
                        Remove from Group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Remove Member Confirmation Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <strong>
                {selectedMember?.profiles?.first_name} {selectedMember?.profiles?.last_name}
              </strong>{" "}
              from the group? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRemoveDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveMember}>
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
