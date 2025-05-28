
import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUnifiedGroups } from '../hooks/useUnifiedGroups';

// Mock the data utilities
vi.mock('../utils/groupDataUtils', () => ({
  fetchAllGroupsOptimized: vi.fn(() => Promise.resolve([
    {
      id: 'group-1',
      name: 'Test Group 1',
      description: 'Description 1',
      member_count: 5,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      created_by: 'user-1',
      is_private: false,
      location: 'Test City',
      max_members: 20,
      avatar_url: null,
      skill_level_min: 1,
      skill_level_max: 5
    }
  ])),
  fetchUserMembershipsOptimized: vi.fn(() => Promise.resolve([
    {
      id: 'membership-1',
      role: 'member',
      group: {
        id: 'group-1',
        name: 'Test Group 1'
      }
    }
  ])),
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const createWrapper = () => {
  const queryClient = createTestQueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useUnifiedGroups', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches all groups successfully', async () => {
    const { result } = renderHook(
      () => useUnifiedGroups({
        mode: 'all',
        searchTerm: '',
        userId: 'user-1'
      }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.filteredGroups).toHaveLength(1);
    expect(result.current.filteredGroups[0].name).toBe('Test Group 1');
  });

  it('filters groups by search term', async () => {
    const { result } = renderHook(
      () => useUnifiedGroups({
        mode: 'all',
        searchTerm: 'nonexistent',
        userId: 'user-1'
      }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.filteredGroups).toHaveLength(0);
  });

  it('filters to only user groups in my-groups mode', async () => {
    const { result } = renderHook(
      () => useUnifiedGroups({
        mode: 'my-groups',
        searchTerm: '',
        userId: 'user-1'
      }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should show groups where user is a member
    expect(result.current.filteredGroups).toHaveLength(1);
    expect(result.current.filteredGroups[0].isMember).toBe(true);
  });

  it('provides refresh functionality', async () => {
    const { result } = renderHook(
      () => useUnifiedGroups({
        mode: 'all',
        searchTerm: '',
        userId: 'user-1'
      }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(typeof result.current.refreshData).toBe('function');
    expect(typeof result.current.refetch).toBe('function');
  });
});
