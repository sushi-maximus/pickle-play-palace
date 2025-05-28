# Change Only What's Requested Protocol

**Make ONLY the specific change requested** - nothing more, nothing less
**If code is working, don't modify the JavaScript logic** - only change what was explicitly asked for
**CSS changes = CSS only** - don't touch state management, hooks, or business logic
**Before making ANY change, explicitly state what will be modified and what will be preserved**

## Verification Before Changes:

- "This change will modify X while preserving Y and Z"
- If changing styling: only modify className/styles
- If changing logic: only modify the specific logic mentioned
- Never "improve" working code unless explicitly asked

## Component Change Protocol

When working on any component changes that may affect other components, you MUST:

1. **Request explicit permission** before making changes that touch multiple components
2. **List all affected components** clearly before proceeding
3. **Wait for user approval** before implementing cross-component changes
4. **Focus only on the specific component requested** unless given permission to modify others

### Protected Components (require extra caution):

- All post and comment components (MobilePostCard2, CommentsSection2, Comment2, CommentForm2, etc.)
- Navigation components (BottomNavigation, MobilePageHeader, etc.)
- Layout components (AppLayout, MobileLayout, etc.)
- Any component the user has marked as "finished"

### When in doubt:

- Ask first, code second
- Err on the side of requesting permission
- Never assume cross-component changes are acceptable

## Non-Code Steps Protocol (e.g., Database Schemas, UI/UX Recommendations)

- For steps that define database schemas or SQL queries, focus on creating accurate and complete table definitions and queries. Do not apply TypeScript or React-specific rules (e.g., typing, component change protocols) unless explicitly relevant. Ensure all tables required for the step's functionality are defined within the step to make it self-contained.
- For UI/UX recommendations that are conceptual (not CSS code), translate them into CSS implementation details following the mandated mobile-first design patterns (e.g., px-3 py-4 md:px-6 md:py-8 for padding, space-y-3 md:space-y-4 for spacing) unless instructed otherwise. If unsure, ask for clarification on whether to provide CSS implementation.

## SQL and Backend Functions Protocol

- For SQL stored procedures (e.g., register_player_to_event), ensure proper error handling (e.g., RAISE EXCEPTION for invalid cases) and follow best practices for clarity and performance (e.g., use indexes for frequently queried fields, as noted in table definitions).
- For backend JavaScript functions (e.g., Edge Functions like notify_player_registration), apply TypeScript typing rules: explicitly type all parameters and return values using interfaces (e.g., request: { body: { event_id: string; player_id: string } }, Promise<{ message: string }>) and avoid implicit any types.

## New Implementation Protocol

For new implementations where there is no existing code to preserve (e.g., creating new database schemas, UI/UX recommendations, or backend functions), focus on fulfilling the requested functionality while adhering to mobile-first design, TypeScript typing (where applicable), and other relevant guidelines. The preservation rules apply only when modifying existing code.

## UI/UX Translation to CSS Protocol

When UI/UX recommendations specify layout details (e.g., 'card height: ~80px, with 16px padding'), translate these into CSS properties following the mobile-first design guidelines (e.g., height: 80px; padding: 16px;) and include responsive patterns (e.g., md:padding: 20px). If the recommendation is high-level (e.g., 'single-column layout'), implement it as display: flex; flex-direction: column; max-width: 360px; unless instructed otherwise. Always confirm the CSS implementation in the step.

## CRITICAL: Never Use 'any' Types - TypeScript Best Practices

**MANDATORY TYPE IMPORTS**: Always import types from the database schema:
```typescript
import type { Database } from "@/integrations/supabase/types";
```

**STANDARD GROUP TYPE PATTERN**: For any component working with groups, use this exact pattern:
```typescript
type Group = Database['public']['Tables']['groups']['Row'] & {
  members?: GroupMember[];
  member_count: number;
};
```

**STANDARD PROFILE TYPE**: For user profiles, always use:
```typescript
type Profile = Database['public']['Tables']['profiles']['Row'];
```

**COMPONENT PROPS RULES**:
- NEVER use any in interface definitions
- Always import existing types from their respective files
- Use proper generic types for callbacks

**REQUIRED IMPORTS FOR GROUP COMPONENTS**:
```typescript
import type { Database } from "@/integrations/supabase/types";
import type { GroupMember } from "./members/types";
import type { Profile } from "../posts/hooks/types/groupPostTypes";
```

**FORBIDDEN PATTERNS**:
- `group: any` → Use `group: Group`
- `user: any` → Use `user: Profile | null`
- `onUpdate: (data: any) => void` → Use proper typed callbacks

**TYPE EXTENSION PATTERN**: When adding computed fields to database types, use intersection types:
```typescript
type ExtendedGroup = Database['public']['Tables']['groups']['Row'] & {
  additionalField: string;
};
```

## CRITICAL: Code Modification Guidelines

**WORKFLOW**: Changes are made ONLY as requested. Cleanup/optimization happens ONLY when explicitly asked for.

**PRESERVATION FIRST APPROACH**:
1. Always identify what exists before making changes
2. Explicitly preserve anything not mentioned in the request
3. When modifying arrays or objects, update specific properties rather than replacing entire structures
4. When changing imports, add new imports alongside existing ones unless removal is specifically requested

