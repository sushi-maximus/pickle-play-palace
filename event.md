
Important Instruction for Lovable.dev
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
**For Testing**: Use Testing and Validation Template  

**How to Reference**: Simply mention the template name in your request:  
- "Let's use the systematic development template for batch confirmation"  
- "Follow the component creation template for this new feature"  
- "Use the debugging template to fix this error"

## Template Trigger System

### Auto-Template Selection

When the user says "template" or "use template", the AI should automatically determine which template to use based on the context and nature of the request:

**Context Analysis for Template Selection:**  
- **Complex new features** (multiple components, database changes, etc.) → Use **Systematic Feature Development Template**  
- **Simple UI changes, styling, single component changes** → Use **Quick Feature Implementation Template**  
- **Database schema changes, migrations, new tables** → Use **Database Migration Template**  
- **Creating new UI components** → Use **Component Creation Template**  
- **Bugs, errors, issues reported** → Use **Error Debugging Template**  
- **Performance complaints, optimization requests** → Use **Performance Optimization Template**  
- **Testing, validation requests** → Use **Testing and Validation Template**

**Decision Process:**  
1. Analyze the user's request context  
2. Determine complexity and scope  
3. Select the most appropriate template  
4. Explicitly state which template is being used  
5. Follow the template methodology  

**Template Usage Format:**  
When a template is triggered, the AI should:  
1. State: "Using [Template Name] for this request"  
2. Follow the template's step-by-step process  
3. Ask for approval between phases when needed (for systematic template)  
4. Maintain the template's quality standards  

**Examples:**  
- "Add batch confirmation logic" + "template" → Systematic Feature Development Template  
- "Fix this button color" + "template" → Quick Feature Implementation Template  
- "This component is broken" + "template" → Error Debugging Template  
- "Create a new notification component" + "template" → Component Creation Template  

This system allows the user to simply say "template" and trust that the appropriate structured approach will be applied based on the work context.

## Multi-Step Progress Tracking

### Progress Communication
When using templates with multiple steps/phases, the AI MUST:

1. **End each message with progress status**: "Step X of Y completed" or "Phase X of Y completed"  
2. **Clearly state what was just finished**: "Just completed: [specific task/phase name]"  
3. **Clearly state what comes next**: "Next: [specific next task/phase name]"

### Action Button System
At the end of each step in a multi-step process, provide an action button using `lov-message-prompt` that includes:

- Reference to the specific template being used
- Current step/phase number
- What should happen next
- All necessary context for continuation

**Action Button Format:**
```xml
<lov-actions>
<lov-message-prompt message="Continue with [Template Name] - Phase X of Y. Previous: [what was completed]. Next: [what should happen]. Template reference: rules.md [Template Name]. Context: [brief context needed for next step]">Continue Phase X</lov-message-prompt>
</lov-actions>
```

**Example Usage:**
```xml
<lov-actions>
<lov-message-prompt message="Continue with Systematic Feature Development Template - Phase 3 of 6. Previous: Type System Integration completed. Next: Backend Service Implementation. Template reference: rules.md Systematic Feature Development Template. Context: Database schema approved, types updated.">Continue Phase 3</lov-message-prompt>
</lov-actions>
```

### Progress Status Requirements
- Always show current step number and total steps (e.g., "3/8 steps")
- Use consistent format: "Step X of Y completed" or "Phase X of Y completed"
- Include clear "Just completed" and "Next" statements
- Provide action button for easy continuation

This ensures users can easily track progress through complex implementations and continue work seamlessly by clicking the action button with all necessary context included.

## Error Debugging Action Button System

### When Errors Occur
When the AI encounters or the user reports errors, the AI MUST provide action buttons that reference the appropriate debugging approach from rules.md.

### Error Action Button Categories

**TypeScript/Compilation Errors:**
```xml
<lov-actions>
<lov-message-prompt message="Fix TypeScript compilation error using Error Debugging Template. Template reference: rules.md Error Debugging Template. Error context: [brief error description]. Focus: TypeScript types and compilation issues.">Fix TypeScript Error</lov-message-prompt>
</lov-actions>
```

**Component/React Errors:**
```xml
<lov-actions>
<lov-message-prompt message="Debug React component error using Error Debugging Template. Template reference: rules.md Error Debugging Template. Error context: [brief error description]. Focus: Component lifecycle, hooks, and JSX issues.">Fix Component Error</lov-message-prompt>
</lov-actions>
```

**Build/Import Errors:**
```xml
<lov-actions>
<lov-message-prompt message="Resolve build/import error using Error Debugging Template. Template reference: rules.md Error Debugging Template. Error context: [brief error description]. Focus: Module resolution and dependency issues.">Fix Build Error</lov-message-prompt>
</lov-actions>
```

