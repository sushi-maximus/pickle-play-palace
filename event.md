
# Important Instruction for Lovable.dev
AI, you are breaking my site when you are making changes I didn't ask for. Please read this file and follow it.

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

When UI/UX recommendations specify layout details (e.g., 'card height: ~80px, with 16px padding'), translate them into CSS properties following the mobile-first design guidelines (e.g., height: 80px; padding: 16px;) and include responsive patterns (e.g., md:padding: 20px). If the recommendation is high-level (e.g., 'single-column layout'), implement it as display: flex; flex-direction: column; max-width: 360px; unless instructed otherwise. Always confirm the CSS implementation in the step.

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

## CRITICAL: File Protection Protocol

**BEFORE MODIFYING ANY FILE**, you MUST:

1. **Check the locked files list below** - if a file is locked, you CANNOT modify it under any circumstances
2. **Request explicit permission** if you need to modify a locked file
3. **Analyze file impact** - determine if your change might affect locked files
4. **Prevent rollback scenarios** - avoid changes that could force the user to lose work

### LOCKED FILES LIST

**CORE PAGES (LOCKED):**
- `src/pages/Dashboard.tsx`
- `src/pages/Groups.tsx`
- `src/pages/Index.tsx`
- `src/pages/Login.tsx`
- `src/pages/Signup.tsx`
- `src/pages/Profile.tsx`
- `src/pages/Admin.tsx`
- `src/pages/Contact.tsx`
- `src/pages/Privacy.tsx`
- `src/pages/NotFound.tsx`
- `src/pages/ForgotPassword.tsx`
- `src/pages/AuthCallback.tsx`
- `src/pages/EventDetailsPage.tsx`
- `src/pages/GroupDetails.tsx`

**CRITICAL COMPONENTS (LOCKED):**
- All files in `src/components/groups/ui/`
- All files in `src/components/groups/mobile/`
- All files in `src/components/groups/posts/`
- All files in `src/components/groups/events/`
- All files in `src/components/groups/details/`
- All files in `src/components/navigation/`
- All files in `src/components/layout/`
- `src/components/groups/SearchFilter.tsx`

**HOOKS AND UTILITIES (LOCKED):**
- All files in `src/components/groups/hooks/`
- All files in `src/components/groups/utils/`
- All files in `src/components/groups/services/`
- All files in `src/hooks/`

**TYPE DEFINITIONS (LOCKED):**
- All files ending in `/types.ts` or `/types/`
- All files ending in `/index.ts`

### FILE PROTECTION RULES:

1. **ABSOLUTE PROHIBITION**: Never modify locked files without explicit user permission
2. **IMPACT ANALYSIS**: Before ANY change, verify it won't affect locked files
3. **PERMISSION REQUEST**: If locked file modification is needed, ask user to unlock specific files first
4. **ROLLBACK PREVENTION**: Avoid changes that could cascade into locked file dependencies

### UNLOCKING PROCESS:

When user wants to work on a locked file:
1. User must explicitly say: "Unlock [filename] for editing"
2. AI confirms which file is being unlocked
3. AI removes the file from the locked list
4. Work proceeds with normal change protocols
5. When work is complete, AI asks if file should be locked again

### VIOLATION CONSEQUENCES:

If you modify a locked file without permission:
- User loses work and must rollback
- Trust is broken
- Development velocity is severely impacted

**REMEMBER: The locked files list is your safety net to prevent rollbacks and lost work.**

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

## MANDATORY TRANSPARENCY RULE

**AT THE END OF EVERY MESSAGE**, you MUST include a transparency statement that clearly indicates:

1. **What was specifically requested by the user**
2. **What changes you made that were explicitly requested**
3. **Any additional changes you made that were NOT explicitly requested** (if any)
4. **Confirmation that you made NO unrequested changes** (if true)

