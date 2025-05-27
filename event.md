
# Project Rules and Guidelines

## Change Protocol

### Core Principle: Make ONLY What's Requested
1. **Make ONLY the specific change requested** - nothing more, nothing less
2. **If code is working, don't modify the JavaScript logic** - only change what was explicitly asked for
3. **CSS changes = CSS only** - don't touch state management, hooks, or business logic
4. **Before making ANY change, explicitly state what will be modified and what will be preserved**

## Verification Before Changes
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

### Protected Components (require extra caution)
- All post and comment components (MobilePostCard2, CommentsSection2, Comment2, CommentForm2, etc.)
- Navigation components (BottomNavigation, MobilePageHeader, etc.)
- Layout components (AppLayout, MobileLayout, etc.)
- Any component the user has marked as "finished"

### When in doubt
- Ask first, code second
- Err on the side of requesting permission
- Never assume cross-component changes are acceptable

## TypeScript Best Practices

### CRITICAL: Never Use 'any' Types

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

## Code Modification Guidelines

### WORKFLOW
Changes are made ONLY as requested. Cleanup/optimization happens ONLY when explicitly asked for.

### PRESERVATION FIRST APPROACH
1. Always identify what exists before making changes
2. Explicitly preserve anything not mentioned in the request
3. When modifying arrays or objects, update specific properties rather than replacing entire structures
4. When changing imports, add new imports alongside existing ones unless removal is specifically requested

### CHANGE VERIFICATION
- Before implementing: "This change will modify X while preserving Y and Z"
- After implementing: Verify all original functionality remains unless explicitly removed

### PERMISSION REQUIRED
- ANY changes beyond what's explicitly requested must be approved first
- This includes "obvious" fixes, ID changes, import updates, etc.
- Even if changes seem necessary for functionality, ask permission first

### CHANGE TYPES
- Normal requests: Make ONLY the requested changes, preserve everything else
- Cleanup requests: Only when explicitly asked to "optimize", "clean up", or "find unused code" should broader code analysis and removal happen

## Navigation Component Rules

**CRITICAL**: When modifying UI navigation components, always preserve ALL existing functionality unless explicitly asked to remove it.

- When changing labels or icons, modify ONLY the requested elements
- When adding imports, ADD to existing imports, don't replace the entire import line
- When modifying the tabs array, update individual properties, don't replace the entire array

**VERIFICATION REQUIREMENT**: Before making any changes to navigation components, explicitly list what will be preserved vs what will be changed.

## Main Entry Point Setup Rules

**CRITICAL**: Main Entry Point Setup Rules

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

## Database Types

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

---

# Pickle Ninja Implementation Prompt: Module 2 - Event Creation Wizard with Database Details

## Overview
This file provides an implementation guide for Module 2 (Event Creation Wizard) of the "Pickle Ninja" app. The wizard allows organizers to create events within a group ("Pickle Pros," ID 456) using a 6-step process. It supports "One-Time Event" (Steps 3–6) and "Multi-Week Events" (Step 2, skip to Step 6), with each event requiring Event Title, Description, Date, Time, Location, Max Players (8–64, multiples of 4), Pricing, Ranking, and Skill Category. Events can be of type Ladder, Kings Court, Round Robin, or Single Court. The design is mobile-first, and the implementation uses Supabase for database operations.

Current Date/Time: 08:41 PM MST, May 26, 2025
Module 1 Status: Group functionality exists (e.g., "Pickle Pros," ID 456), and users are on the group page.

## Event Creation Wizard Flow

