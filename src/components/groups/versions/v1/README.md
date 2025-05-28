
# Version 1 Components

This directory contains the stable v1 versions of group components.

## Status: Current Stable Version

These components represent the current stable API and are the default exports from the main UI directory.

## Components Included
- OptimizedGroupCardHybrid1
- UnifiedGroupsGrid
- VirtualizedGroupsGrid
- GroupsLoadingState
- GroupsEmptyState

## Migration Notice
If you're using components from this directory directly, consider using the main exports instead:

```typescript
// Instead of:
import { OptimizedGroupCardHybrid1 } from '@/components/groups/versions/v1/OptimizedGroupCardHybrid1';

// Use:
import { OptimizedGroupCardHybrid1 } from '@/components/groups/ui/OptimizedGroupCardHybrid1';
```

## Backward Compatibility
This version will be maintained for backward compatibility until v3 is released.
