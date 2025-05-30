
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

**CRITICAL: Toast Usage Rule - ALWAYS FOLLOW THIS**

Toast notifications MUST follow this exact pattern to prevent errors:

**CORRECT IMPORT (ALWAYS USE THIS):**
```typescript
import { toast } from "sonner";
```

**FORBIDDEN IMPORTS (NEVER USE THESE):**
```typescript
// NEVER use these imports:
import { toast } from "@/hooks/use-toast";
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/components/ui/use-toast";
```

**CORRECT USAGE (STRING PARAMETERS ONLY):**
```typescript
// ✅ CORRECT - Use string parameters only
toast.success("Event updated successfully");
toast.error("Failed to update the event. Please try again.");
toast.info("Processing your request...");
toast.warning("This action cannot be undone");
```

**FORBIDDEN USAGE (NEVER USE OBJECTS):**
```typescript
// ❌ NEVER use object parameters:
toast({
  title: "Event updated",
  description: "The event has been successfully updated.",
});

toast({
  title: "Error",
  description: "Something went wrong",
  variant: "destructive",
});
```

**WHY THIS RULE EXISTS:**
- Sonner toast expects string parameters
- Shadcn toast expects object parameters
- Mixing these causes runtime errors
- This codebase uses Sonner exclusively

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

## CRITICAL: MANDATORY CODE VERIFICATION AND HONESTY PROTOCOL

**BEFORE CLAIMING ANY CHANGES ARE MADE:**

1. **MANDATORY FILE VERIFICATION**: Use `lov-view` to actually examine ALL files that you claim to have modified
2. **VERIFY ACTUAL CHANGES**: Check that the changes you claimed to make actually exist in the code
3. **NO FALSE CLAIMS**: NEVER say "I updated X" without first verifying the file actually contains your claimed changes
4. **ADMIT WHEN WRONG**: If you discover you didn't actually make the changes you claimed, immediately admit the error

**ABSOLUTE HONESTY REQUIREMENT:**
- If you haven't actually checked a file, say "I need to verify this file first"
- If you find you were wrong about previous changes, say "I was incorrect - the file still contains [old code]"
- NEVER make assumptions about file contents without verification
- NEVER claim work is done without proving it through file examination

**SHARED UTILITIES ENFORCEMENT:**
- When working with dates, ALWAYS use utilities from `@/utils/dateUtils`
- NEVER use `new Date()` constructor directly for date parsing - it causes timezone issues
- ALWAYS use `formatDateForDisplay()` for consistent date formatting
- Before implementing date handling, verify existing utilities and use them

**CONSISTENCY VERIFICATION PROTOCOL:**
1. **Identify all files** that handle the same data type (e.g., dates, user profiles, etc.)
2. **Check each file** to ensure they use the same shared utilities
3. **Report inconsistencies** and fix them systematically
4. **Test consistency** by verifying the same data shows identically across different components

**EXAMPLES OF FORBIDDEN BEHAVIOR:**
- Saying "I updated EventDetailsTab.tsx to use formatDateForDisplay" without actually checking the file
- Claiming "Both components now use the same date utility" without verifying both files
- Making assumptions about what utilities a file imports without looking
- Apologizing for errors while continuing to make the same errors

**CONSEQUENCES FOR VIOLATIONS:**
- These rules exist because previous violations wasted user time and credits
- Following these rules is mandatory, not optional
- Verification is required, not suggested

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
- All files in `src/components/auth/`
- All files in `src/components/dashboard/`
- All files in `src/components/error-boundaries/`
- All files in `src/components/groups/forms/`
- All files in `src/components/groups/header/`
- All files in `src/components/groups/join-requests/`
- All files in `src/components/groups/members/`
- All files in `src/components/groups/services/`
- All files in `src/components/groups/settings/`
- All files in `src/components/groups/simple/`
- All files in `src/components/groups/utils/`
- All files in `src/components/landing/`
- All files in `src/components/loading/`
- All files in `src/components/performance/`
- All files in `src/components/profile/`
- All files in `src/components/routing/`
- All files in `src/components/ui/`
- `src/components/groups/SearchFilter.tsx`
- `src/components/groups/CreateGroupDialog.tsx`
- `src/components/groups/GroupAboutTab.tsx`
- `src/components/groups/GroupDetailsHeader.tsx`
- `src/components/groups/GroupDetailsLoading.tsx`
- `src/components/groups/GroupSettingsTab.tsx`
- `src/components/groups/GroupsList.tsx`
- `src/components/groups/JoinRequestDialog.tsx`
- `src/components/groups/JoinRequestsManager.tsx`
- `src/components/groups/LoginPrompt.tsx`
- `src/components/groups/MyGroupsList.tsx`

