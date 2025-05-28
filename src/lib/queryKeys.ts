
export const queryKeys = {
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.posts.lists(), { filters }] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
    comments: (postId: string, userId?: string) => [...queryKeys.posts.detail(postId), 'comments', { userId }] as const,
  },
  groups: {
    all: ['groups'] as const,
    lists: () => [...queryKeys.groups.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.groups.lists(), { filters }] as const,
    details: () => [...queryKeys.groups.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.groups.details(), id] as const,
    members: (groupId: string) => [...queryKeys.groups.detail(groupId), 'members'] as const,
    member: (groupId: string, userId: string) => [...queryKeys.groups.members(groupId), userId] as const,
    myGroups: (userId: string) => [...queryKeys.groups.all, 'my-groups', userId] as const,
    // Enhanced query keys for better caching
    allGroups: () => [...queryKeys.groups.all, 'all-groups'] as const,
    userMemberships: (userId: string) => [...queryKeys.groups.all, 'user-memberships', userId] as const,
    searchResults: (searchTerm: string, mode: string, userId?: string) => [
      ...queryKeys.groups.all, 
      'search', 
      { searchTerm, mode, userId }
    ] as const,
  },
  events: {
    all: ['events'] as const,
    lists: () => [...queryKeys.events.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...queryKeys.events.lists(), { filters }] as const,
    details: () => [...queryKeys.events.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.events.details(), id] as const,
    players: (eventId: string) => [...queryKeys.events.detail(eventId), 'players'] as const,
    registration: (eventId: string, userId?: string) => [...queryKeys.events.detail(eventId), 'registration', { userId }] as const,
    group: (groupId: string) => [...queryKeys.events.all, 'group', groupId] as const,
  },
  profile: {
    all: ['profile'] as const,
    detail: (userId: string) => [...queryKeys.profile.all, 'detail', userId] as const,
  },
  comments: {
    all: ['comments'] as const,
    list: (postId: string) => [...queryKeys.comments.all, 'list', postId] as const,
  },
} as const;
