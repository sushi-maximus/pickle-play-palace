
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface GroupPostCardProps {
  post: {
    id: string;
    content: string;
    created_at: string;
    updated_at: string;
    media_urls?: string[] | null;
    user: {
      id: string;
      first_name: string;
      last_name: string;
      avatar_url?: string | null;
    };
    reactions_count?: number;
    comments_count?: number;
    user_has_reacted?: boolean;
  };
  onReactionToggle?: (postId: string) => void;
}

export const GroupPostCard = ({ post, onReactionToggle }: GroupPostCardProps) => {
  const [isReacted, setIsReacted] = useState(post.user_has_reacted || false);
  const [reactionsCount, setReactionsCount] = useState(post.reactions_count || 0);

  const handleReactionToggle = () => {
    setIsReacted(!isReacted);
    setReactionsCount(isReacted ? reactionsCount - 1 : reactionsCount + 1);
    onReactionToggle?.(post.id);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {post.user.avatar_url ? (
                <AvatarImage src={post.user.avatar_url} alt={`${post.user.first_name} ${post.user.last_name}`} />
              ) : (
                <AvatarFallback>
                  {post.user.first_name?.[0] || '?'}
                  {post.user.last_name?.[0] || '?'}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="font-medium">{`${post.user.first_name} ${post.user.last_name}`}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="whitespace-pre-line">{post.content}</p>
        
        {post.media_urls && post.media_urls.length > 0 && (
          <div className="mt-3 grid gap-2 grid-cols-1 sm:grid-cols-2">
            {post.media_urls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Post attachment ${index + 1}`}
                className="rounded-md w-full object-cover"
                style={{ maxHeight: "300px" }}
              />
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-3 flex">
        <div className="flex space-x-1 items-center mr-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={handleReactionToggle}
          >
            <Heart 
              className={`h-4 w-4 ${isReacted ? "fill-red-500 text-red-500" : ""}`}
            />
            <span>{reactionsCount > 0 ? reactionsCount : ''}</span>
          </Button>
        </div>
        
        <div className="flex space-x-1 items-center">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments_count || ''}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
