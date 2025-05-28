
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GroupsList } from '../GroupsList';

// Mock the hooks
vi.mock('../hooks/useUnifiedGroups', () => ({
  useUnifiedGroups: vi.fn(() => ({
    filteredGroups: [],
    loading: false,
    refreshData: vi.fn(),
  })),
}));

// Mock UI components
vi.mock('../ui/UnifiedGroupsGrid', () => ({
  UnifiedGroupsGrid: ({ groups, loading }: any) => (
    <div data-testid="unified-groups-grid">
      {loading ? 'Loading...' : `${groups.length} groups`}
    </div>
  ),
}));

vi.mock('../ui/GroupsLoadingState', () => ({
  GroupsLoadingState: () => <div data-testid="loading-state">Loading groups...</div>,
}));

vi.mock('../ui/GroupsEmptyState', () => ({
  GroupsEmptyState: ({ type }: any) => (
    <div data-testid="empty-state">{type} empty state</div>
  ),
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
};

describe('GroupsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    const { useUnifiedGroups } = require('../hooks/useUnifiedGroups');
    useUnifiedGroups.mockReturnValue({
      filteredGroups: [],
      loading: true,
      refreshData: vi.fn(),
    });

    renderWithQueryClient(<GroupsList user={mockUser} />);
    
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });

  it('renders groups grid when data is loaded', () => {
    const mockGroups = [
      {
        id: 'group-1',
        name: 'Test Group 1',
        member_count: 5,
      },
      {
        id: 'group-2', 
        name: 'Test Group 2',
        member_count: 10,
      },
    ];

    const { useUnifiedGroups } = require('../hooks/useUnifiedGroups');
    useUnifiedGroups.mockReturnValue({
      filteredGroups: mockGroups,
      loading: false,
      refreshData: vi.fn(),
    });

    renderWithQueryClient(<GroupsList user={mockUser} />);
    
    expect(screen.getByTestId('unified-groups-grid')).toBeInTheDocument();
    expect(screen.getByText('2 groups')).toBeInTheDocument();
  });

  it('renders empty state when no groups found', () => {
    const { useUnifiedGroups } = require('../hooks/useUnifiedGroups');
    useUnifiedGroups.mockReturnValue({
      filteredGroups: [],
      loading: false,
      refreshData: vi.fn(),
    });

    renderWithQueryClient(<GroupsList user={mockUser} searchTerm="" />);
    
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('shows search results empty state when search term provided', () => {
    const { useUnifiedGroups } = require('../hooks/useUnifiedGroups');
    useUnifiedGroups.mockReturnValue({
      filteredGroups: [],
      loading: false,
      refreshData: vi.fn(),
    });

    renderWithQueryClient(<GroupsList user={mockUser} searchTerm="nonexistent" />);
    
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });
});