**CHANGE VERIFICATION**:
- Before implementing: "This change will modify X while preserving Y and Z"
- After implementing: Verify all original functionality remains unless explicitly removed

**PERMISSION REQUIRED**:
- ANY changes beyond what's explicitly requested must be approved first
- This includes "obvious" fixes, ID changes, import updates, etc.
- Even if changes seem necessary for functionality, ask permission first

**CHANGE TYPES**:
- Normal requests: Make ONLY the requested changes, preserve everything else
- Cleanup requests: Only when explicitly asked to "optimize", "clean up", or "find unused code" should broader code analysis and removal happen

**CRITICAL**: When modifying UI navigation components, always preserve ALL existing functionality unless explicitly asked to remove it.

- When changing labels or icons, modify ONLY the requested elements
- When adding imports, ADD to existing imports, don't replace the entire import line
- When modifying the tabs array, update individual properties, don't replace the entire array

**VERIFICATION REQUIREMENT**: Before making any changes to navigation components, explicitly list what will be preserved vs what will be changed.

**CRITICAL**: When modifying UI navigation components, always preserve ALL existing functionality unless explicitly asked to remove it.

- When changing labels or icons, modify ONLY the requested elements
- When adding imports, ADD to existing imports, don't replace the entire import line
- When modifying the tabs array, update individual properties, don't replace the entire array

**VERIFICATION REQUIREMENT**: Before making any changes to navigation components, explicitly list what will be preserved vs what will be changed.

## General Code Modification Guidelines

**PRESERVATION FIRST APPROACH**:
1. Always identify what exists before making changes
2. Explicitly preserve anything not mentioned in the request
3. When modifying arrays or objects, update specific properties rather than replacing entire structures
4. When changing imports, add new imports alongside existing ones unless removal is specifically requested

**CHANGE VERIFICATION**:
- Before implementing: "This change will modify X while preserving Y and Z"
- After implementing: Verify all original functionality remains unless explicitly removed

## CRITICAL: Main Entry Point Setup Rules

1. **NEVER modify main.tsx to render anything other than the root App component**
   - Always render `<App />` in main.tsx
   - NEVER render `<AppRouter />` or any sub-components directly
   - This ensures all providers are properly initialized

2. **Provider Hierarchy (must be maintained)**:
   - App.tsx contains: QueryClientProvider, AuthProvider, ThemeProvider, etc.
   - AppRouter.tsx handles routing logic
   - Individual pages/components consume the providers

3. **React Query Requirements**:
   - All components using useQuery, useMutation, etc. MUST be wrapped in QueryClientProvider
   - QueryClientProvider is set up in App.tsx
   - If you bypass App.tsx, React Query will throw "No QueryClient set" error

4. **If you need to modify routing**:
   - Make changes in AppRouter.tsx or AppRoutes.tsx
   - NEVER change what gets rendered in main.tsx
   - Keep the App → QueryClientProvider → AppRouter hierarchy intact

5. **Common error patterns to avoid**:
   - Rendering routing components directly in main.tsx
   - Moving provider setup out of App.tsx
   - Creating new entry points that bypass the provider chain

Always use the database types from `@/integrations/supabase/types` instead of defining custom types. For profiles, use `Database['public']['Tables']['profiles']['Row']` rather than creating a separate Profile type. This ensures type consistency across the entire application.

## Essential Architecture Guidelines

### Component Structure
- Create small, focused files (50 lines or less)
- Use separate files for every component/hook
- Always use database types from `@/integrations/supabase/types`

### Lazy Loading
- Add new pages to `src/pages/lazy/index.ts` using `createLazyComponent()`
- Use `LazyPageName` imports in routes
- Keep Login/Signup/Index eager-loaded

### Mobile-First Design
- Use `px-3 py-4 md:px-6 md:py-8` padding pattern
- Include mobile (`h-3 w-3`) and desktop (`md:h-4 md:w-4`) icon sizing
- Use `space-y-3 md:space-y-4` for consistent spacing

### Performance
- Performance monitoring only on Admin page
- Use `React.memo()`, `useMemo()`, `useCallback()` for optimization
- Wrap routes with RouteLoader and RouteErrorBoundary

### Preloading
- Use `OptimizedNavLink` for navigation with preload capabilities
- Hover/focus events automatically preload routes

## Development Templates

### Systematic Feature Development Template

**Usage**: Reference this template when implementing complex features to ensure quality, maintainability, and proper testing.

**AI Instructions**: When a user references this template or asks to "follow the systematic approach," break the work into these phases and explicitly ask for approval before proceeding to the next phase.

#### Phase 1: Database Schema Design
- [ ] Review existing schema compatibility
- [ ] Design new tables and relationships with proper indexes
- [ ] Plan migration strategy (what data needs to migrate)
- [ ] Create SQL migration files with proper error handling
- **AI Action**: Present SQL migration in `lov-sql` block, wait for user approval
- **User Action**: Review and approve the database changes