**Runtime/Logic Errors:**
```xml
<lov-actions>
<lov-message-prompt message="Debug runtime error using Error Debugging Template. Template reference: rules.md Error Debugging Template. Error context: [brief error description]. Focus: Application logic and runtime behavior.">Fix Runtime Error</lov-message-prompt>
</lov-actions>
```

**Database/API Errors:**
```xml
<lov-actions>
<lov-message-prompt message="Fix database/API error using Error Debugging Template. Template reference: rules.md Error Debugging Template. Error context: [brief error description]. Focus: Database queries, API calls, and data handling.">Fix Database Error</lov-message-prompt>
</lov-actions>
```

### Error Action Button Requirements

1. **Always include template reference**: "Template reference: rules.md Error Debugging Template"
2. **Provide error context**: Brief description of the specific error
3. **Specify focus area**: What type of debugging approach is needed
4. **Use descriptive button text**: Clear indication of what the button will do

### Integration with Error Debugging Template

When error action buttons are clicked, the AI will automatically:
1. Reference the Error Debugging Template from rules.md
2. Follow the systematic debugging steps:
   - Reproduce Error
   - Isolate Files
   - Review Code
   - Add Debug Logs
   - Test Fix
   - Clean Up
3. Apply the Change Only What's Requested Protocol
4. Preserve all existing functionality while fixing the specific error

This system ensures consistent, structured error resolution while maintaining code quality and user workflow continuity.

# Pickle Ninja Implementation Prompt: Player Registration and Initial Ranking - Step 3 (User Dashboard and Group Activity Page)

## Overview
This file is Step 3 of the implementation guide for the player registration and initial ranking functionality of the "Pickle Ninja" app. It focuses on the User Dashboard, which serves as the user's home page, and the Group Details - Activity Page, which displays group activities and the next upcoming event. This step assumes the Calendar Page (Step 1) and registration process with the Event Details Page (Step 2) are implemented. Subsequent steps will cover ranking logic, database tables, Supabase functions, and enhanced features. This step is designed to be small and testable to ensure compatibility with Lovable.dev.

**Current Date/Time**: 11:43 AM MST, May 28, 2025  
**Module 1 Status**: Group functionality (e.g., creating groups like "Pickle Pros," ID 456) is already implemented.  
**Module 2 Status**: Event Creation Wizard creates events within a group (e.g., "Week 1 Ladder Matchup," ID 789), the Calendar Page (Step 1) displays events, and players can register via the Event Details Page (Step 2).  
**Functionality (This Step)**: Implements the User Dashboard as the user's home page, showing registered events, and the Group Details - Activity Page, displaying group activities with the next upcoming event at the top.

## Mobile-First UI/UX Design Principles (Lovable.dev Guidelines)
Both the User Dashboard and Group Details - Activity Page are optimized for mobile devices with the following principles to ensure consistency in Lovable.dev:
1. **Single-Column Layout**: Content fits within a 360px viewport, avoiding horizontal scrolling.
2. **Large Touch Targets**: Interactive elements (buttons, cards) have a minimum size of 48x48 pixels.
3. **Minimal Content per Screen**: Prioritize key actions and information to reduce scrolling.
4. **Sticky Navigation**: Sticky headers/footers for consistent navigation (e.g., "Back to Group").
5. **Clear Progress Indicators**: Not applicable in this step (used in multi-step processes).
6. **Optimized Interactions**: Use mobile-friendly gestures (e.g., pull-to-refresh) and input types.
7. **Haptic Feedback**: Light vibration (`navigator.vibrate(200)`) on button presses for tactile confirmation.
8. **Responsive Typography**: Base font size of 16px, headings at 20px, scaling for larger screens.
9. **Error Handling**: Inline error messages in red (e.g., "No events registered") in the main content area.
10. **Onboarding Tooltips**: Dismissible tooltips or first-use modals to guide users, with a "Skip" option.

## Database Tables
This section defines the database tables required for the User Dashboard and Group Details - Activity Page: `player_status`, `groups`, `group_members`, `events`, `auth.users`, and `posts`. These tables are referenced from previous steps (e.g., Step 1, File 2a; Step 2, File 2b) but are redefined here for self-containment.

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
  - Used in the User Dashboard to fetch events the user has registered for, along with their status.
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
  - Used in the Group Details - Activity Page to fetch group details and validate user membership.
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
- **Purpose**: Tracks membership of users in groups, ensuring only group members can access the Group Details - Activity Page.
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
  - Validates that a user is part of the group with `role: 'member'` and `status: 'active'` before allowing access to the Group Details - Activity Page.