**Format for transparency statement:**
```
---
**TRANSPARENCY REPORT:**
- **User requested:** [exact description of what user asked for]
- **Changes made as requested:** [list of specific changes that matched the request]
- **Additional unrequested changes:** [list any changes you made beyond the request, OR state "NONE"]
- **Unrequested changes confirmation:** [YES - I made changes beyond the request / NO - I only made requested changes]
---
```

**This transparency statement is MANDATORY and must appear at the end of EVERY message where code changes are made.**

IMPORTANT: rules.md is 725 lines long. If you make any modifications to it, let the user know that it's getting too long and that they should consider asking you to refactor it after you're done with the lov-code block.

# Pickle Ninja Implementation Prompt: Player Registration and Initial Ranking - Step 4 (Reorganization, Admin Reordering, and Initial Ranking)

## Overview
This file is Step 4 of the implementation guide for the player registration and initial ranking functionality of the "Pickle Ninja" app. It focuses on reorganizing confirmed players based on rankings, allowing admins to manually reorder players, and setting initial rankings for new events. This step assumes the Calendar Page (Step 1), registration process with the Event Details Page (Step 2), and User Dashboard (Step 3) are implemented. Subsequent steps will cover Supabase table designs, functions, and enhanced features. This step is designed to be small and testable to ensure compatibility with Lovable.dev.

**Current Date/Time**: 01:21 AM MST, May 29, 2025  
**Module 1 Status**: Group functionality (e.g., creating groups like "Pickle Pros," ID 456) is already implemented.  
**Module 2 Status**: Event Creation Wizard creates events within a group (e.g., "Week 1 Ladder Matchup," ID 789), the Calendar Page (Step 1) displays events, players can register via the Event Details Page (Step 2), and the User Dashboard (Step 3) shows registered events.  
**Functionality (This Step)**: Implements logic for reorganizing confirmed players based on rankings, allows admins to manually reorder players, and sets initial rankings for new events.

## Mobile-First UI/UX Design Principles (Lovable.dev Guidelines)
This step includes UI updates to the Event Details Page (from Step 2) to allow admins to reorder players. The following principles ensure alignment with Lovable.dev's mobile-first requirements:
1. **Single-Column Layout**: Updates maintain the single-column layout (max 360px viewport).
2. **Large Touch Targets**: Buttons (e.g., "Reorder Players") are at least 48x48 pixels.
3. **Minimal Content per Screen**: Add minimal UI elements to avoid clutter.
4. **Sticky Navigation**: Maintain sticky headers/footers for navigation.
5. **Clear Progress Indicators**: Not applicable (used in multi-step processes).
6. **Optimized Interactions**: Support fast backend responses for reordering actions.
7. **Haptic Feedback**: Add haptic feedback (`navigator.vibrate(200)`) for admin actions.
8. **Responsive Typography**: Use 16px font size for new UI elements, scaling to 20px for headings.
9. **Error Handling**: Show inline error messages in red (e.g., "Failed to reorder players").
10. **Onboarding Tooltips**: Add tooltips for new features (e.g., "Drag to reorder players").

## Database Tables
This section defines the database tables required for reorganization, admin reordering, and initial ranking: `player_status`, `groups`, `group_members`, `events`, and `auth.users`. These tables are referenced from previous steps (e.g., Step 2, File 2b; Step 3, File 2c) but are redefined here for self-containment.

### 1. `player_status` Table (Defined in Step 2)
- **Purpose**: Tracks the participation status of players for each event, including registration, confirmation, waitlist, and ranking order.
- **Table Design**:
  | Field Name          | Data Type   | Constraints/Description                                      |
  |---------------------|-------------|-------------------------------------------------------------|
  | `player_id`         | UUID        | Foreign Key (`profiles.id`), NOT NULL, part of composite key |
  | `event_id`          | UUID        | Foreign Key (`events.id`), NOT NULL, part of composite key |
  | `status`            | TEXT        | NOT NULL, ENUM: "confirmed", "waitlist", "absent", "substituted" |
  | `substitute_id`     | UUID        | Foreign Key (`profiles.id`), NULLABLE                      |
  | `registration_timestamp` | TIMESTAMPTZ | NOT NULL, default CURRENT_TIMESTAMP                   |
  | `ranking_order`     | INTEGER     | NOT NULL, default 0                                         |
  | `created_at`        | TIMESTAMPTZ | NOT NULL, default CURRENT_TIMESTAMP                        |
