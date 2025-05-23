
interface GroupPostsEmptyProps {
  isMember: boolean;
}

export const GroupPostsEmpty = ({ isMember }: GroupPostsEmptyProps) => {
  return (
    <div className="text-center p-6 bg-muted/50 rounded-lg">
      <p className="text-muted-foreground">
        {isMember 
          ? "Be the first to create a post in this group!" 
          : "No posts available in this group yet."}
      </p>
    </div>
  );
};
