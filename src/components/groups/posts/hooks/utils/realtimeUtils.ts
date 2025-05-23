
import { supabase } from "@/integrations/supabase/client";
import { GroupPost } from "../types";
import { enrichPostData } from "./postEnrichment";

type PostsUpdateCallback = (updater: (posts: GroupPost[]) => GroupPost[]) => void;

// Setup Supabase real-time subscription for posts
export const setupPostsRealtimeSubscription = (
  groupId: string,
  isVisibleRef: React.MutableRefObject<boolean>,
  setPosts: PostsUpdateCallback,
  userId?: string
) => {
  if (!groupId || !isVisibleRef.current) return null;
  
  console.log('Setting up real-time subscription for group posts...');
  
  const channel = supabase
    .channel('group-posts-changes')
    .on(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public',
        table: 'posts',
        filter: `group_id=eq.${groupId}`
      },
      async (payload) => {
        console.log('Posts change received:', payload);
        
        // Handle different event types
        if (payload.eventType === 'INSERT') {
          const newPost = await enrichPostData(payload.new, userId);
          setPosts(current => [newPost, ...current]);
        } 
        else if (payload.eventType === 'UPDATE') {
          const updatedPost = await enrichPostData(payload.new, userId);
          setPosts(current => 
            current.map(post => post.id === updatedPost.id ? updatedPost : post)
          );
        }
        else if (payload.eventType === 'DELETE') {
          setPosts(current => 
            current.filter(post => post.id !== payload.old.id)
          );
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'comments',
      },
      async (payload) => {
        // Update comment counts when comments change
        if (payload.eventType === 'INSERT') {
          const postId = payload.new.post_id;
          setPosts(current => 
            current.map(post => {
              if (post.id === postId) {
                return {
                  ...post,
                  comments_count: post.comments_count + 1
                };
              }
              return post;
            })
          );
        } 
        else if (payload.eventType === 'DELETE') {
          const postId = payload.old.post_id;
          setPosts(current => 
            current.map(post => {
              if (post.id === postId && post.comments_count > 0) {
                return {
                  ...post,
                  comments_count: post.comments_count - 1
                };
              }
              return post;
            })
          );
        }
      }
    )
    .subscribe();
  
  return channel;
};