- **Usage**:
  - The `ranking_order` field is updated by the `reorganize_confirmed_players` and `reorder_players` procedures to reflect the new ranking order.
- **Example Entry**:
  | `player_id`        | `event_id`        | `status`      | `substitute_id` | `registration_timestamp` | `ranking_order` | `created_at`              |
  |--------------------|-------------------|---------------|-----------------|--------------------------|-----------------|---------------------------|
  | `111e2223-e89b-12d3-a456-426614174000` | `789e0123-e89b-12d3-a456-426614174000` | "confirmed"   | NULL            | "2025-05-27T16:54:00Z"   | 1               | "2025-05-27T16:54:00Z"    |
- **Indexing Recommendations**:
  - Index on `event_id` for efficient retrieval of player statuses for an event.
  - Index on `player_id` for efficient retrieval of a player's status across events.
  - Index on `status` for efficient filtering of confirmed vs. waitlist players.

### 2. `groups` Table (Defined in Step 1)
- **Purpose**: Stores groups, which serve as containers for events and membership tracking.
- **Table Design**:
  | Field Name       | Data Type   | Constraints/Description                                      |
  |------------------|-------------|-------------------------------------------------------------|
  | `id`             | UUID        | Primary Key, auto-generated                                 |
  | `group_name`     | TEXT        | NOT NULL, max 100 chars                                     |
  | `description`    | TEXT        | NOT NULL                                                    |
  | `location`       | TEXT        | NOT NULL                                                    |
  | `organizer_id`   | UUID        | Foreign Key (`auth.users.id`), NOT NULL                    |
  | `member_count`   | INTEGER     | NOT NULL, default 0                                         |
  | `created_at`     | TIMESTAMPTZ | NOT NULL, default CURRENT_TIMESTAMP                        |
- **Usage**:
  - Used to validate group membership for admin actions (e.g., reordering players).
- **Example Entry**:
  | `id`               | `group_name`   | `description`           | `location`   | `organizer_id`    | `member_count` | `created_at`              |
  |--------------------|----------------|-------------------------|--------------|-------------------|----------------|---------------------------|
  | `456e7890-e89b-12d3-a456-426614174000` | "Pickle Pros" | "Local pickleball community" | "Denver, CO" | `123e4567-e89b-12d3-a456-426614174000` | 5              | "2025-05-27T16:54:00Z"    |
- **Indexing Recommendations**:
  - Index on `organizer_id` for efficient retrieval of groups by organizer.
  - Index on `created_at` for sorting and filtering by creation date.

### 3. Custom Enum Types (Defined in Step 1)
- **Type: `group_member_role`**:
  ```sql
  CREATE TYPE public.group_member_role AS ENUM ('member', 'organizer', 'admin');
  ```
- **Type: `group_member_status`**:
  ```sql
  CREATE TYPE public.group_member_status AS ENUM ('active', 'pending', 'invited');
  ```

### 4. `group_members` Table (Defined in Step 1)
- **Purpose**: Tracks membership of users in groups, ensuring only admins can perform reordering actions.
- **Table Design**:
  | Field Name      | Data Type   | Constraints/Description                                      |
  |-----------------|-------------|-------------------------------------------------------------|
  | `id`            | UUID        | Primary Key, default gen_random_uuid()                      |
  | `group_id`      | UUID        | Foreign Key (`groups.id`), NOT NULL, part of unique key    |
  | `user_id`       | UUID        | Foreign Key (`auth.users.id`), NOT NULL, part of unique key |
  | `role`          | public.group_member_role | NOT NULL, default 'member'                    |
  | `status`        | public.group_member_status | NOT NULL, default 'active'                  |
  | `joined_at`     | TIMESTAMPTZ | NOT NULL, default CURRENT_TIMESTAMP                        |
  | `request_message` | TEXT      | NULLABLE                                                    |
