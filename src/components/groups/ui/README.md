
# Groups UI Components Documentation

## Component Hierarchy and Usage Guide

### Primary Components (Recommended for New Development)

#### 1. GroupCardHybrid1
**Purpose:** The main group card component with overlay design featuring stats and image background.

**When to use:**
- Default choice for group displays
- When you want visual impact with background images
- For modern, card-based layouts

**Props:**
```typescript
interface GroupCardProps {
  group: Group;
  isAdmin?: boolean;
  className?: string;
}
```

**Usage Example:**
```tsx
import { GroupCardHybrid1 } from '@/components/groups/ui';

<GroupCardHybrid1 
  group={group} 
  isAdmin={userIsAdmin}
  className="hover:shadow-xl" 
/>
```

#### 2. OptimizedGroupCardHybrid1
**Purpose:** Performance-optimized version of GroupCardHybrid1 with additional membership features.

**When to use:**
- Large lists of groups (>20 items)
- When performance is critical
- When you need membership status indicators

**Props:**
```typescript
interface GroupCardHybridProps extends GroupCardProps {
  isMember?: boolean;
}
```

**Usage Example:**
```tsx
import { OptimizedGroupCardHybrid1 } from '@/components/groups/ui';

<OptimizedGroupCardHybrid1 
  group={group}
  isMember={userIsMember}
  isAdmin={userIsAdmin}
/>
```

#### 3. UnifiedGroupsGrid
**Purpose:** Grid container that displays multiple group cards with animations and loading states.

**When to use:**
- Displaying lists of groups
- Need consistent grid layout
- Want built-in loading and empty states

**Props:**
```typescript
interface UnifiedGroupsGridProps {
  groups: UnifiedGroup[];
  loading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}
```

**Usage Example:**
```tsx
import { UnifiedGroupsGrid } from '@/components/groups/ui';

<UnifiedGroupsGrid 
  groups={groups}
  loading={isLoading}
  emptyMessage="No groups found"
/>
```

### Core UI Components (Essential Utilities)

#### GroupsEmptyState
**Purpose:** Displays empty state when no groups are found.

**Usage:**
```tsx
<GroupsEmptyState 
  type="no-groups" 
  onRefresh={handleRefresh} 
/>
```

#### GroupsLoadingState
**Purpose:** Skeleton loading state for group lists.

**Usage:**
```tsx
<GroupsLoadingState count={6} />
```

#### GroupsPagination
**Purpose:** Pagination controls for group lists.

**Usage:**
```tsx
<GroupsPagination 
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
```

### Secondary Components (Alternative Options)

#### GroupCardHybrid2
**Purpose:** Split-layout design with image on left, content on right.

**When to use:**
- When you prefer horizontal layouts
- Limited vertical space
- Different visual variety

#### GroupCardHybrid3
**Purpose:** Traditional card with header image and content below.

**When to use:**
- More traditional card design
- When image should be separate from content
- Conservative design preferences

### Legacy Components (Backward Compatibility Only)

#### GroupCardDesign1, GroupCardDesign2, GroupCardDesign3
**Status:** Deprecated - use Hybrid components instead

#### GroupsGrid
**Status:** Deprecated - use UnifiedGroupsGrid instead

### Showcase Component (Development/Testing Only)

#### GroupCardShowcase
**Purpose:** Displays all card variants for design comparison.

**When to use:**
- Development and testing
- Design reviews
- Component comparison

## Component Selection Guide

### For New Features:
1. **Default choice:** `GroupCardHybrid1` + `UnifiedGroupsGrid`
2. **Performance critical:** `OptimizedGroupCardHybrid1` + `UnifiedGroupsGrid`
3. **Alternative layouts:** `GroupCardHybrid2` or `GroupCardHybrid3`

### Migration Path:
- `GroupCardDesign*` → `GroupCardHybrid1`
- `GroupsGrid` → `UnifiedGroupsGrid`
- Individual cards → Use grid component for consistency

## Type System

### Core Types:
```typescript
// Main group type from database
type Group = Database['public']['Tables']['groups']['Row'] & {
  members?: GroupMember[];
  member_count: number;
};

// Standard props for all group cards
interface GroupCardProps {
  group: Group;
  isAdmin?: boolean;
  className?: string;
}

// Extended props for hybrid components
interface GroupCardHybridProps extends GroupCardProps {
  isMember?: boolean;
}
```

### Import Pattern:
```typescript
import type { Group, GroupCardProps, GroupCardHybridProps } from '@/components/groups/ui';
```

## Best Practices

### Performance:
- Use `OptimizedGroupCardHybrid1` for lists > 20 items
- Implement proper `key` props in lists
- Use `React.memo()` for custom components

### Accessibility:
- All cards are keyboard navigable
- Proper ARIA labels included
- Color contrast compliance

### Responsive Design:
- Grid automatically adapts to screen size
- Cards scale appropriately
- Touch-friendly on mobile

### Error Handling:
- Components handle missing data gracefully
- Fallback images for groups without avatars
- Defensive coding for all props

## Common Patterns

### Standard Group List:
```tsx
const GroupsList = ({ groups, loading }) => (
  <UnifiedGroupsGrid 
    groups={groups}
    loading={loading}
    emptyMessage="No groups found"
  />
);
```

### With Pagination:
```tsx
const PaginatedGroups = ({ groups, page, totalPages, onPageChange }) => (
  <>
    <UnifiedGroupsGrid groups={groups} />
    <GroupsPagination 
      currentPage={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  </>
);
```

### Performance Optimized:
```tsx
const OptimizedGroupsList = memo(({ groups, userMemberships }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {groups.map(group => (
      <OptimizedGroupCardHybrid1
        key={group.id}
        group={group}
        isMember={userMemberships.includes(group.id)}
      />
    ))}
  </div>
));
```

## Troubleshooting

### Common Issues:

1. **Missing group data:** Ensure `member_count` is included
2. **Type errors:** Import types from `/types/GroupCardTypes`
3. **Performance issues:** Switch to optimized components
4. **Layout problems:** Use `UnifiedGroupsGrid` for consistent spacing

### Debug Tips:
- Check console for group data structure
- Verify all required props are passed
- Test with various group data scenarios
- Use React DevTools for performance profiling
