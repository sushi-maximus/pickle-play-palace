
import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { JoinRequest } from "./types";
import { getInitialsFromName } from "@/utils/stringUtils";

interface JoinRequestRowProps {
  request: JoinRequest;
  onAction: (request: JoinRequest, action: 'approve' | 'reject') => void;
  isProcessing: boolean;
}

export const JoinRequestRow = ({ request, onAction, isProcessing }: JoinRequestRowProps) => {
  return (
    <TableRow key={request.id}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
            <span>{getInitialsFromName(`${request.profile?.first_name} ${request.profile?.last_name}`)}</span>
          </Avatar>
          <span>{request.profile?.first_name} {request.profile?.last_name}</span>
        </div>
      </TableCell>
      <TableCell>
        {request.request_message || <span className="text-muted-foreground italic">No message</span>}
      </TableCell>
      <TableCell>
        {new Date(request.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => onAction(request, 'approve')}
            disabled={isProcessing}
          >
            <Check className="h-4 w-4" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1 text-destructive border-destructive hover:bg-destructive/10"
            onClick={() => onAction(request, 'reject')}
            disabled={isProcessing}
          >
            <X className="h-4 w-4" />
            Reject
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
