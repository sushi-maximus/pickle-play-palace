
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImagePlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePost } from "./hooks/useCreatePost";

interface CreatePostFormProps {
  groupId: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  } | null;
  onPostCreated?: () => void;
}

export const CreatePostForm = ({ groupId, user, onPostCreated }: CreatePostFormProps) => {
  if (!user) {
    return null;
  }

  const {
    content,
    setContent,
    isSubmitting,
    handleSubmit
  } = useCreatePost({
    groupId,
    userId: user.id,
    onPostCreated
  });
  
  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
              ) : (
                <AvatarFallback>
                  {user.first_name?.[0] || ''}
                  {user.last_name?.[0] || ''}
                </AvatarFallback>
              )}
            </Avatar>
            <Textarea
              placeholder={`Write something to the group...`}
              className="flex-1 resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-3">
          <Button type="button" variant="outline" size="sm" disabled={isSubmitting}>
            <ImagePlus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
          <Button type="submit" disabled={!content.trim() || isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
