
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

export const fetchUserData = async (userId: string): Promise<PostUser | null> => {
  const { data: userData, error: userError } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, avatar_url")
    .eq("id", userId)
    .single();

  if (userError) {
    console.error("Error fetching user data for user", userId, ":", userError);
    return null;
  }

  if (!userData) {
    console.warn("No profile data found for user:", userId);
    return null;
  }

  return {
    id: userData.id,
    first_name: userData.first_name || '',
    last_name: userData.last_name || '',
    avatar_url: userData.avatar_url
  };
};

export const fetchReactionCounts = async (postId: string) => {
  console.log(`🔢 FETCHING REACTION COUNTS for post ${postId}`);
  
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

  const counts = {
    like: likeCount || 0,
    thumbsup: thumbsUpCount || 0,
    thumbsdown: thumbsDownCount || 0,
    heart: heartCount || 0
  };

  console.log(`📊 REACTION COUNTS for post ${postId}:`, counts);
  return counts;
};

export const fetchCommentsCount = async (postId: string): Promise<number> => {
  const { count } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  return count || 0;
};

export const fetchUserReactions = async (postId: string, userId?: string) => {
  console.log(`🔍 === FETCHING USER REACTIONS ===`);
  console.log(`Post ID: ${postId}`);
  console.log(`User ID: ${userId}`);
  
  if (!userId) {
    console.log(`❌ No userId provided, returning false for all reactions`);
    return {
      like: false,
      thumbsup: false,
      thumbsdown: false,
      heart: false
    };
  }

  // Fetch all user reactions for this post in one query for efficiency
  console.log(`📡 Making database query for user reactions...`);
  const { data: userReactions, error } = await supabase
    .from("reactions")
    .select("reaction_type")
    .eq("post_id", postId)
    .eq("user_id", userId);

  if (error) {
    console.error(`❌ Database error fetching user reactions for post ${postId}:`, error);
    return {
      like: false,
      thumbsup: false,
      thumbsdown: false,
      heart: false
    };
  }

  console.log(`✅ Raw database response for post ${postId}:`, userReactions);

  // Convert array of reactions to boolean flags
  const reactionTypes = userReactions?.map(r => r.reaction_type) || [];
  console.log(`🎯 Extracted reaction types for post ${postId}:`, reactionTypes);
  
  const reactions = {
    like: reactionTypes.includes("like"),
    thumbsup: reactionTypes.includes("thumbsup"),
    thumbsdown: reactionTypes.includes("thumbsdown"),
    heart: reactionTypes.includes("heart")
  };

  console.log(`📋 Final processed user reactions for post ${postId}:`, reactions);
  console.log(`🔍 === USER REACTIONS FETCH COMPLETE ===`);

  return reactions;
};
