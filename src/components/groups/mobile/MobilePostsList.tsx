
import { MobilePostCard2 } from "./MobilePostCard2";

interface MobilePostsListProps {
  posts: any[];
  user: any;
  onPostUpdate?: () => void;
}

export const MobilePostsList = ({
  posts,
  user,
  onPostUpdate
}: MobilePostsListProps) => {
  return (
    <div className="space-y-3 md:space-y-4">
      {posts.map((post) => (
        <MobilePostCard2
          key={post.id}
          post={post}
          currentUserId={user?.id}
          user={user}
          onPostUpdate={onPostUpdate}
        />
      ))}
    </div>
  );
};