- **Example Entry**:
  | `id`               | `group_id`        | `user_id`         | `role`      | `status`   | `joined_at`               | `request_message`   |
  |--------------------|-------------------|-------------------|-------------|------------|---------------------------|---------------------|
  | `999e8888-e89b-12d3-a456-426614174000` | `456e7890-e89b-12d3-a456-426614174000` | `111e2223-e89b-12d3-a456-426614174000` | "member"    | "active"   | "2025-05-27T16:54:00Z"    | NULL                |
- **Indexing Recommendations**:
  - Index on `group_id` for efficient retrieval of members in a group.
  - Index on `user_id` for efficient retrieval of groups a user belongs to.

### 5. `events` Table (Defined in Step 1)
- **Purpose**: Stores individual events, providing the event details for display on the User Dashboard and Group Details - Activity Page.
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
  - Used in the User Dashboard to fetch events the user has registered for.
  - Used in the Group Details - Activity Page to fetch the next upcoming event for the group.
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
  - Used to authenticate users and fetch their ID for the User Dashboard.
- **Example Entry**:
  | `id`               | `email`             |
  |--------------------|---------------------|
  | `111e2223-e89b-12d3-a456-426614174000` | "john.doe@example.com" |

### 7. `posts` Table (Provided by User)
- **Purpose**: Stores posts made by group members on the Group Details - Activity Page, functioning like a Facebook feed.
- **Table Design**:
  ```sql
  CREATE TABLE public.posts (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    media_urls TEXT[] NULL,
    pinned BOOLEAN NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT posts_pkey PRIMARY KEY (id),
    CONSTRAINT posts_group_id_fkey FOREIGN KEY (group_id) REFERENCES groups (id) ON DELETE CASCADE
  ) TABLESPACE pg_default;

  CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
  ```
- **Relationships**:
  - Foreign Key: `group_id` references `groups(id)`, `user_id` references `auth.users(id)`.
- **Usage**:
  - Stores posts for the activity feed on the Group Details - Activity Page.
  - `media_urls` stores an array of URLs for media attachments (e.g., images, videos).
  - `pinned` allows marking posts to display at the top of the feed.
  - The `update_posts_updated_at` trigger ensures the `updated_at` column reflects the latest modification time.
- **Example Entry**:
  | `id`               | `group_id`        | `user_id`         | `content`                    | `media_urls`                          | `pinned` | `created_at`              | `updated_at`              |
  |--------------------|-------------------|-------------------|------------------------------|---------------------------------------|----------|---------------------------|---------------------------|
  | `555e6667-e89b-12d3-a456-426614174000` | `456e7890-e89b-12d3-a456-426614174000` | `111e2223-e89b-12d3-a456-426614174000` | "Excited for the next match!" | {"https://example.com/image.jpg"} | false    | "2025-05-28T09:26:00Z"    | "2025-05-28T09:26:00Z"    |
- **Indexing Recommendations**:
  - Index on `group_id` for efficient retrieval of posts for a group.
  - Index on `created_at` for sorting posts in the activity feed.
  - Index on `pinned` for efficient filtering of pinned posts.

## User Dashboard (User Home Page)
- **Access**: The User Dashboard serves as the user's home page, the default landing page after login. It is accessible to all authenticated users via the root route (e.g., `/dashboard`).
- **Functionality**:
  - Displays a list of events the user has registered for, including event details (`event_title`, `event_date`, `event_time`, `location`) and their registration status (`status` from `player_status`).
  - Clicking an event navigates to the Event Details page (implemented in Step 2).
- **Query Example**:
  ```sql
  SELECT 
      e.id,
      e.event_title,
      e.event_date,
      e.event_time,
      e.location,
      ps.status
  FROM player_status ps
  JOIN events e ON ps.event_id = e.id
  WHERE ps.player_id = :user_id
    AND e.event_date >= CURRENT_DATE
  ORDER BY e.event_date, e.event_time;
  ```