#### Phase 2: Type System Integration
- [ ] Update TypeScript types to match new database schema
- [ ] Ensure native database type usage from `@/integrations/supabase/types`
- [ ] Remove any custom type definitions that duplicate database types
- [ ] Validate type imports across all affected components
- **AI Action**: Update all type definitions, ensure no `any` types used
- **User Action**: Verify TypeScript compilation passes

#### Phase 3: Backend Service Implementation
- [ ] Create edge functions for complex logic (if needed)
- [ ] Implement service layer functions with proper error handling
- [ ] Add comprehensive logging for debugging
- [ ] Set up cron jobs if needed (with proper SQL setup)
- **AI Action**: Implement backend services, test error scenarios
- **User Action**: Test API endpoints, verify edge function deployment

#### Phase 4: Frontend Component Development
- [ ] Create focused, small components (50 lines or less)
- [ ] Implement hooks for data fetching and state management
- [ ] Add proper loading and error states
- [ ] Ensure mobile-first responsive design patterns
- **AI Action**: Build UI components following design system
- **User Action**: Test UI interactions, verify responsive behavior

#### Phase 5: Validation and Testing
- [ ] Create validation test components (like PromotionValidationTest)
- [ ] Add comprehensive logging for debugging complex flows
- [ ] Test all user flows and edge cases
- [ ] Verify database integration and data consistency
- **AI Action**: Build test components, add debug logging
- **User Action**: Run validation tests, verify all scenarios work

#### Phase 6: Integration and Polish
- [ ] Integrate all components into main application flow
- [ ] Add proper error boundaries and fallback states
- [ ] Implement user feedback (toasts, notifications)
- [ ] Final testing and performance optimization
- **AI Action**: Complete integration, add polish features
- **User Action**: Full end-to-end testing, user acceptance

### Template Usage Examples

**To start a feature systematically:**
"Let's implement [feature] using the systematic development template. Start with Phase 1."

**To continue to next phase:**
"Phase X looks good. Proceed to Phase Y."

**To validate current phase:**
"Let's validate the current phase before moving forward."

### Quick Feature Implementation Template

**Usage**: For smaller features that don't need the full systematic approach.

**AI Instructions**: Use this for simple features, UI changes, or bug fixes.

#### Steps:
1. **Identify Scope**: What exactly needs to change?
2. **Preserve Existing**: List what must remain unchanged
3. **Implement Changes**: Make only the requested modifications
4. **Validate**: Ensure no existing functionality breaks

### Database Migration Template

**Usage**: When database changes are needed.

**AI Instructions**: Always follow this pattern for database changes.

#### Steps:
1. **Review Impact**: What tables/functions will be affected?
2. **Design Migration**: Plan the SQL changes carefully
3. **Present Migration**: Use `lov-sql` block, wait for approval
4. **Update Types**: Ensure TypeScript types match new schema
5. **Update Components**: Modify affected components to use new schema

### Component Creation Template

**Usage**: When creating new UI components.

**AI Instructions**: Follow this pattern to maintain consistency.

#### Requirements:
- **Size Limit**: 50 lines or less per file
- **Single Responsibility**: One clear purpose per component
- **Mobile-First**: Use responsive design patterns
- **Type Safety**: Proper TypeScript with database types
- **Error Handling**: Loading states and error boundaries

#### File Structure:
```
ComponentName.tsx (main component)
hooks/useComponentName.ts (if complex logic needed)
types/componentTypes.ts (if custom types needed)
```

### Testing and Validation Template

**Usage**: For ensuring features work correctly.

**AI Instructions**: Create validation components for complex features.

#### Components to Create:
- **Validation Test Component**: Interactive testing interface
- **Debug Logging**: Console logs for flow tracking
- **Status Indicators**: Visual feedback for current state
- **Error Simulation**: Test error conditions

### Error Debugging Template

**Usage**: When users report errors or bugs.

**AI Instructions**: Follow this systematic debugging approach.

#### Steps:
1. **Reproduce Error**: Understand the exact issue
2. **Isolate Files**: Identify which files might be causing it
3. **Review Code**: Examine relevant code sections
4. **Add Debug Logs**: Insert console.log statements for tracking
5. **Test Fix**: Implement and verify the solution
6. **Clean Up**: Remove debug logs after fixing

### Performance Optimization Template

**Usage**: When performance improvements are needed.

**AI Instructions**: Use this for optimization requests.

#### Areas to Check:
- **Component Memoization**: React.memo(), useMemo(), useCallback()
- **Query Optimization**: Reduce database calls, better caching
- **Bundle Size**: Lazy loading, code splitting
- **Rendering**: Minimize re-renders, optimize state updates

---

## Template Reference Quick Guide

**For Complex Features**: Use Systematic Feature Development Template
**For Simple Changes**: Use Quick Feature Implementation Template
**For Database Work**: Use Database Migration Template
**For New Components**: Use Component Creation Template
**For Bug Fixes**: Use Error Debugging Template
**For Performance**: Use Performance Optimization Template

**How to Reference**: Simply mention the template name in your request:
- "Let's use the systematic development template for batch confirmation"
- "Follow the component creation template for this new feature"
- "Use the debugging template to fix this error"