- **Usage**:
  - Validates that a user is part of the group with `role: 'admin'` and `status: 'active'` before allowing reordering actions.
- **Example Entry**:
  | `id`               | `group_id`        | `user_id`         | `role`      | `status`   | `joined_at`               | `request_message`   |
  |--------------------|-------------------|-------------------|-------------|------------|---------------------------|---------------------|
  | `999e8888-e89b-12d3-a456-426614174000` | `456e7890-e89b-12d3-a456-426614174000` | `123e4567-e89b-12d3-a456-426614174000` | "admin"     | "active"   | "2025-05-27T16:54:00Z"    | NULL                |
- **Indexing Recommendations**:
  - Index on `group_id` for efficient retrieval of members in a group.
  - Index on `user_id` for efficient retrieval of groups a user belongs to.

### 5. `events` Table (Defined in Step 1)
- **Purpose**: Stores individual events, providing the event details for reordering players.
- **Table Design**:
  | Field Name       | Data Type   | Constraints/Description                                      |
  |------------------|-------------|-------------------------------------------------------------|
  | `id`             | UUID        | Primary Key, auto-generated                                 |
  | `group_id`       | UUID        | Foreign Key (`groups.id`), NOT NULL                        |
  | `event_title`    | TEXT        | NOT NULL, max 100 chars                                     |
  | `description`    | TEXT        | NOT NULL                                                    |
  | `event_date`     | DATE        | NOT NULL                                                    |
  | `event_time`     | TIME        | NOT NULL                                                    |
  | `location`       | TEXT        | NOT NULL                                                    |
  | `registration_open` | BOOLEAN  | NOT NULL, default true                                     |
  | `created_at`     | TIMESTAMPTZ | NOT NULL, default CURRENT_TIMESTAMP                        |
- **Usage**:
  - Used to fetch event details for reordering players within an event.
- **Example Entry**:
  | `id`               | `group_id`        | `event_title`    | `description`           | `event_date` | `event_time` | `location`         | `registration_open` | `created_at`              |
  |--------------------|-------------------|------------------|-------------------------|--------------|--------------|--------------------|---------------------|---------------------------|
  | `789e0123-e89b-12d3-a456-426614174000` | `456e7890-e89b-12d3-a456-426614174000` | "Week 1 Ladder Matchup" | "Competitive ladder..." | "2025-05-28" | "18:00"      | "Central Park Courts" | true                | "2025-05-27T16:54:00Z"    |
- **Indexing Recommendations**:
  - Index on `group_id` for efficient retrieval of events within a group.
  - Index on `event_date` and `event_time` for sorting events on the calendar.

### 6. `auth.users` Table (Defined in Step 1)
- **Purpose**: Stores core user authentication data, managed by Supabase Auth.
- **Table Design**:
  | Field Name      | Data Type   | Constraints/Description                                      |
  |-----------------|-------------|-------------------------------------------------------------|
  | `id`            | UUID        | Primary Key, auto-generated                                 |
  | `email`         | TEXT        | NOT NULL, unique                                            |
- **Usage**:
  - Used to authenticate users and fetch their ID for admin validation.
- **Example Entry**:
  | `id`               | `email`             |
  |--------------------|---------------------|
  | `123e4567-e89b-12d3-a456-426614174000` | "admin@example.com" |

## Supabase Stored Procedures

### Stored Procedure: `reorganize_confirmed_players`
-- Purpose: Reorganizes confirmed players for an event based on their skill level and DUPR rating.
-- Usage: Called automatically after registration closes or manually by an admin via a UI button on the Event Details Page.
-- Parameters:
--   p_event_id (UUID): The ID of the event to reorganize players for.
--   p_admin_id (UUID): The ID of the admin performing the action.
-- Returns: None (procedure; updates the `player_status` table).
-- Example Call: CALL reorganize_confirmed_players('789e0123-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000');
CREATE OR REPLACE PROCEDURE reorganize_confirmed_players(p_event_id UUID, p_admin_id UUID)
LANGUAGE plpgsql
AS $$
DECLARE
    v_group_id UUID;
    v_is_admin BOOLEAN;
    player_record RECORD;
    rank_counter INTEGER := 1;
