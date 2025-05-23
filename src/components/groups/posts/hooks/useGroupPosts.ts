
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PostReactionType } from "./usePostReactions";

interface PostUser {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
}

export interface GroupPost {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  media_urls?: string[] | null;
  user: PostUser;
  reactions: Record<PostReactionType, number>;
  comments_count: number;
  user_reactions: Record<PostReactionType, boolean>;
}

interface UseGroupPostsProps {
  groupId: string;
  userId?: string;
}

export const useGroupPosts = ({ groupId, userId }: UseGroupPostsProps) => {
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string>("");
  const channelRef = useRef<any>(null);
  const isVisibleRef = useRef<boolean>(true);

  // Helper function to enrich post data with user info, reactions, etc.
  const enrichPostData = async (post: any): Promise<GroupPost> => {
    try {
      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, avatar_url")
        .eq("id", post.user_id)
        .single();

      if (userError) {
        console.error("Error fetching user data:", userError);
      }

      // Count different types of reactions
      const { count: likeCount } = await supabase
        .from("reactions")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id)
        .eq("reaction_type", "like");

      const { count: thumbsUpCount } = await supabase
        .from("reactions")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id)
        .eq("reaction_type", "thumbsup");

      const { count: thumbsDownCount } = await supabase
        .from("reactions")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id)
        .eq("reaction_type", "thumbsdown");

      // Count comments
      const { count: commentsCount } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);

      // Check if current user has reacted to this post
      let userLike = false;
      let userThumbsUp = false;
      let userThumbsDown = false;
      
      if (userId) {
        const { data: likeReaction } = await supabase
          .from("reactions")
          .select("*")
          .eq("post_id", post.id)
          .eq("user_id", userId)
          .eq("reaction_type", "like")
          .maybeSingle();
        
        const { data: thumbsUpReaction } = await supabase
          .from("reactions")
          .select("*")
          .eq("post_id", post.id)
          .eq("user_id", userId)
          .eq("reaction_type", "thumbsup")
          .maybeSingle();
        
        const { data: thumbsDownReaction } = await supabase
          .from("reactions")
          .select("*")
          .eq("post_id", post.id)
          .eq("user_id", userId)
          .eq("reaction_type", "thumbsdown")
          .maybeSingle();
        
        userLike = !!likeReaction;
        userThumbsUp = !!thumbsUpReaction;
        userThumbsDown = !!thumbsDownReaction;
      }

      return {
        ...post,
        user: userData || { 
          id: post.user_id, 
          first_name: "Unknown", 
          last_name: "User" 
        },
        reactions: {
          like: likeCount || 0,
          thumbsup: thumbsUpCount || 0,
          thumbsdown: thumbsDownCount || 0
        },
        comments_count: commentsCount || 0,
        user_reactions: {
          like: userLike,
          thumbsup: userThumbsUp,
          thumbsdown: userThumbsDown
        }
      };
    } catch (err) {
      console.error("Error enriching post data:", err);
      return post; // Return the original post if enrichment fails
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // Get posts for this group
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(`*`)
        .eq("group_id", groupId)
        .order("created_at", { ascending: false });

      if (postsError) {
        throw postsError;
      }

      // Fetch group info for name
      const { data: groupData } = await supabase
        .from("groups")
        .select("name")
        .eq("id", groupId)
        .single();
      
      if (groupData) {
        setGroupName(groupData.name);
      }

      // If no posts, return early
      if (!postsData || postsData.length === 0) {
        setPosts([]);
        setLoading(false);
        return;
      }

      // Enrich each post with user, reactions, and comments data
      const postsWithData = await Promise.all(
        postsData.map(post => enrichPostData(post))
      );

      setPosts(postsWithData);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Setup real-time subscriptions when component mounts
  useEffect(() => {
    if (groupId) {
      fetchPosts();

      // Only set up real-time if we have a groupId
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
              const newPost = await enrichPostData(payload.new);
              setPosts(current => [newPost, ...current]);
            } 
            else if (payload.eventType === 'UPDATE') {
              const updatedPost = await enrichPostData(payload.new);
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
      
      channelRef.current = channel;

      // Handle page visibility changes to disconnect when tab is hidden
      const handleVisibilityChange = () => {
        const isVisible = document.visibilityState === 'visible';
        isVisibleRef.current = isVisible;
        
        if (!isVisible && channelRef.current) {
          console.log('Page hidden, removing real-time subscription');
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        } else if (isVisible && !channelRef.current) {
          console.log('Page visible again, resubscribing to real-time updates');
          const newChannel = supabase
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
                
                if (payload.eventType === 'INSERT') {
                  const newPost = await enrichPostData(payload.new);
                  setPosts(current => [newPost, ...current]);
                } 
                else if (payload.eventType === 'UPDATE') {
                  const updatedPost = await enrichPostData(payload.new);
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
          
          channelRef.current = newChannel;
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Clean up function to remove subscription when component unmounts
      return () => {
        console.log('Cleaning up group posts subscription');
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
      };
    }
  }, [groupId, userId]);

  return {
    posts,
    loading,
    error,
    groupName,
    refreshPosts: fetchPosts
  };
};