**EVENT SYSTEM (LOCKED):**
- `src/components/groups/events/CreateEventButton.tsx`
- `src/components/groups/events/EventCard.tsx`
- `src/components/groups/events/EventCreationWizard.tsx`
- `src/components/groups/events/EventDetailsPage.tsx`
- `src/components/groups/events/EventsList.tsx`
- `src/components/groups/events/StepIndicator.tsx`
- `src/components/groups/events/TabbedEventsList.tsx`
- `src/components/groups/events/WizardFooter.tsx`
- `src/components/groups/events/WizardHeader.tsx`
- `src/components/groups/events/components/AdminRankingControls.tsx`
- `src/components/groups/events/components/DragDropPlayerList.tsx`
- `src/components/groups/events/components/EventDetailsHeader.tsx`
- `src/components/groups/events/components/EventDetailsTabs.tsx`
- `src/components/groups/events/components/EventDetailsTab.tsx`
- `src/components/groups/events/components/EventRegistrationButton.tsx`
- `src/components/groups/events/components/EventRegistrationStatus.tsx`
- `src/components/groups/events/components/PlayerRanking.tsx`
- `src/components/groups/events/components/PlayersList.tsx`
- `src/components/groups/events/components/PromotionBanner.tsx`
- `src/components/groups/events/components/PromotionIndicator.tsx`
- `src/components/groups/events/components/PromotionValidationTest.tsx`
- `src/components/groups/events/components/WizardStepRenderer.tsx`
- `src/components/groups/events/forms/EditEventDialog.tsx`
- `src/components/groups/events/forms/EditEventForm.tsx`
- `src/components/groups/events/forms/fields/EventBasicFields.tsx`
- `src/components/groups/events/forms/fields/EventCapacityFields.tsx`
- `src/components/groups/events/forms/fields/EventDateField.tsx`
- `src/components/groups/events/forms/fields/EventPricingFields.tsx`
- `src/components/groups/events/forms/fields/EventTimeField.tsx`
- `src/components/groups/events/forms/types/eventFormTypes.ts`
- `src/components/groups/events/forms/validation/EditEventFormValidationTest.tsx`

**POSTS SYSTEM (LOCKED):**
- `src/components/groups/posts/CreatePostForm2.tsx`
- `src/components/groups/posts/GroupPostsEmpty.tsx`
- `src/components/groups/posts/index.ts`
- `src/components/groups/posts/post-card/index.ts`
- `src/components/groups/posts/post-card/CommentActions.tsx`
- `src/components/groups/posts/post-card/CommentContent.tsx`
- `src/components/groups/posts/post-card/CommentForm2.tsx`
- `src/components/groups/posts/post-card/CommentHeader.tsx`
- `src/components/groups/posts/post-card/CommentReactions.tsx`
- `src/components/groups/posts/post-card/CommentThumbsDown2.tsx`
- `src/components/groups/posts/post-card/CommentThumbsUp2.tsx`
- `src/components/groups/posts/post-card/Comment2.tsx`
- `src/components/groups/posts/post-card/CommentsSection2.tsx`
- `src/components/groups/posts/post-card/DeleteCommentDialog.tsx`
- `src/components/groups/posts/post-card/DeleteCommentDialog2.tsx`
- `src/components/groups/posts/post-card/DeletePostDialog.tsx`
- `src/components/groups/posts/post-card/PostContent.tsx`
- `src/components/groups/posts/post-card/PostHeader.tsx`
- `src/components/groups/posts/post-card/PostHeart2.tsx`
- `src/components/groups/posts/post-card/PostReactions.tsx`
- `src/components/groups/posts/post-card/PostReactions2.tsx`
- `src/components/groups/posts/post-card/ThumbsDown2.tsx`
- `src/components/groups/posts/post-card/ThumbsUp2.tsx`

**HOOKS AND UTILITIES (LOCKED):**
- All files in `src/components/groups/hooks/`
- All files in `src/components/groups/utils/`
- All files in `src/components/groups/services/`
- All files in `src/hooks/`
- All files in `src/utils/`
- All files in `src/integrations/`

**TYPE DEFINITIONS (LOCKED):**
- All files ending in `/types.ts` or `/types/`
- All files ending in `/index.ts`
- All files in `src/types/`

**CONFIGURATION AND SETUP (LOCKED):**
- `src/main.tsx`
- `src/App.tsx`
- `src/App.css`
- All files in `src/lib/`
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `tailwind.config.ts`
- `postcss.config.js`

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
5. Follow the template's methodology

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

## MANDATORY TRANSPARENCY RULE

**AT THE END OF EVERY MESSAGE**, you MUST include a transparency statement that clearly indicates:

