
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImagePlus, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePost } from "./hooks/useCreatePost";
import { cn } from "@/lib/utils";

interface CreatePostFormProps {
  groupId: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  } | null;
  onPostCreated?: () => void;
  refreshing?: boolean;
}

export const CreatePostForm = ({ 
  groupId, 
  user, 
  onPostCreated,
  refreshing = false
}: CreatePostFormProps) => {
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
  
  // Determine if the form should be disabled (when submitting or during background refresh)
  const isDisabled = isSubmitting || refreshing;
  
  return (
    <Card className={cn(
      "mb-6 transition-opacity duration-300",
      refreshing ? "opacity-70" : "opacity-100"
    )}>
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
              placeholder={refreshing ? "Please wait while content refreshes..." : `Write something to the group...`}
              className={cn(
                "flex-1 resize-none",
                refreshing && "bg-muted cursor-not-allowed"
              )}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              disabled={isDisabled}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-3">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            disabled={isDisabled}
            className={refreshing ? "opacity-50" : ""}
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
          <Button 
            type="submit" 
            disabled={!content.trim() || isDisabled}
            className={refreshing ? "opacity-75" : ""}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                Posting...
              </>
            ) : refreshing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin text-primary-foreground/70" />
                Wait...
              </>
            ) : (
              'Post'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
