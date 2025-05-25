
import { FeedContainer } from "./FeedContainer";
import type { GroupPost, Profile } from "../hooks/types/groupPostTypes";

interface FeedContentProps {
  loading: boolean;
  refreshing?: boolean;
  error: string | null;
  posts: GroupPost[];
  user: Profile | null;
  groupId: string;
  membershipStatus: {
    isMember: boolean;
    isPending: boolean;
    isAdmin: boolean;
  };
  refreshPosts: () => void;
  onPostCreated: () => void;
  onPostUpdated: () => void;
  onPostDeleted: () => void;
}

export const FeedContent = (props: FeedContentProps) => {
  return <FeedContainer {...props} />;
};