1. **What was specifically requested by the user**
2. **What changes you made that were explicitly requested**
3. **Any additional changes you made that were NOT explicitly requested** (if any)
4. **Confirmation that you made NO unrequested changes** (if true)
5. **Step progress tracking** (when working on multi-step processes)
6. **Testing instructions** (what the user should test to verify the step worked)
7. **HONESTY VERIFICATION** (confirmation that you did not lie about changes made)

**Format for transparency statement:**
```
---
**TRANSPARENCY REPORT:**
- **User requested:** [exact description of what user asked for]
- **Changes made as requested:** [list of specific changes that matched the request]
- **Additional unrequested changes:** [list any changes you made beyond the request, OR state "NONE"]
- **Unrequested changes confirmation:** [YES - I made changes beyond the request / NO - I only made requested changes]
- **Step progress:** [current step number and total steps, e.g., "Step 3 of 8 completed"]
- **What was accomplished:** [brief summary of what was just finished]
- **Test to verify this step:** [specific things to test to verify the step worked]
- **Next step:** [what will happen in the next step]
- **HONESTY VERIFICATION:** [I verified all claimed changes exist in the code / I did not lie about any implementations / All statements about code changes are accurate]
---
```

**Step Progress Requirements:**
- Always show current step number and total steps (e.g., "3/8 steps")
- At the end of each step, clearly state what was accomplished
- Provide specific testing instructions for validating each step's completion
- Preview what will happen in the next step

**This transparency statement is MANDATORY and must appear at the end of EVERY message where code changes are made.**

---

## IMPLEMENTATION PLAN: Next Event Card Feature

### Overview
Add a Next Event card to the group activity feed that appears below the post creation form and above the posts list. The card should only display if there's an upcoming event within the next 7 days and show the user's registration status.

### Detailed Implementation Plan

#### Step 1: Analysis and Design (5 minutes)
- **Target Location**: Below FacebookCreatePost, above FacebookPostsList in Activity2Tab.tsx
- **Conditional Display**: Only show if event exists within next 7 days
- **Registration Status**: Show user's status (registered, waitlisted, or not registered)
- **Design**: No section header, just the card component
- **Mobile-First**: Follow existing responsive patterns

#### Step 2: Create Next Event Hook (10 minutes)
- **File**: `src/components/groups/events/hooks/useNextEvent.ts`
- **Functionality**: 
  - Fetch upcoming events for group (next 7 days)
  - Get user's registration status for the event
  - Return single next event or null
- **Dependencies**: Use existing `useGroupEvents` hook pattern
- **Types**: Use existing database types from `@/integrations/supabase/types`

#### Step 3: Create Next Event Card Component (15 minutes)
- **File**: `src/components/groups/events/components/NextEventCard.tsx`
- **Features**:
  - Display event details (title, date, time, location)
  - Show registration status badge
  - Mobile-responsive design
  - Touch-friendly interactions
  - Click to navigate to event details
- **Size**: Keep under 50 lines, focused component
- **Styling**: Match existing card patterns in Activity2Tab

#### Step 4: Request Permission for Integration (2 minutes)
- **Issue**: Activity2Tab.tsx is in locked files list
- **Solution**: Request explicit permission to modify the file
- **Integration Point**: Add NextEventCard between FacebookCreatePost and FacebookPostsList
- **Preservation**: Maintain all existing functionality

#### Step 5: Integration and Testing (8 minutes)
- **Import**: Add NextEventCard to Activity2Tab.tsx
- **Positioning**: Place after FacebookCreatePost, before posts list
- **Props**: Pass groupId and user props
- **Testing**: Verify 7-day filtering, registration status display, responsive behavior

#### Step 6: Validation (5 minutes)
- **Functionality**: Confirm card only shows for events within 7 days
- **Registration Status**: Verify correct status display for all states
- **Performance**: Ensure no impact on existing feed performance
- **Mobile**: Test touch interactions and responsive layout

### Risk Mitigation Strategy
- **Locked File**: Activity2Tab.tsx requires permission to modify
- **Fallback**: Create new components without touching existing logic
- **Minimal Integration**: Single import and component placement
- **Error Handling**: Graceful degradation if event data unavailable

### Files to Create:
1. `src/components/groups/events/hooks/useNextEvent.ts`
2. `src/components/groups/events/components/NextEventCard.tsx`

### Files Requiring Permission:
1. `src/components/groups/mobile/Activity2Tab.tsx` (LOCKED)

### Implementation Notes:
- Use Component Creation Template for new components
- Follow mobile-first design patterns: `px-3 py-4 md:px-6 md:py-8`
- Include mobile (`h-3 w-3`) and desktop (`md:h-4 md:w-4`) icon sizing
- Use `space-y-3 md:space-y-4` for consistent spacing
- Implement proper TypeScript typing with database types
- Add touch-friendly interactions for mobile users
- Ensure graceful error handling and loading states

This plan ensures systematic implementation while preserving all existing functionality and following established patterns in the codebase.