### Step 1: Event Format Selection
- Inputs: Event Format (Dropdown: "Ladder", "Kings Court", "Round Robin", "Single Court").
- Functionality: User selects the event format and proceeds to Step 2.
- Validation: Event format required. Error: "Please select an event format."
- Supabase: Store in session: event_format: "ladder", group_id: 456.
- UI/UX Recommendations:
  - Layout: Single-column, sticky header ("Step 1 of 6: Event Format"), sticky footer ("Cancel", "Next").
  - Event Format Input: Touch-friendly dropdown, 48px height options, label "Event Format".
  - Tooltip: "Choose the event format (e.g., Ladder moves players between courts)."
  - Error Handling: Inline error below dropdown in red: "Please select an event format."
  - Haptic Feedback: navigator.vibrate(200) on "Next" button tap.

### Step 2: Event Type
- Inputs:
  - Event Type (Radio buttons: "One-Time Event", "Multi-Week Events").
  - One-Time Event: Proceed to Step 3.
  - Multi-Week Events:
    - Series Title (Text, e.g., "Tom's Battle Series").
    - Add Events: Event Title, Description, Date, Time, Location, Max Players (8–64, multiples of 4), Allow Reserves (yes/no), Pricing (Free, One-Time Fee, Per-Event Fee; fee $0–$100 if paid), Ranking (Random, Skill-Based, DUPR), Skill Category (None, Beginner, Intermediate, Advanced).
    - Copy Event: Pre-fill event details for editing.
- Functionality:
  - Select event type.
  - One-Time: Proceed to Step 3.
  - Multi-Week: Input series title, add events, proceed to Step 6.
- Validation:
  - Event type required.
  - Multi-Week: Series title required, at least one event, Date/Time after 2025-05-26 20:41 PM MST, Max Players 8–64 (multiples of 4), Fee $0–$100 if paid.
  - Errors: "Series title required", "At least one event required", "Date/Time must be in the future".
- Supabase:
  - One-Time: event_type: "one-time".
  - Multi-Week: event_type: "multi-week", series_title: "Tom's Battle Series", events: [{event_title: "Week 1 Ladder Matchup", description: "...", event_date: "2025-05-28", event_time: "18:00", location: "Central Park", max_players: 16, allow_reserves: false, pricing_model: "one-time", fee_amount: 20, ranking_method: "skill-based", skill_category: "intermediate"}].
- UI/UX Recommendations:
  - Layout: Single-column, sticky header ("Step 2 of 6: Event Type"), sticky footer ("Back", "Next", "Cancel").
  - Event Type: Radio buttons, 48px touch target, label "Event Type".
  - Multi-Week:
    - Series Title: Text input, label "Series Title".
    - Add Events: "Add Event" button (48x48px), modal with fields (Date: type="date", Time: type="time", etc.).
    - Copy Event: "Copy Event" button (48x48px) pre-fills modal.
    - Event List: Cards with key details and "Edit" button.
  - Tooltip: "Add events with all details, copy to save time."
  - Error Handling: Inline errors in red (e.g., "Series title required").

### Step 3: Event Details (One-Time Event Only)
- Inputs:
  - Event Title (Text, e.g., "Spring Ladder Event").
  - Description (Text, e.g., "One-time competitive ladder match").
  - Date (Date picker, e.g., 2025-05-28).
  - Time (Time picker, e.g., 18:00).
  - Location (Text, e.g., "Downtown Courts").
- Functionality:
  - Input event details.
  - Proceed to Step 4.
- Validation:
  - Date/Time after 2025-05-26 20:41 PM MST.
  - Error: "Date/Time must be in the future."
- Supabase:
  - Store in session: event_title: "Spring Ladder Event", description: "...", event_date: "2025-05-28", event_time: "18:00", location: "Downtown Courts".
- UI/UX Recommendations:
  - Layout: Single-column, sticky header ("Step 3 of 6: Event Details"), sticky footer ("Back", "Next", "Cancel").
  - Inputs: Text inputs for Title, Description, Location; Date (type="date", min 2025-05-27); Time (type="time").
  - Error Handling: Inline errors in red (e.g., "Date must be in the future").

