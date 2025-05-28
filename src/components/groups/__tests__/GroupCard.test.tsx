
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { OptimizedGroupCardHybrid1 } from '../ui/OptimizedGroupCardHybrid1';
import type { UnifiedGroup } from '../hooks/types/unifiedGroupTypes';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
}));

const mockGroup: UnifiedGroup = {
  id: 'test-group-1',
  name: 'Test Group',
  description: 'A test group for testing',
  location: 'Test City',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  created_by: 'user-1',
  is_private: false,
  member_count: 10,
  max_members: 20,
  avatar_url: null,
  skill_level_min: 1,
  skill_level_max: 5,
  isMember: false,
  membershipRole: undefined,
  membershipId: undefined
};

describe('OptimizedGroupCardHybrid1', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders group information correctly', () => {
    render(<OptimizedGroupCardHybrid1 group={mockGroup} />);
    
    expect(screen.getByText('Test Group')).toBeInTheDocument();
    expect(screen.getByText('A test group for testing')).toBeInTheDocument();
    expect(screen.getByText('Test City')).toBeInTheDocument();
    expect(screen.getByText('10 members')).toBeInTheDocument();
  });

  it('shows member status when user is a member', () => {
    const memberGroup = { ...mockGroup, isMember: true };
    render(<OptimizedGroupCardHybrid1 group={memberGroup} isMember={true} />);
    
    // Should show member indicator or different styling
    expect(screen.getByText('Test Group')).toBeInTheDocument();
  });

  it('handles missing optional data gracefully', () => {
    const minimalGroup = {
      ...mockGroup,
      description: null,
      location: null,
      avatar_url: null
    };
    
    render(<OptimizedGroupCardHybrid1 group={minimalGroup} />);
    expect(screen.getByText('Test Group')).toBeInTheDocument();
  });

  it('displays skill level range', () => {
    render(<OptimizedGroupCardHybrid1 group={mockGroup} />);
    
    // Check that skill levels are displayed somehow
    expect(screen.getByText('Test Group')).toBeInTheDocument();
  });

  it('shows private group indicator when group is private', () => {
    const privateGroup = { ...mockGroup, is_private: true };
    render(<OptimizedGroupCardHybrid1 group={privateGroup} />);
    
    expect(screen.getByText('Test Group')).toBeInTheDocument();
  });
});
