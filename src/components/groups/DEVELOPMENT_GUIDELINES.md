
# Groups Component Development Guidelines

## Component Development Standards

### 1. Component Structure
- **Keep components small**: Maximum 50 lines of code per file
- **Single responsibility**: Each component should have one clear purpose
- **Use TypeScript**: All components must be fully typed with no `any` types
- **Follow naming conventions**: Use PascalCase for components, camelCase for functions

### 2. Type Safety Requirements
```typescript
// REQUIRED: Import database types
import type { Database } from "@/integrations/supabase/types";

// STANDARD: Group type pattern
type Group = Database['public']['Tables']['groups']['Row'] & {
  member_count: number;
};

// FORBIDDEN: Never use 'any'
interface Props {
  group: any; // ❌ WRONG
}

// CORRECT: Use proper types
interface Props {
  group: Group; // ✅ CORRECT
}
```

### 3. Error Handling Standards
- **Wrap components in error boundaries**: Use `GroupComponentErrorBoundary`
- **Handle missing data gracefully**: Always check for null/undefined values
- **Provide fallback UI**: Show meaningful error states to users
- **Add defensive coding**: Validate props and data before using

```typescript
// Example error handling
const GroupCard = ({ group }: { group: Group }) => {
  if (!group) {
    return <div>Group data not available</div>;
  }

  return (
    <GroupComponentErrorBoundary
      fallback={<div>Failed to load group</div>}
    >
      {/* Component content */}
    </GroupComponentErrorBoundary>
  );
};
```

### 4. Performance Guidelines
- **Use React.memo()** for components that receive stable props
- **Implement useMemo()** for expensive calculations
- **Use useCallback()** for event handlers passed to child components
- **Avoid inline object creation** in render methods

### 5. Testing Requirements
- **Unit tests**: All components must have corresponding test files
- **Error scenarios**: Test edge cases and error conditions
- **Performance**: Add performance benchmarks for critical components
- **Integration**: Test component interactions with hooks and services

### 6. Mobile-First Design
- **Responsive patterns**: Use `px-3 py-4 md:px-6 md:py-8` for padding
- **Icon sizing**: Mobile `h-3 w-3`, Desktop `md:h-4 md:w-4`
- **Spacing**: Use `space-y-3 md:space-y-4` for consistent vertical spacing
- **Touch targets**: Ensure minimum 44px touch targets on mobile

## Component Creation Checklist

### Before Creating a New Component:
- [ ] Component has single, clear responsibility
- [ ] Component name follows PascalCase convention
- [ ] All props are properly typed (no `any` types)
- [ ] Component handles missing/null data gracefully
- [ ] Mobile-responsive design implemented
- [ ] Error boundary wrapper included if needed

### After Creating a Component:
- [ ] Unit tests written and passing
- [ ] Component documented in README.md
- [ ] Performance optimizations applied if needed
- [ ] Accessibility requirements met (ARIA labels, keyboard navigation)
- [ ] Component added to appropriate index.ts exports

## Common Patterns

### 1. Group Card Components
```typescript
interface GroupCardProps {
  group: Group;
  isMember?: boolean;
  isAdmin?: boolean;
  className?: string;
  onAction?: (action: string, groupId: string) => void;
}

const GroupCard = memo(({ group, isMember, className }: GroupCardProps) => {
  // Implementation
});
```

### 2. List Components
```typescript
interface GroupsListProps {
  groups: Group[];
  loading?: boolean;
  onRefresh?: () => void;
  emptyMessage?: string;
}
```

### 3. Hook Patterns
```typescript
// Return type should be explicit
interface UseGroupsReturn {
  groups: Group[];
  loading: boolean;
  error: Error | null;
  refreshData: () => Promise<void>;
}

export const useGroups = (): UseGroupsReturn => {
  // Implementation
};
```

## Breaking Change Protocol

### When Making Interface Changes:
1. **Create new version** rather than modifying existing interface
2. **Add deprecation warnings** to old interface
3. **Provide migration guide** in pull request
4. **Update all usage examples** in documentation
5. **Test backward compatibility** with existing components

### Version Naming:
- Major interface changes: `ComponentNameV2`
- Minor enhancements: Add optional props with defaults
- Bug fixes: No interface changes needed

## Code Review Requirements

### PR Checklist for Group Components:
- [ ] No TypeScript errors or warnings
- [ ] All tests pass and coverage maintained
- [ ] No console errors in development
- [ ] Component renders correctly on mobile and desktop
- [ ] Performance impact assessed (bundle size, render time)
- [ ] Accessibility tested with screen reader
- [ ] Documentation updated if needed
- [ ] Breaking changes documented

### Performance Benchmarks:
- Component render time: < 16ms (60fps)
- Bundle size impact: < 10KB per component
- Memory usage: No memory leaks in profiler
- Network requests: Minimize API calls per component

## Debugging Guidelines

### Development Debugging:
```typescript
// Add debug logs for complex components
console.log("GroupCard: rendering with group:", group.id, group.name);

// Use React DevTools profiler for performance issues
// Check component re-render frequency
// Monitor props changes and memo effectiveness
```

### Production Debugging:
- Use error boundaries to catch and report errors
- Add telemetry for critical user flows
- Monitor performance metrics
- Log user interactions for debugging

## Migration Guidelines

### When Updating Existing Components:
1. **Assess impact**: List all files that import the component
2. **Create migration plan**: Step-by-step update process
3. **Test thoroughly**: All affected components and pages
4. **Update documentation**: Reflect new usage patterns
5. **Communicate changes**: Notify team of breaking changes

This ensures the Groups page remains robust, maintainable, and follows consistent development patterns.