### Step 4: Player Details (One-Time Event Only)
- Inputs:
  - Max Players (Dropdown: 8–64, multiples of 4, default 16).
  - Allow Reserves (Toggle: yes/no, default no).
  - Pricing (Dropdown: "Free", "One-Time Fee", "Per-Event Fee").
  - Fee Amount (Number: $0–$100, default $20, if paid).
- Functionality:
  - Input player and pricing details.
  - Proceed to Step 5.
- Validation:
  - Max Players: 8–64, multiples of 4.
  - Fee: $0–$100 if paid.
  - Errors: "Max players must be 8–64 and a multiple of 4", "Fee must be $0–$100".
- Supabase:
  - Store in session: max_players: 16, allow_reserves: false, pricing_model: "one-time", fee_amount: 20.
- UI/UX Recommendations:
  - Layout: Single-column, sticky header ("Step 4 of 6: Player Details"), sticky footer.
  - Max Players: Dropdown (8, 12, ..., 64), label "Max Players".
  - Allow Reserves: Toggle, label "Allow Reserves".
  - Pricing: Dropdown, label "Pricing".
  - Fee Amount: Number input (visible if paid), label "Fee Amount ($)".
  - Error Handling: Inline errors in red (e.g., "Fee must be $0–$100").

### Step 5: Ranking Details (One-Time Event Only)
- Inputs:
  - Ranking (Dropdown: "Random", "Skill-Based", "DUPR").
  - Skill Category (Dropdown: "None", "Beginner", "Intermediate", "Advanced").
- Functionality:
  - Input ranking details.
  - Proceed to Step 6.
- Validation:
  - Ranking required.
  - Error: "Select a ranking method."
- Supabase:
  - Store in session: ranking_method: "skill-based", skill_category: "intermediate".
- UI/UX Recommendations:
  - Layout: Single-column, sticky header ("Step 5 of 6: Ranking Details"), sticky footer.
  - Ranking: Dropdown, label "Ranking Method".
  - Skill Category: Dropdown, label "Skill Category".
  - Error Handling: Inline error in red (e.g., "Select a ranking method").

### Step 6: Review and Confirm
- Inputs:
  - One-Time: Summary of Event Format, Event Type, Event Title, Description, Date, Time, Location, Max Players, Reserves, Pricing Model, Fee Amount, Ranking Method, Skill Category.
  - Multi-Week: Summary of Event Format, Event Type, Series Title, Events (each with Event Title, Description, Date, Time, Location, Max Players, Reserves, Pricing Model, Fee Amount, Ranking Method, Skill Category).
- Functionality:
  - Review inputs.
  - Warning: "Fewer than 8 players may require cancellation or sit-outs" if Max Players < 8.
  - Confirm to create event(s).
- Supabase:
  - One-Time:
    - Insert into event_series: organizer_id, group_id, event_format, event_type, created_at.
    - Insert into events: {series_id: 123, group_id: 456, event_title: "Spring Ladder Event", description: "...", event_date: "2025-05-28", event_time: "18:00", location: "Downtown Courts", max_players: 16, allow_reserves: false, pricing_model: "one-time", fee_amount: 20, ranking_method: "skill-based", skill_category: "intermediate"}.
  - Multi-Week:
    - Insert into event_series: organizer_id, group_id, event_format, event_type, series_title, created_at.
    - Insert into events: Multiple events under one series_id, e.g., {series_id: 123, group_id: 456, event_title: "Week 1 Ladder Matchup", description: "...", event_date: "2025-05-28", event_time: "18:00", location: "Central Park", max_players: 16, ...}.
  - Trigger Edge Function: notify_organizer_event_created.
- UI/UX Recommendations:
  - Layout: Single-column, sticky header ("Step 6 of 6: Review and Confirm"), sticky footer.
  - Review Display: Scrollable list of key-value pairs (e.g., "Event Format: Ladder"); Multi-Week events as cards.
  - Warning: Orange text for Max Players < 8 warning.
  - Help Modal: "Review settings. Edit later in dashboard."
  - Confirm Button: "Confirm" (48x48px, green), with "Back", "Cancel".