BEGIN
    -- Get event details
    SELECT group_id
    INTO v_group_id
    FROM events
    WHERE id = p_event_id;

    -- Check if user is an admin for the group
    SELECT EXISTS (
        SELECT 1 FROM group_members
        WHERE group_id = v_group_id
          AND user_id = p_admin_id
          AND role = 'admin'
          AND status = 'active'
    ) INTO v_is_admin;

    IF NOT v_is_admin THEN
        RAISE EXCEPTION 'User % is not an admin for the group of event %.', p_admin_id, p_event_id;
    END IF;

    -- Reset ranking order for confirmed players
    UPDATE player_status
    SET ranking_order = 0
    WHERE event_id = p_event_id AND status = 'confirmed';

    -- Reorganize players based on skill level and DUPR rating
    FOR player_record IN (
        SELECT ps.player_id
        FROM player_status ps
        JOIN profiles p ON ps.player_id = p.id
        WHERE ps.event_id = p_event_id AND ps.status = 'confirmed'
        ORDER BY p.skill_level DESC, p.dupr_rating DESC NULLS LAST
    )
    LOOP
        UPDATE player_status
        SET ranking_order = rank_counter
        WHERE event_id = p_event_id AND player_id = player_record.player_id;
        rank_counter := rank_counter + 1;
    END LOOP;
END;
$$;

### Stored Procedure: `reorder_players`
-- Purpose: Allows an admin to manually reorder confirmed players for an event.
-- Usage: Called via a UI button on the Event Details Page after the admin reorders players.
-- Parameters:
--   p_event_id (UUID): The ID of the event to reorder players for.
--   p_admin_id (UUID): The ID of the admin performing the action.
--   p_player_ids (UUID[]): Array of player IDs in the new order.
-- Returns: None (procedure; updates the `player_status` table).
-- Example Call: CALL reorder_players('789e0123-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174000', ARRAY['111e2223-e89b-12d3-a456-426614174000', ...]);
CREATE OR REPLACE PROCEDURE reorder_players(p_event_id UUID, p_admin_id UUID, p_player_ids UUID[])
LANGUAGE plpgsql
AS $$
DECLARE
    v_group_id UUID;
    v_is_admin BOOLEAN;
    v_rank_counter INTEGER := 1;
    v_player_id UUID;
BEGIN
    -- Get event details
    SELECT group_id
    INTO v_group_id
    FROM events
    WHERE id = p_event_id;

    -- Check if user is an admin for the group
    SELECT EXISTS (
        SELECT 1 FROM group_members
        WHERE group_id = v_group_id
          AND user_id = p_admin_id
          AND role = 'admin'
          AND status = 'active'
    ) INTO v_is_admin;

    IF NOT v_is_admin THEN
        RAISE EXCEPTION 'User % is not an admin for the group of event %.', p_admin_id, p_event_id;
    END IF;

    -- Verify all player IDs are confirmed for the event
    FOR v_player_id IN SELECT unnest(p_player_ids)
    LOOP
        IF NOT EXISTS (
            SELECT 1 FROM player_status
            WHERE event_id = p_event_id
              AND player_id = v_player_id
              AND status = 'confirmed'
        ) THEN
            RAISE EXCEPTION 'Player % is not confirmed for event %.', v_player_id, p_event_id;
        END IF;
    END LOOP;

    -- Reset ranking order for confirmed players
    UPDATE player_status
    SET ranking_order = 0
    WHERE event_id = p_event_id AND status = 'confirmed';

    -- Apply new ranking order based on the provided player IDs
    FOREACH v_player_id IN ARRAY p_player_ids
    LOOP
        UPDATE player_status
        SET ranking_order = v_rank_counter
        WHERE event_id = p_event_id AND player_id = v_player_id;
        v_rank_counter := v_rank_counter + 1;
    END LOOP;
