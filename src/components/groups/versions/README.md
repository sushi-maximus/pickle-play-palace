
# Component Versioning Strategy

## Overview
This directory contains versioned components to handle breaking changes while maintaining backward compatibility.

## Versioning Rules

### Version Structure
- `v1/` - Original stable version
- `v2/` - Next major version with breaking changes
- Each version maintains its own complete component set

### When to Create New Version
1. **Interface Breaking Changes**: Props interface changes that would break existing usage
2. **Behavior Changes**: Fundamental changes in component behavior
3. **API Changes**: Changes to hook returns or component exports

### Migration Strategy
1. Create new version directory (e.g., `v2/`)
2. Copy components to new version and modify
3. Add deprecation warnings to old version
4. Provide migration guide in version README
5. Update main exports to use new version
6. Maintain old version for 2 major releases

### Current Versions
- **v1**: Current stable version (default export)
- **v2**: Not yet created

## Example Usage

```typescript
// Current version (recommended)
import { OptimizedGroupCardHybrid1 } from '@/components/groups/ui/OptimizedGroupCardHybrid1';

// Specific version (when needed)
import { OptimizedGroupCardHybrid1 as OptimizedGroupCardV1 } from '@/components/groups/versions/v1/OptimizedGroupCardHybrid1';
```

## Breaking Change Protocol
1. **Assess Impact**: List all components that will be affected
2. **Create Migration Plan**: Document step-by-step migration process
3. **Version Components**: Create new version with changes
4. **Add Warnings**: Add console warnings to deprecated components
5. **Update Documentation**: Provide clear migration examples
6. **Communicate**: Notify team of timeline and breaking changes

## Deprecation Timeline
- **Phase 1** (Release): New version available, old version marked deprecated
- **Phase 2** (Next major): Old version shows warnings in development
- **Phase 3** (Following major): Old version removed, migration required

This ensures smooth transitions and prevents breaking changes from disrupting existing functionality.