## Database Tables

### Table: groups
- Purpose: Stores groups created by organizers, containers for events.
- Schema:
  Field Name       | Data Type   | Constraints/Description
  id               | UUID        | Primary Key, auto-generated
  group_name       | TEXT        | NOT NULL, max 100 chars
  description      | TEXT        | NOT NULL
  location         | TEXT        | NOT NULL
  organizer_id     | UUID        | Foreign Key (profiles.id), NOT NULL
  created_at       | TIMESTAMPTZ | NOT NULL, default CURRENT_TIMESTAMP
- Example Entry:
  id: 456e7890-e89b-12d3-a456-426614174000
  group_name: "Pickle Pros"
  description: "Local pickleball community"
  location: "Denver, CO"
  organizer_id: 123e4567-e89b-12d3-a456-426614174000
  created_at: "2025-05-26T20:41:00Z"

### Table: event_series
- Purpose: Container for a series of events within a group.
- Schema:
  Field Name       | Data Type   | Constraints/Description
  id               | UUID        | Primary Key, auto-generated
  group_id         | UUID        | Foreign Key (groups.id), NOT NULL
  event_format     | TEXT        | NOT NULL, ENUM: "Ladder", "Kings Court", "Round Robin", "Single Court"
  event_type       | TEXT        | NOT NULL, ENUM: "one-time", "multi-week"
  series_title     | TEXT        | NULLABLE, max 100 chars
  created_at       | TIMESTAMPTZ | NOT NULL, default CURRENT_TIMESTAMP
- Example Entry:
  id: 123e4567-e89b-12d3-a456-426614174000
  group_id: 456e7890-e89b-12d3-a456-426614174000
  event_format: "Ladder"
  event_type: "multi-week"
  series_title: "Tom's Battle Series"
  created_at: "2025-05-26T20:41:00Z"

### Table: events
- Purpose: Stores individual events within an event series.
- Schema:
  Field Name       | Data Type   | Constraints/Description
  id               | UUID        | Primary Key, auto-generated
  series_id        | UUID        | Foreign Key (event_series.id), NOT NULL
  group_id         | UUID        | Foreign Key (groups.id), NOT NULL
  event_format     | TEXT        | NOT NULL, ENUM: "Ladder", "Kings Court", "Round Robin", "Single Court"
  event_title      | TEXT        | NOT NULL, max 100 chars
  description      | TEXT        | NOT NULL
  event_date       | DATE        | NOT NULL
  event_time       | TIME        | NOT NULL
  location         | TEXT        | NOT NULL
  max_players      | INTEGER     | NOT NULL, between 8 and 64, must be multiple of 4
  allow_reserves   | BOOLEAN     | NOT NULL, default false
  pricing_model    | TEXT        | NOT NULL, ENUM: "free", "one-time", "per-event"
  fee_amount       | DECIMAL     | NULLABLE, between 0 and 100
  ranking_method   | TEXT        | NOT NULL, ENUM: "random", "skill-based", "dupr"
  skill_category   | TEXT        | NOT NULL, ENUM: "none", "beginner", "intermediate", "advanced"
  registration_open | BOOLEAN     | NOT NULL, default true
  created_at       | TIMESTAMPTZ | NOT NULL, default CURRENT_TIMESTAMP
- Example Entry:
  id: 789e0123-e89b-12d3-a456-426614174000
  series_id: 123e4567-e89b-12d3-a456-426614174000
  group_id: 456e7890-e89b-12d3-a456-426614174000
  event_format: "Ladder"
  event_title: "Week 1 Ladder Matchup"
  description: "Competitive ladder..."
  event_date: "2025-05-28"
  event_time: "18:00"
  location: "Central Park Courts"
  max_players: 16
  allow_reserves: false
  pricing_model: "one-time"
  fee_amount: 20.00
  ranking_method: "skill-based"
  skill_category: "intermediate"
  registration_open: true
  created_at: "2025-05-26T20:41:00Z"

