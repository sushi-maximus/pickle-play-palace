
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
  
  // Events
  events: {
    all: ['events'] as const,
    lists: () => [...queryKeys.events.all, 'list'] as const,
    group: (groupId: string) => [...queryKeys.events.all, 'group', groupId] as const,
    detail: (id: string) => [...queryKeys.events.all, 'detail', id] as const,
  },
  
  // Posts - CRITICAL: Include userId in query key for user-specific data
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (groupId: string, userId?: string) => [...queryKeys.posts.lists(), { groupId, userId }] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
    comments: (postId: string, userId?: string) => [...queryKeys.posts.detail(postId), 'comments', { userId }] as const,
    reactions: (postId: string, userId?: string) => [...queryKeys.posts.detail(postId), 'reactions', { userId }] as const,
  },
  
  // Profile
  profile: {
    all: ['profile'] as const,
    details: () => [...queryKeys.profile.all, 'detail'] as const,
    detail: (userId: string) => [...queryKeys.profile.details(), userId] as const,
  },
  
  // Comments - CRITICAL: Include userId for user-specific reaction data
  comments: {
    all: ['comments'] as const,
    reactions: (commentId: string, userId?: string) => [...queryKeys.comments.all, commentId, 'reactions', { userId }] as const,
  }
} as const;

export type QueryKeys = typeof queryKeys;
