
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { JoinRequestRow } from "./JoinRequestRow";
import { JoinRequest } from "./types";

interface JoinRequestsTableProps {
  requests: JoinRequest[];
  onAction: (request: JoinRequest, action: 'approve' | 'reject') => void;
  processingId: string | null;
}

export const JoinRequestsTable = ({ requests, onAction, processingId }: JoinRequestsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Message</TableHead>
          <TableHead>Requested</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <JoinRequestRow
            key={request.id}
            request={request}
            onAction={onAction}
            isProcessing={!!processingId}
          />
        ))}
      </TableBody>
    </Table>
  );
};
