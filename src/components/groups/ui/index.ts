
// Phase 1 Step 1.3: Simplified exports with clear hierarchy

// PRIMARY COMPONENTS - Use these for new development
export { GroupCardHybrid1 } from './GroupCardHybrid1';
export { OptimizedGroupCardHybrid1 } from './OptimizedGroupCardHybrid1';
export { UnifiedGroupsGrid } from './UnifiedGroupsGrid';

// CORE UI COMPONENTS - Essential utilities
export { GroupsEmptyState } from './GroupsEmptyState';
export { GroupsLoadingState } from './GroupsLoadingState';
export { GroupsPagination } from './GroupsPagination';

// SECONDARY COMPONENTS - Available but not primary choice
export { GroupCardHybrid2 } from './GroupCardHybrid2';
export { GroupCardHybrid3 } from './GroupCardHybrid3';

// LEGACY COMPONENTS - Maintained for backward compatibility only
export { GroupCardDesign1 } from './GroupCardDesign1';
export { GroupCardDesign2 } from './GroupCardDesign2';
export { GroupCardDesign3 } from './GroupCardDesign3';
export { GroupsGrid } from './GroupsGrid';

// SHOWCASE COMPONENT - For development/testing only
export { GroupCardShowcase } from './GroupCardShowcase';

// TYPE EXPORTS - Make types available for external use
export type { Group, GroupCardProps, GroupCardHybridProps } from './types/GroupCardTypes';
