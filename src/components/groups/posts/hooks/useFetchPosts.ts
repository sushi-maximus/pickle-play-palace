
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GroupPost, UseGroupPostsProps } from "./types";
import { enrichPostData } from "./utils/postEnrichment";

export const useFetchPosts = ({ groupId, userId }: UseGroupPostsProps) => {
  const [groupName, setGroupName] = useState<string>("");

  const fetchPosts = async (): Promise<GroupPost[]> => {
    try {
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

      // If no posts, return empty array
      if (!postsData || postsData.length === 0) {
        return [];
      }

      // Enrich each post with user, reactions, and comments data
      return await Promise.all(
        postsData.map(post => enrichPostData(post, userId))
      );

    } catch (err) {
      console.error("Error fetching posts:", err);
      throw new Error("Failed to load posts. Please try again later.");
    }
  };

  return {
    fetchPosts,
    groupName
  };
};