- **Mobile-First UI/UX Recommendations**:
  - **Routing**: Set the User Dashboard as the default route (`/dashboard`) in `AppRouter.tsx`, ensuring it's the landing page after login.
  - **Layout**: Single-column layout with a sticky header showing the app name ("Pickle Ninja") and a sticky footer with navigation (e.g., "Groups", "Dashboard", "Profile"). The dashboard view occupies the full viewport width (e.g., 360px).
  - **Event List View**: Display events as cards in chronological order (sorted by `event_date` and `event_time`).
    - Each event card shows: Title (e.g., "Week 1 Ladder Matchup"), Date (e.g., "May 28, 2025"), Time (e.g., "18:00"), Location (e.g., "Central Park Courts"), and Status (e.g., "Confirmed" in green; "Waitlisted" in orange).
    - Card height: ~80px, with 16px padding, 16px font size, and a subtle border (1px solid #ddd).
    - Add a "Next Event" badge (e.g., green dot) for the nearest upcoming event after 2025-05-28 11:43 AM MST.
  - **Interaction**: Tapping an event card navigates to the Event Details page (Step 2). Cards are touch-friendly with a 48px touch target (entire card tappable).
  - **Onboarding**: Tooltip on first load: "This is your home page! View your registered events here. Tap an event to see details." (dismissible with "Don't Show Again").
  - **Pull-to-Refresh**: Implement a pull-to-refresh gesture to reload events, ensuring real-time updates (e.g., if `status` changes).
  - **Error Handling**: If no events are found, display a centered message: "No upcoming events. Check out groups to join events!" with 16px font size, linking to the Groups page.

## Group Details - Activity Page
- **Access**: Accessible to group members (with `role: 'member'` and `status: 'active'` in `group_members`) via a route like `/groups/:group_id/activity`. Navigated to from the Groups page or navigation menu.
- **Functionality**:
  - Displays group activities in a feed-like format (similar to a Facebook feed), including posts made by group members.
  - Shows the next upcoming event for the group at the top, below the "Add Post Card".
  - **Next Event Display**:
    - Fetches the nearest upcoming event for the group (`group_id: 456`) after the current date and time.
    - Displays event details: `event_title`, `event_date`, `event_time`, `location`, and `registration_open` status.
    - Includes a "View Details" button linking to the Event Details page (Step 2).
  - **Activity Feed**:
    - Displays posts from the `posts` table, prioritizing pinned posts (`pinned = true`) at the top, followed by other posts in reverse chronological order.
    - Includes an "Add Post Card" at the top for users to create new posts, supporting text and media uploads.
- **Query Example for Next Event**:
  ```sql
  SELECT 
      e.id,
      e.event_title,
      e.event_date,
      e.event_time,
      e.location,
      e.registration_open
  FROM events e
  WHERE e.group_id = :group_id
    AND e.event_date >= CURRENT_DATE
    AND (e.event_date > CURRENT_DATE OR (e.event_date = CURRENT_DATE AND e.event_time >= CURRENT_TIME))
  ORDER BY e.event_date, e.event_time
  LIMIT 1;
  ```
- **Query Example for Activity Feed**:
  ```sql
  SELECT 
      p.id,
      p.content,
      p.media_urls,
      p.pinned,
      p.created_at,
      p.updated_at,
      u.email AS user_email
  FROM posts p
  JOIN auth.users u ON p.user_id = u.id
  WHERE p.group_id = :group_id
  ORDER BY p.pinned DESC, p.created_at DESC
  LIMIT 20;
  ```
- **Mobile-First UI/UX Recommendations**:
  - **Layout**: Single-column layout with a sticky header showing the group name ("Pickle Pros") and a sticky footer with navigation (e.g., "Back", "Activity", "Events"). The activity feed occupies the full viewport width (e.g., 360px).
  - **Add Post Card**:
    - Positioned at the top of the feed.
    - A text input field with a placeholder: "Share something with the group..." (16px font size).
    - A media upload button (48x48px, icon of a camera) to attach images/videos, storing URLs in `media_urls`.
    - A "Post" button (48x48px, green background) to submit the post, with haptic feedback (`navigator.vibrate(200)`).
    - Card height: ~80px, with 16px padding and a subtle border (1px solid #ddd).
  - **Next Event Section** (Below Add Post Card):
    - **Position**: Place immediately below the "Add Post Card" at the top of the feed.
    - **Display**: Show as a card with a "Next Event" badge (e.g., green dot or label).
      - Card details: Title (e.g., "Week 1 Ladder Matchup"), Date (e.g., "May 28, 2025"), Time (e.g., "18:00"), Location (e.g., "Central Park Courts"), and Status (e.g., "Registration Open" in green; "Closed" in red).
      - Card height: ~80px, with 16px padding, 16px font size, and a subtle border (1px solid #ddd).
    - **Interaction**: Include a "View Details" button (48x48px, green background) on the right side of the card, linking to the Event Details page (`/events/:event_id`).
    - **Error Handling**: If no upcoming events are found, display a message: "No upcoming events. Check the calendar for more!" with a link to the Calendar Page (Step 1).
  - **Activity Feed**:
    - Display posts as cards below the "Next Event" section, with pinned posts at the top, followed by others in reverse chronological order.
    - Each post card shows:
      - User email (e.g., "john.doe@example.com") in 16px font size.
      - Content (e.g., "Excited for the next match!") in 16px font size.
      - Media: If `media_urls` is not empty, display the first media item as a thumbnail (e.g., 100x100px image) below the content. If multiple URLs exist, add a "View More Media" link (16px font size, blue) to expand additional media (future step).
      - Timestamp: Show `updated_at` if different from `created_at` (e.g., "Edited: May 28, 2025, 09:26 AM"), otherwise show `created_at` (e.g., "Posted: May 28, 2025, 09:26 AM"), in 14px font size, gray.
    - Card height: ~100px (adjusts based on media), with 16px padding and a subtle border (1px solid #ddd).
    - **Interaction**: Cards are read-only (no editing/deleting in this step). Tapping a card could navigate to a post details page (future step).
    - **Pull-to-Refresh**: Implement a pull-to-refresh gesture to reload posts and the next event.
    - **Error Handling**: If no posts are found, display a centered message: "No posts yet. Be the first to share something!" with 16px font size.
  - **Onboarding**: Tooltip on first load: "This is your group's activity feed. See the next event and share updates with the group!" (dismissible with "Don't Show Again").

## Comments and Recommendations

- **User Dashboard (Home Page)**:
  - **Recommendation 1: Add Upcoming Group Events Section**:
    - Consider adding a section below the registered events list to show upcoming events for all groups the user is part of, even if they haven't registered. This can encourage engagement by prompting users to register for events they might have missed.
    - Example Query:
      ```sql
      SELECT 
          e.id,
          e.event_title,
          e.event_date,
          e.event_time,
          e.location,
          g.group_name
      FROM events e
      JOIN groups g ON e.group_id = g.id
      JOIN group_members gm ON g.id = gm.group_id
      WHERE gm.user_id = :user_id
        AND gm.status = 'active'
        AND e.event_date >= CURRENT_DATE
        AND e.id NOT IN (SELECT event_id FROM player_status WHERE player_id = :user_id)
      ORDER BY e.event_date, e.event_time
      LIMIT 5;
      ```
    - Display as a separate section titled "Upcoming Group Events" with cards similar to the registered events list, including a "Register" button linking to the Event Details page.

  - **Recommendation 2: Personalized Welcome Message**:
    - Add a personalized welcome message at the top of the User Dashboard (e.g., "Welcome back, John!"), fetching the user's `first_name` from the `profiles` table (defined in Step 2). This enhances user engagement by making the home page feel more tailored.

- **Group Details - Activity Page**:
  - **Recommendation 1: Infinite Scroll for Activity Feed**:
    - Instead of limiting the feed to 20 posts, implement infinite scroll to load more posts as the user scrolls down. This improves the user experience by allowing seamless browsing of group activities.
    - Use a pagination approach in the query:
      ```sql
      SELECT 
          p.id,
          p.content,
          p.media_urls,
          p.pinned,
          p.created_at,
          p.updated_at,
          u.email AS user_email
      FROM posts p
      JOIN auth.users u ON p.user_id = u.id
      WHERE p.group_id = :group_id
        AND p.created_at < :last_timestamp
      ORDER BY p.pinned DESC, p.created_at DESC
      LIMIT 20;
      ```
    - Fetch the next batch when the user reaches the bottom of the feed, updating the `last_timestamp` parameter.

  - **Recommendation 2: Highlight User's Posts**:
    - Highlight posts made by the logged-in user with a light green background (`#e6ffe6`) to make their contributions stand out in the feed. This can increase engagement by giving users a sense of ownership over their posts.

  - **Recommendation 3: Event Registration Prompt**:
    - If the "Next Event" has `registration_open = true` and the user hasn't registered, add a "Register Now" button alongside "View Details" on the event card. This encourages users to register directly from the activity page, reducing friction.

  - **Recommendation 4: Media Previews**:
    - For posts with `media_urls`, consider using a lightbox or modal to preview all media items when the user taps "View More Media". This provides a better experience for viewing images/videos without navigating away from the feed.

- **General Recommendation: Performance Optimization**:
  - **Cache Queries**: Use Supabase's caching capabilities (e.g., `pg_bouncer` for connection pooling) to cache frequently accessed data like the next event and recent posts. This reduces database load and improves page load times, especially for the Group Details - Activity Page, which may have high traffic.
  - **Preload Data**: Use `OptimizedNavLink` (as per the `rules.md`) to preload the next event and initial batch of posts when the user hovers over or focuses on the "Activity" navigation link, ensuring a faster initial load.
