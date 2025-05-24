
import { supabase } from "@/integrations/supabase/client";
import { GroupPost, PostUser } from "../types/groupPostTypes";

export const fetchGroupInfo = async (groupId: string): Promise<string> => {
  const { data: groupData } = await supabase
    .from("groups")
    .select("name")
    .eq("id", groupId)
    .single();
  
  return groupData?.name || "";
};

export const fetchUserData = async (userId: string): Promise<PostUser> => {
  const { data: userData, error: userError } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, avatar_url")
    .eq("id", userId)
    .single();

  if (userError) {
    console.error("Error fetching user data:", userError);
  }

  return userData || { 
    id: userId, 
    first_name: "Unknown", 
    last_name: "User" 
  };
};

export const fetchReactionCounts = async (postId: string) => {
  const { count: likeCount } = await supabase
    .from("reactions")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId)
    .eq("reaction_type", "like");

  const { count: thumbsUpCount } = await supabase
    .from("reactions")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId)
    .eq("reaction_type", "thumbsup");

  const { count: thumbsDownCount } = await supabase
    .from("reactions")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId)
    .eq("reaction_type", "thumbsdown");

  const { count: heartCount } = await supabase
    .from("reactions")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId)
    .eq("reaction_type", "heart");

  return {
    like: likeCount || 0,
    thumbsup: thumbsUpCount || 0,
    thumbsdown: thumbsDownCount || 0,
    heart: heartCount || 0
  };
};

export const fetchCommentsCount = async (postId: string): Promise<number> => {
  const { count } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  return count || 0;
};

export const fetchUserReactions = async (postId: string, userId?: string) => {
  if (!userId) {
    return {
      like: false,
      thumbsup: false,
      thumbsdown: false,
      heart: false
    };
  }

  const { data: likeReaction } = await supabase
    .from("reactions")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .eq("reaction_type", "like")
    .maybeSingle();
  
  const { data: thumbsUpReaction } = await supabase
    .from("reactions")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .eq("reaction_type", "thumbsup")
    .maybeSingle();
  
  const { data: thumbsDownReaction } = await supabase
    .from("reactions")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .eq("reaction_type", "thumbsdown")
    .maybeSingle();
  
  const { data: heartReaction } = await supabase
    .from("reactions")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .eq("reaction_type", "heart")
    .maybeSingle();
  
  return {
    like: !!likeReaction,
    thumbsup: !!thumbsUpReaction,
    thumbsdown: !!thumbsDownReaction,
    heart: !!heartReaction
  };
};