### Table: profiles
- Purpose: Stores user data for organizers, linked to auth.users.
- Schema:
  Field Name          | Data Type   | Constraints/Description
  id                  | UUID        | Primary Key, Foreign Key (auth.users.id)
  first_name          | TEXT        | NOT NULL
  last_name           | TEXT        | NOT NULL
  gender              | TEXT        | NOT NULL
  skill_level         | TEXT        | NOT NULL
  birthday            | DATE        | NULLABLE
  dupr_rating         | NUMERIC(3,1) | NULLABLE
  avatar_url          | TEXT        | NULLABLE
  created_at          | TIMESTAMPTZ | NOT NULL, default CURRENT_TIMESTAMP
  updated_at          | TIMESTAMPTZ | NOT NULL, default CURRENT_TIMESTAMP
  phone_number        | TEXT        | NULLABLE
  dupr_profile_link   | TEXT        | NULLABLE
- Example Entry:
  id: 123e4567-e89b-12d3-a456-426614174000
  first_name: "Tom"
  last_name: "Smith"
  gender: "male"
  skill_level: "intermediate"
  birthday: "1980-01-01"
  dupr_rating: 3.5
  avatar_url: "https://example.com/avatar.jpg"
  created_at: "2025-05-26T20:41:00Z"
  updated_at: "2025-05-26T20:41:00Z"
  phone_number: "+1234567890"
  dupr_profile_link: "https://dupr.com/profile/123"

### Table: auth.users
- Purpose: Stores core user authentication data, managed by Supabase Auth.
- Schema:
  Field Name      | Data Type   | Constraints/Description
  id              | UUID        | Primary Key, auto-generated
  email           | TEXT        | NOT NULL, unique
- Example Entry:
  id: 123e4567-e89b-12d3-a456-426614174000
  email: "tom@example.com"

## Supabase Functions

### Edge Function: notify_organizer_event_created
```javascript
/**
 * Purpose: Sends a notification to the organizer when an event or series of events is created successfully.
 * Usage: Triggered after an event is created in Step 6 of the Event Creation Wizard to notify the organizer of successful creation.
 * Parameters:
 *   request.body.event_id (UUID): The ID of the newly created event (for one-time events) or the first event in a series (for multi-week events).
 * Returns: An object with a success message (e.g., { message: "Notification sent successfully." }).
 * Example Call: Triggered automatically after inserting into the events table, e.g., notify_organizer_event_created({ event_id: '789e0123-e89b-12d3-a456-426614174000' });
 * Notes:
 *   - Fetches event and organizer details to construct a personalized notification message.
 *   - Currently logs the notification message; actual implementation should integrate with an email service or in-app notification system.
 *   - Assumes the organizer's email is stored in the auth.users table and linked via the profiles table.
 */
export default async function notify_organizer_event_created(request) {
    const { event_id } = request.body;
    
    const { data: event, error: eventError } = await supabase
        .from('events')
        .select('event_title, group_id')
        .eq('id', event_id)
        .single();
    
    if (eventError) throw new Error(eventError.message);

    const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('organizer_id')
        .eq('id', event.group_id)
        .single();

    if (groupError) throw new Error(groupError.message);

    const { data: organizerProfile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', group.organizer_id)
        .single();

    if (profileError) throw new Error(profileError.message);

    const { data: organizerAuth, error: authError } = await supabase
        .from('auth.users')
        .select('email')
        .eq('id', group.organizer_id)
        .single();

    if (authError) throw new Error(authError.message);

    const fullName = `${organizerProfile.first_name} ${organizerProfile.last_name}`;

    console.log(`Sending notification to ${organizerAuth.email} (${fullName}): Event "${event.event_title}" created successfully.`);

    return { message: "Notification sent successfully." };
}
```
