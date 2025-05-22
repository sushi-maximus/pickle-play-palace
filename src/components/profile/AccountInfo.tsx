
import { User } from "@supabase/supabase-js";

interface AccountInfoProps {
  user: User;
  profile?: any;
}

export const AccountInfo = ({ user, profile }: AccountInfoProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Account Information</h3>
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p>{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="truncate">{user.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
