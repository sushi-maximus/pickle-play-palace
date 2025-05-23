
// Export hooks
export * from "./useGroupPosts";
export * from "./useCreatePost";
export * from "./useEditPost";
export * from "./useDeletePost";
export * from "./useComments";
export * from "./useAddComment";
export * from "./useEditComment";
export * from "./useDeleteComment";
export * from "./usePostReactions";

// Export the base types directly
export * from "./types";

// Export reaction types with their namespace to avoid conflicts
export type {
  PostReactionType,
  UsePostReactionsProps,
  UsePostReactionsResult
} from "./types/reactionTypes";

// Export comment types with their namespace
export type {
  ReactionType as CommentReactionType,
  Comment,
  UseCommentsResult,
  OptimisticComment
} from "./types/commentTypes";

// Re-export useCommentReactions but rename the ReactionType to avoid conflict
export { useCommentReactions } from "./useCommentReactions";
export type { ReactionType } from "./useCommentReactions";
