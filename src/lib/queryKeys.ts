
// Centralized query key factory for consistent cache management
export const queryKeys = {
  // Groups
  groups: {
    all: ['groups'] as const,
    lists: () => [...queryKeys.groups.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.groups.lists(), { filters }] as const,
    details: () => [...queryKeys.groups.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.groups.details(), id] as const,
    members: (id: string) => [...queryKeys.groups.detail(id), 'members'] as const,
    myGroups: (userId: string) => [...queryKeys.groups.all, 'my', userId] as const,
  },
  
  // Posts - CRITICAL: Include userId in query key for user-specific data
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (groupId: string, userId?: string) => [...queryKeys.posts.lists(), { groupId, userId }] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
    comments: (postId: string) => [...queryKeys.posts.detail(postId), 'comments'] as const,
    reactions: (postId: string) => [...queryKeys.posts.detail(postId), 'reactions'] as const,
  },
  
  // Profile
  profile: {
    all: ['profile'] as const,
    details: () => [...queryKeys.profile.all, 'detail'] as const,
    detail: (userId: string) => [...queryKeys.profile.details(), userId] as const,
  },
  
  // Comments
  comments: {
    all: ['comments'] as const,
    reactions: (commentId: string) => [...queryKeys.comments.all, commentId, 'reactions'] as const,
  }
} as const;

export type QueryKeys = typeof queryKeys;
