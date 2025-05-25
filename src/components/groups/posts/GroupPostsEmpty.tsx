
interface GroupPostsEmptyProps {
  isMember: boolean;
}

export const GroupPostsEmpty = ({ isMember }: GroupPostsEmptyProps) => {
  return (
    <div className="text-center py-12 text-slate-500 w-full">
      <div className="max-w-md mx-auto">
        <h3 className="text-lg font-medium text-slate-700 mb-2">
          No posts yet
        </h3>
        <p className="text-sm">
          {isMember 
            ? "Be the first to share something with the group!" 
            : "Join the group to see posts and participate in discussions."
          }
        </p>
      </div>
    </div>
  );
};