END;
$$;

### Stored Procedure: `set_initial_rankings`
-- Purpose: Sets initial rankings for players when an event is created, based on registration order.
-- Usage: Called automatically after an event is created or when the first player registers.
-- Parameters:
--   p_event_id (UUID): The ID of the event to set initial rankings for.
-- Returns: None (procedure; updates the `player_status` table).
-- Example Call: CALL set_initial_rankings('789e0123-e89b-12d3-a456-426614174000');
CREATE OR REPLACE PROCEDURE set_initial_rankings(p_event_id UUID)
LANGUAGE plpgsql
AS $$
DECLARE
    rank_counter INTEGER := 1;
    player_record RECORD;
BEGIN
    -- Reset ranking order for all players in the event
    UPDATE player_status
    SET ranking_order = 0
    WHERE event_id = p_event_id;

    -- Set initial rankings based on registration timestamp
    FOR player_record IN (
        SELECT player_id
        FROM player_status
        WHERE event_id = p_event_id
        ORDER BY registration_timestamp
    )
    LOOP
        UPDATE player_status
        SET ranking_order = rank_counter
        WHERE event_id = p_event_id AND player_id = player_record.player_id;
        rank_counter := rank_counter + 1;
    END LOOP;
END;
$$;

## Updated Event Details Page (Enhances Step 2, File 2b)
The Event Details Page (from Step 2) is updated to support admin reordering of players.

- **Functionality Updates**:
  - **Reorder Players Button** (Admin Only):
    - Visible to users with `role: 'admin'` in `group_members`.
    - Allows admins to reorder confirmed players by dragging and dropping player cards.
    - Calls the `reorder_players` stored procedure with the new order.
  - **Reorganize Players Button** (Admin Only):
    - Visible to users with `role: 'admin'` in `group_members`.
    - Automatically reorganizes players based on skill level and DUPR rating.
    - Calls the `reorganize_confirmed_players` stored procedure.
  - **Ranking Display**:
    - Show the `ranking_order` in the "Confirmed Players" tab for each player (e.g., "Rank: 1").

- **Query Example for Confirmed Players (Updated)**:
  ```sql
  SELECT 
      ps.player_id,
      p.first_name,
      p.last_name,
      p.dupr_rating,
      p.skill_level,
      ps.ranking_order
  FROM player_status ps
  JOIN profiles p ON ps.player_id = p.id
  WHERE ps.event_id = :event_id
    AND ps.status = 'confirmed'
  ORDER BY ps.ranking_order;
  ```

- **Mobile-First UI/UX Recommendations (Updated)**:
  - **Reorder Players Button** (Admin Only):
    - Add a "Reorder Players" button in the "Confirmed Players" tab for admins, visible only if there are confirmed players.
    - Button size: 48x48px, blue background, with haptic feedback (`navigator.vibrate(200)`).
    - On click, enables drag-and-drop mode for player cards, allowing admins to reorder players.
    - Tooltip: "Drag to reorder players in the list." (dismissible).
  - **Reorganize Players Button** (Admin Only):
    - Add a "Reorganize Players" button in the "Confirmed Players" tab for admins, visible only if there are confirmed players.
    - Button size: 48x48px, green background, with haptic feedback (`navigator.vibrate(200)`).
    - On click, calls `reorganize_confirmed_players` to sort players by skill level and DUPR rating.
    - Tooltip: "Automatically reorganize players based on skill level and DUPR rating." (dismissible).
  - **Ranking Display**:
    - In the "Confirmed Players" tab, update player cards to include `ranking_order` (e.g., "Rank: 1") in 16px font size, displayed in green.
    - Ensure player cards are sortable via drag-and-drop when in reordering mode.
