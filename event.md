Important Instruction for Lovable.dev
AI, you are breaking my site when you are making changes I didn't ask for. Please read this file and follow it.

## Change Only What's Requested Protocol

1. **Make ONLY the specific change requested** - nothing more, nothing less
2. **If code is working, don't modify the JavaScript logic** - only change what was explicitly asked for
3. **CSS changes = CSS only** - don't touch state management, hooks, or business logic
4. **Before making ANY change, explicitly state what will be modified and what will be preserved**

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

For steps that define database schemas or SQL queries, focus on creating accurate and complete table definitions and queries. Do not apply TypeScript or React-specific rules (e.g., typing, component change protocols) unless explicitly relevant. Ensure all tables required for the step's functionality are defined within the step to make it self-contained.

For UI/UX recommendations that are conceptual (not CSS code), translate them into CSS implementation details following the mandated mobile-first design patterns (e.g., px-3 py-4 md:px-6 md:py-8 for padding, space-y-3 md:space-y-4 for spacing) unless instructed otherwise. If unsure, ask for clarification on whether to provide CSS implementation.

## SQL and Backend Functions Protocol

For SQL stored procedures (e.g., register_player_to_event), ensure proper error handling (e.g., RAISE EXCEPTION for invalid cases) and follow best practices for clarity and performance (e.g., use indexes for frequently queried fields, as noted in table definitions).

For backend JavaScript functions (e.g., Edge Functions like notify_player_registration), apply TypeScript typing rules: explicitly type all parameters and return values using interfaces (e.g., request: { body: { event_id: string; player_id: string } }, Promise<{ message: string }>) and avoid implicit any types.

## New Implementation Protocol

For new implementations where there is no existing code to preserve (e.g., creating new database schemas, UI/UX recommendations, or backend functions), focus on fulfilling the requested functionality while adhering to mobile-first design, TypeScript typing (where applicable), and other relevant guidelines. The preservation rules apply only when modifying existing code.

## UI/UX Translation to CSS Protocol

When UI/UX recommendations specify layout details (e.g., 'card height: ~80px, with 16px padding'), translate these into CSS properties following the mobile-first design guidelines (e.g., height: 80px; padding: 16px;) and include responsive patterns (e.g., md:padding: 20px). If the recommendation is high-level (e.g., 'single-column layout'), implement it as display: flex; flex-direction: column; max-width: 360px; unless instructed otherwise. Always confirm the CSS implementation in the step.

## CRITICAL: Never Use 'any' Types - TypeScript Best Practices

**MANDATORY TYPE IMPORTS:** Always import types from the database schema:
```typescript
import type { Database } from "@/integrations/supabase/types";
```

**STANDARD GROUP TYPE PATTERN:** For any component working with groups, use this exact pattern:
```typescript
type Group = Database['public']['Tables']['groups']['Row'] & {
  members?: GroupMember[];
  member_count: number;
};
```

**STANDARD PROFILE TYPE:** For user profiles, always use:
```typescript
type Profile = Database['public']['Tables']['profiles']['Row'];
```

**COMPONENT PROPS RULES:**
- NEVER use any in interface definitions
- Always import existing types from their respective files
- Use proper generic types for callbacks

**REQUIRED IMPORTS FOR GROUP COMPONENTS:**
```typescript
import type { Database } from "@/integrations/supabase/types";
import type { GroupMember } from "./members/types";
import type { Profile } from "../posts/hooks/types/groupPostTypes";
```

**FORBIDDEN PATTERNS:**
- group: any → Use group: Group
- user: any → Use user: Profile | null
- onUpdate: (data: any) => void → Use proper typed callbacks

**TYPE EXTENSION PATTERN:** When adding computed fields to database types, use intersection types:
```typescript
type ExtendedGroup = Database['public']['Tables']['groups']['Row'] & {
  additionalField: string;
};
```

## CRITICAL: Code Modification Guidelines

**WORKFLOW:** Changes are made ONLY as requested. Cleanup/optimization happens ONLY when explicitly asked for.

**PRESERVATION FIRST APPROACH:**
1. Always identify what exists before making changes
2. Explicitly preserve anything not mentioned in the request
3. When modifying arrays or objects, update specific properties rather than replacing entire structures
4. When changing imports, add new imports alongside existing ones unless removal is specifically requested

**CHANGE VERIFICATION:**
- Before implementing: "This change will modify X while preserving Y and Z"
- After implementing: Verify all original functionality remains unless explicitly removed

**PERMISSION REQUIRED:**
- ANY changes beyond what's explicitly requested must be approved first
- This includes "obvious" fixes, ID changes, import updates, etc.
- Even if changes seem necessary for functionality, ask permission first

**CHANGE TYPES:**
- Normal requests: Make ONLY the requested changes, preserve everything else
- Cleanup requests: Only when explicitly asked to "optimize", "clean up", or "find unused code" should broader code analysis and removal happen

## CRITICAL: When modifying UI navigation components, always preserve ALL existing functionality unless explicitly asked to remove it.

- When changing labels or icons, modify ONLY the requested elements
- When adding imports, ADD to existing imports, don't replace the entire import line
- When modifying the tabs array, update individual properties, don't replace the entire array

**VERIFICATION REQUIREMENT:** Before making any changes to navigation components, explicitly list what will be preserved vs what will be changed.

## General Code Modification Guidelines

**PRESERVATION FIRST APPROACH:**
1. Always identify what exists before making changes
2. Explicitly preserve anything not mentioned in the request
3. When modifying arrays or objects, update specific properties rather than replacing entire structures
4. When changing imports, add new imports alongside existing ones unless removal is specifically requested

**CHANGE VERIFICATION:**
- Before implementing: "This change will modify X while preserving Y and Z"
- After implementing: Verify all original functionality remains unless explicitly removed

## CRITICAL: Main Entry Point Setup Rules

1. **NEVER modify main.tsx to render anything other than the root App component**
   - Always render <App /> in main.tsx
   - NEVER render <AppRouter /> or any sub-components directly
   - This ensures all providers are properly initialized

2. **Provider Hierarchy (must be maintained):**
   - App.tsx contains: QueryClientProvider, AuthProvider, ThemeProvider, etc.
   - AppRouter.tsx handles routing logic
   - Individual pages/components consume the providers

3. **React Query Requirements:**
   - All components using useQuery, useMutation, etc. MUST be wrapped in QueryClientProvider
   - QueryClientProvider is set up in App.tsx
   - If you bypass App.tsx, React Query will throw "No QueryClient set" error

4. **If you need to modify routing:**
   - Make changes in AppRouter.tsx or AppRoutes.tsx
   - NEVER change what gets rendered in main.tsx
   - Keep the App → QueryClientProvider → AppRouter hierarchy intact

5. **Common error patterns to avoid:**
   - Rendering routing components directly in main.tsx
   - Moving provider setup out of App.tsx
   - Creating new entry points that bypass the provider chain

Always use the database types from @/integrations/supabase/types instead of defining custom types. For profiles, use Database['public']['Tables']['profiles']['Row'] rather than creating a separate Profile type. This ensures type consistency across the entire application.

## Essential Architecture Guidelines

**Component Structure**
- Create small, focused files (50 lines or less)
- Use separate files for every component/hook
- Always use database types from @/integrations/supabase/types

**Lazy Loading**
- Add new pages to src/pages/lazy/index.ts using createLazyComponent()
- Use LazyPageName imports in routes
- Keep Login/Signup/Index eager-loaded

**Mobile-First Design**
- Use px-3 py-4 md:px-6 md:py-8 padding pattern
- Include mobile (h-3 w-3) and desktop (md:h-4 md:w-4) icon sizing
- Use space-y-3 md:space-y-4 for consistent spacing

**Performance**
- Performance monitoring only on Admin page
- Use React.memo(), useMemo(), useCallback() for optimization
- Wrap routes with RouteLoader and RouteErrorBoundary

**Preloading**
- Use OptimizedNavLink for navigation with preload capabilities
- Hover/focus events automatically preload routes

## Pickle Ninja Implementation Prompt: Player Registration and Initial Ranking - Step 2 (Registration and Event Details)

### Overview
This file is Step 2 of the implementation guide for the player registration and initial ranking functionality of the "Pickle Ninja" app. It focuses on the player registration process, including confirmation, waitlisting, and notifications, as well as the UI/UX for the Event Details Page where registration occurs. This step assumes the Calendar Page (event list) is already implemented from Step 1. Subsequent steps will cover additional UI/UX, ranking logic, database tables, and Supabase functions. This step is designed to be small and testable to ensure compatibility with Lovable.dev.

**Current Date/Time:** 05:13 PM MST, May 27, 2025
**Module 1 Status:** Group functionality (e.g., creating groups like "Pickle Pros," ID 456) is already implemented.
**Module 2 Status:** Event Creation Wizard creates events within a group (e.g., "Week 1 Ladder Matchup," ID 789), and the Calendar Page (Step 1) displays these events.
**Functionality (This Step):** Players can register for events via the Event Details Page, receive confirmation or waitlist status, and get notified with event details. This step includes the necessary database tables to support this functionality.

### Mobile-First UI/UX Design Principles (Lovable.dev Guidelines)
The Event Details Page is optimized for mobile devices with the following principles to ensure consistency in Lovable.dev:

- **Single-Column Layout:** Content fits within a 360px viewport, avoiding horizontal scrolling.
- **Large Touch Targets:** Interactive elements (buttons, cards, tabs) have a minimum size of 48x48 pixels.
- **Minimal Content per Screen:** Prioritize key actions and information to reduce scrolling.
- **Sticky Navigation:** Sticky headers/footers for consistent navigation (e.g., "Back", "Join Event").
- **Clear Progress Indicators:** Display progress indicators for multi-step processes (e.g., registration).
- **Optimized Interactions:** Use mobile-friendly gestures (e.g., swipe for tabs) and input types.
- **Haptic Feedback:** Light vibration (navigator.vibrate(200)) on button presses for tactile confirmation.
- **Responsive Typography:** Base font size of 16px, headings at 20px, scaling for larger screens.
- **Error Handling:** Inline error messages in red (e.g., "Event is full") below elements.
- **Onboarding Tooltips:** Dismissible tooltips or first-use modals to guide users, with a "Skip" option.

### Database Tables
This section defines the database tables required for the player registration process and Event Details Page: groups, group_members, player_status, profiles, events, and auth.users. These tables store group information, group membership, player registration statuses, user profiles, event details, and user authentication data, respectively.

#### 1. groups Table

**Purpose:** Stores groups, which serve as containers for events and membership tracking.

**Table Design:**

| Field Name | Data Type | Constraints/Description |
|------------|-----------|------------------------|
| id | UUID | Primary Key, auto-generated |
| group_name | TEXT | NOT NULL, max 100 chars |
| description | TEXT | NOT NULL |
| location | TEXT | NOT NULL |
| organizer_id | UUID | Foreign Key (auth.users.id), NOT NULL |
| member_count | INTEGER | NOT NULL, default 0 |
| created_at | TIMESTAMPTZ | NOT NULL, default CURRENT_TIMESTAMP |

**Relationships:**
- Foreign Key: organizer_id references auth.users(id), linking the group to its creator.
- One-to-Many: A single groups entry can have multiple group_members entries (via group_id).
- One-to-Many: A single groups entry can have multiple events entries (via group_id).

**Usage:**
- Stores groups as the top-level organizational unit for events and membership.
- The member_count field will be dynamically updated by triggers on group_members.
- Used to validate group membership during registration.

**Example Entry:**

| id | group_name | description | location | organizer_id | member_count | created_at |
|----|------------|-------------|----------|--------------|--------------|------------|
| 456e7890-e89b-12d3-a456-426614174000 | "Pickle Pros" | "Local pickleball community" | "Denver, CO" | 123e4567-e89b-12d3-a456-426614174000 | 5 | "2025-05-27T17:13:00Z" |

**Indexing Recommendations:**
- Index on organizer_id for efficient retrieval of groups by organizer.
- Index on created_at for sorting and filtering by creation date.

#### 2. Custom Enum Types

**Type: group_member_role:**
```sql
CREATE TYPE public.group_member_role AS ENUM ('member', 'organizer', 'admin');
```

**Purpose:** Defines the roles a user can have within a group.
**Values:**
- member: Default role for players who can register for events.
- organizer: Role for the group creator.
- admin: Role for users who can manage events (future functionality).

**Usage:** Used in group_members.role to specify the user's role in the group.

**Type: group_member_status:**
```sql
CREATE TYPE public.group_member_status AS ENUM ('active', 'pending', 'invited');
```

**Purpose:** Defines the status of a user's membership in a group.
**Values:**
- active: Default status for members who can participate in events.
- pending: Membership request pending approval (not used in this step).
- invited: User has been invited but not yet joined (not used in this step).

**Usage:** Used in group_members.status to specify the membership status.

#### 3. group_members Table

**Purpose:** Tracks membership of users in groups, ensuring only group members with role: 'member' and status: 'active' can register for events.

**Table Design:**

| Field Name | Data Type | Constraints/Description |
|------------|-----------|------------------------|
| id | UUID | Primary Key, default gen_random_uuid() |
| group_id | UUID | Foreign Key (groups.id), NOT NULL, part of unique key |
| user_id | UUID | Foreign Key (auth.users.id), NOT NULL, part of unique key |
| role | public.group_member_role | NOT NULL, default 'member' |
| status | public.group_member_status | NOT NULL, default 'active' |
| joined_at | TIMESTAMPTZ | NOT NULL, default CURRENT_TIMESTAMP |
| request_message | TEXT | NULLABLE |

**Constraints:**
- group_members_pkey: Primary key on id.
- group_members_group_id_user_id_key: Unique constraint on (group_id, user_id).
- group_members_group_id_fkey: Foreign key to groups(id) with CASCADE delete.
- group_members_user_id_fkey: Foreign key to auth.users(id) with CASCADE delete.

**Relationships:**
- Unique Key: (group_id, user_id) ensures a user can only be a member of a group once.
- Foreign Key: group_id references groups(id), user_id references auth.users(id).

**Usage:**
- Validates that a player is part of the group with role: 'member' and status: 'active' before allowing event registration.

**Example Entry:**

| id | group_id | user_id | role | status | joined_at | request_message |
|----|----------|---------|------|--------|-----------|-----------------|
| 999e8888-e89b-12d3-a456-426614174000 | 456e7890-e89b-12d3-a456-426614174000 | 111e2223-e89b-12d3-a456-426614174000 | "member" | "active" | "2025-05-27T17:13:00Z" | NULL |

**Indexing Recommendations:**
- Index on group_id for efficient retrieval of members in a group.
- Index on user_id for efficient retrieval of groups a user belongs to.
- Index on role and status for efficient filtering by role and status.

#### 4. player_status Table

**Purpose:** Tracks the participation status of players for each event, including registration, confirmation, waitlist, and ranking order.

**Table Design:**

| Field Name | Data Type | Constraints/Description |
|------------|-----------|------------------------|
| player_id | UUID | Foreign Key (profiles.id), NOT NULL, part of composite key |
| event_id | UUID | Foreign Key (events.id), NOT NULL, part of composite key |
| status | TEXT | NOT NULL, ENUM: "confirmed", "waitlist", "absent", "substituted" |
| substitute_id | UUID | Foreign Key (profiles.id), NULLABLE |
| registration_timestamp | TIMESTAMPTZ | NOT NULL, default CURRENT_TIMESTAMP |
| ranking_order | INTEGER | NOT NULL, default 0 |
| created_at | TIMESTAMPTZ | NOT NULL, default CURRENT_TIMESTAMP |

**Relationships:**
- Composite Primary Key: (player_id, event_id) ensures unique status per player per event.
- Foreign Key: player_id and substitute_id reference profiles(id).
- Foreign Key: event_id references events(id), linking to the specific event.

**Usage:**
- Tracks if a player is confirmed, on the waitlist, absent, or substituted for an event.
- The registration_timestamp tracks when a player joined, used for ordering waitlist players (first-come, first-served) in the Event Details Page.
- The ranking_order field determines the player's position in the confirmed list, updated during reorganization (in a later step).

**Example Entry:**

| player_id | event_id | status | substitute_id | registration_timestamp | ranking_order | created_at |
|-----------|----------|--------|---------------|------------------------|---------------|------------|
| 111e2223-e89b-12d3-a456-426614174000 | 789e0123-e89b-12d3-a456-426614174000 | "confirmed" | NULL | "2025-05-27T17:13:00Z" | 1 | "2025-05-27T17:13:00Z" |

**Indexing Recommendations:**
- Index on event_id for efficient retrieval of player statuses for an event.
- Index on player_id for efficient retrieval of a player's status across events.
- Index on status for efficient filtering of confirmed vs. waitlist players.
- Index on registration_timestamp for sorting by registration order.
- Index on ranking_order for efficient sorting of confirmed players.

#### 5. profiles Table (Users)

**Purpose:** Stores user data for players, providing a foundation for authentication and ranking. Extends the Supabase Auth auth.users table.

**Table Design:**

| Field Name | Data Type | Constraints/Description |
|------------|-----------|------------------------|
| id | UUID | Primary Key, auto-generated |
| first_name | TEXT | NOT NULL |
| last_name | TEXT | NOT NULL |
| gender | public.gender | NOT NULL |
| skill_level | TEXT | NOT NULL, ENUM: "beginner", "intermediate", "advanced" |
| birthday | DATE | NULLABLE |
| dupr_rating | NUMERIC(3,1) | NULLABLE |
| avatar_url | TEXT | NULLABLE |
| created_at | TIMESTAMPTZ | NOT NULL, default CURRENT_TIMESTAMP |
| updated_at | TIMESTAMPTZ | NOT NULL, default CURRENT_TIMESTAMP |
| phone_number | TEXT | NULLABLE |
| dupr_profile_link | TEXT | NULLABLE |

**Constraints:**
- profiles_pkey: Primary key on id.
- profiles_id_fkey: Foreign key id references auth.users(id) on delete CASCADE.

**Relationships:**
- Foreign Key: id references auth.users(id), linking to the Supabase Auth user table.
- One-to-Many: A profiles entry can have multiple player_status entries (via player_id or substitute_id).

**Usage:**
- Provides user authentication and authorization via Supabase Auth (auth.users).
- The dupr_rating and skill_level fields will be used for ranking players in a later step.
- The first_name and last_name fields are concatenated for display in the player list on the Event Details Page.

**Example Entry:**

| id | first_name | last_name | gender | skill_level | birthday | dupr_rating | avatar_url | created_at | updated_at | phone_number | dupr_profile_link |
|----|------------|-----------|--------|-------------|----------|-------------|------------|------------|------------|--------------|-------------------|
| 111e2223-e89b-12d3-a456-426614174000 | "John" | "Doe" | "male" | "intermediate" | "1990-01-01" | 3.5 | "https://example.com/avatar.jpg" | "2025-05-27T17:13:00Z" | "2025-05-27T17:13:00Z" | "+1234567890" | "https://dupr.com/profile/123" |

**Indexing Recommendations:**
- Index on id for efficient lookups (already indexed as primary key).
- Index on skill_level for efficient ranking by skill level (used in a later step).
- Index on dupr_rating for efficient ranking by DUPR rating (used in a later step).

#### 6. events Table

**Purpose:** Stores individual events within a group, providing the event context for player registration and display.

**Table Design:**

| Field Name | Data Type | Constraints/Description |
|------------|-----------|------------------------|
| id | UUID | Primary Key, auto-generated |
| group_id | UUID | Foreign Key (groups.id), NOT NULL |
| event_title | TEXT | NOT NULL, max 100 chars |
| description | TEXT | NOT NULL |
| event_date | DATE | NOT NULL |
| event_time | TIME | NOT NULL |
| location | TEXT | NOT NULL |
| max_players | INTEGER | NOT NULL, between 8 and 64, must be multiple of 4 |
| allow_reserves | BOOLEAN | NOT NULL, default false |
| pricing_model | TEXT | NOT NULL, ENUM: "free", "one-time", "per-event" |
| fee_amount | DECIMAL | NULLABLE, between 0 and 100 |
| ranking_method | TEXT | NOT NULL, ENUM: "random", "skill-based", "dupr" |
| skill_category | TEXT | NOT NULL, ENUM: "none", "beginner", "intermediate", "advanced" |
| registration_open | BOOLEAN | NOT NULL, default true |
| created_at | TIMESTAMPTZ | NOT NULL, default CURRENT_TIMESTAMP |

**Relationships:**
- Foreign Key: group_id references groups(id), linking each event to its group.
- One-to-Many: An events entry can have multiple player_status entries (via event_id).

**Usage:**
- Provides the event context for player registration, display on the Calendar Page (Step 1), and the Event Details Page.
- The registration_open flag controls whether players can join the event.
- The event_date and event_time fields are used to calculate the time until the event starts for notifications.

**Example Entry:**

| id | group_id | event_title | description | event_date | event_time | location | max_players | allow_reserves | pricing_model | fee_amount | ranking_method | skill_category | registration_open | created_at |
|----|----------|-------------|-------------|------------|------------|----------|-------------|----------------|---------------|------------|----------------|----------------|-------------------|------------|
| 789e0123-e89b-12d3-a456-426614174000 | 456e7890-e89b-12d3-a456-426614174000 | "Week 1 Ladder Matchup" | "Competitive ladder..." | "2025-05-28" | "18:00" | "Central Park Courts" | 16 | false | "one-time" | 20.00 | "skill-based" | "intermediate" | true | "2025-05-27T17:13:00Z" |

**Indexing Recommendations:**
- Index on group_id for efficient retrieval of events within a group.
- Index on event_date and event_time for sorting events on the calendar.
- Index on registration_open for efficient filtering of events open for registration.

#### 7. auth.users Table

**Purpose:** Stores core user authentication data, managed by Supabase Auth.

**Table Design:**

| Field Name | Data Type | Constraints/Description |
|------------|-----------|------------------------|
| id | UUID | Primary Key, auto-generated |
| email | TEXT | NOT NULL, unique |

**Usage:**
- Managed by Supabase Auth to handle user authentication.
- Linked to the group_members and profiles tables via the id field.

**Example Entry:**

| id | email |
|----|-------|
| 111e2223-e89b-12d3-a456-426614174000 | "john.doe@example.com" |

### Player Registration Process

1. **Access:** Players in the group can register via the "Register" button on the Event Details page, accessible by clicking an event from the Calendar Page (Step 1).

2. **Registration:**
   - Players click the "Register" button, which calls the register_player_to_event stored procedure (implemented in a later step).
   - The procedure checks:
     - The player is part of the group (via the group_members table) with role: 'member' and status: 'active'.
     - The event's registration_open flag is true.
     - The player is not already registered for the event.

3. **If checks pass:**
   - The player is added to the player_status table with status: "waitlist".
   - If the total number of players (confirmed + waitlist) is a multiple of 4, the procedure confirms the next 4 waitlisted players, setting their status to "confirmed" and updates their court assignments (court assignment logic in a later step).
   - If the total number of confirmed players reaches max_players, registration_open is set to false.
   - Triggers the notify_player_registration Edge Function (implemented in a later step) to send a confirmation notification.

4. **Confirmation and Waitlist:**
   - Players are confirmed in batches of 4 (e.g., when the 4th, 8th, 12th, etc., player registers).
   - Unconfirmed players remain on the waitlist (status: "waitlist").
   - For every 4 players confirmed, the confirmed player list is reorganized based on rankings (detailed in a later step).

5. **Registration Confirmation:**
   - After registration, the notify_player_registration Edge Function sends a notification:
     - Confirms registration and indicates status ("Confirmed" or "Waitlisted").
     - Includes the time until the event starts (e.g., "1 day and 2 hours until the games start"), calculated using events.event_date and event_time.

**Example Notification (Confirmed):**
"You've successfully registered for 'Week 1 Ladder Matchup' on May 28, 2025, at 18:00. You are confirmed to play! The event starts in 1 day and 2 hours."

**Example Notification (Waitlisted):**
"You've successfully registered for 'Week 1 Ladder Matchup' on May 28, 2025, at 18:00. You are currently waitlisted. The event starts in 1 day and 2 hours."

6. **Onboarding:**
   - Tooltip: "Join this event to participate! Every 4 players confirmed triggers a ranking-based reorganization. You may be placed on a waitlist if the event is not yet full."
   - Help Modal: "For the first event in the group, you'll be ranked by your DUPR rating (if available) or self-reported skill level. Subsequent events use league rankings."

### Event Details Page

1. **Access:** Accessible by clicking an event from the Calendar Page (Step 1).

2. **Functionality:**
   - Displays event details: event_title, description, event_date, event_time, location, max_players, pricing_model, fee_amount, ranking_method, skill_category, and registration status (registration_open).

3. **Confirmed Players Section:**
   - Lists players with status: 'confirmed' in player_status, ordered by ranking_order (ranking logic in a later step).
   - Shows each player's name (profiles.first_name + last_name), DUPR rating (profiles.dupr_rating), and skill level (profiles.skill_level).
   - Court assignments will be added in a later step after registration closes.

4. **Waitlist Section:**
   - Lists players with status: 'waitlist' in player_status, ordered by registration_timestamp.
   - Shows each player's name, DUPR rating, and skill level.

5. **Register Button:**
   - Visible if registration_open is true and the user is not already registered.
   - Clicking the button initiates the registration process described above.

**Query Example for Confirmed Players:**
```sql
SELECT 
    ps.player_id,
    p.first_name,
    p.last_name,
    p.dupr_rating,
    p.skill_level
FROM player_status ps
JOIN profiles p ON ps.player_id = p.id
WHERE ps.event_id = :event_id
  AND ps.status = 'confirmed'
ORDER BY ps.ranking_order;
```

**Query Example for Waitlist:**
```sql
SELECT 
    ps.player_id,
    p.first_name,
    p.last_name,
    p.dupr_rating,
    p.skill_level
FROM player_status ps
JOIN profiles p ON ps.player_id = p.id
WHERE ps.event_id = :event_id
  AND ps.status = 'waitlist'
ORDER BY ps.registration_timestamp;
```

### Mobile-First UI/UX Recommendations:

**Layout:** Single-column layout with a sticky header showing the event title (e.g., "Week 1 Ladder Matchup") and a sticky footer with a "Back" button (48x48px). Use tabs for sections: "Details", "Confirmed Players", "Waitlist".

**Tabs Navigation:** Use swipeable tabs (e.g., react-native-tab-view) for "Details", "Confirmed Players", "Waitlist". Tabs have 16px font size, 48px touch target, and a subtle underline for the active tab.

**Details Tab:**
- Show key-value pairs: Title, Description, Date, Time, Location, Max Players, Pricing, Fee (if paid), Ranking Method, Skill Category, Registration Status (e.g., "Open" in green if registration_open is true).
- Use 16px font size, 8px spacing between items.
- If registration_open is true and the user isn't registered, show a "Join Event" button (48x48px, green background) in the footer alongside "Back". Tapping triggers the registration process with haptic feedback (navigator.vibrate(200)).

**Confirmed Players Tab:**
- List players as cards (80px height, 16px padding) with Name (profiles.first_name + last_name), DUPR Rating, and Skill Level.
- Highlight the logged-in user's card with a light green background (#e6ffe6).

**Waitlist Tab:**
- List waitlisted players as cards with Name, DUPR Rating, and Skill Level, ordered by registration_timestamp.

**Onboarding:** Tooltip on first load: "Confirmed players will be assigned courts after registration closes. Waitlisted players will be confirmed as more players register." (dismissible).

## AI Implementation Context for Pickle Ninja Step 2 (Player Registration)

### Current Codebase Status

**Existing Database Tables (Already Implemented):**
- `groups` - Group containers with member_count tracking
- `group_members` - Membership tracking with roles (member, organizer, admin) and status (active, pending, invited)
- `profiles` - User profiles extending auth.users
- `events` - Event details within groups
- `event_series` - Event series management
- Custom enums: `group_member_role`, `group_member_status`, `gender`

**Missing Database Tables (To Be Created in Step 2A):**
- `player_status` - Player registration status for events

**Existing UI Components (Working):**
- Calendar Page: `GroupCalendarTab` with `EventsList` and `EventCard`
- Event Creation: Full wizard implementation
- Group Management: Complete CRUD operations
- Navigation: `BottomNavigation`, `MobilePageHeader`

**Missing UI Components (To Be Created):**
- Event Details Page (Step 2B)
- Registration UI Components (Step 2E)
- Registration Data Hooks (Step 2D)

### Component Patterns to Follow

**File Structure Pattern:**
```
src/components/groups/events/
├── EventDetailsPage.tsx (new - Step 2B)
├── registration/
│   ├── RegistrationButton.tsx (new - Step 2E)
│   ├── PlayersList.tsx (new - Step 2E)
│   └── hooks/
│       ├── useEventRegistration.ts (new - Step 2D)
│       └── useEventPlayers.ts (new - Step 2D)
```

**TypeScript Patterns:**
```typescript
// Standard imports
import type { Database } from "@/integrations/supabase/types";

// Standard types
type Event = Database['public']['Tables']['events']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];
type PlayerStatus = Database['public']['Tables']['player_status']['Row'];
```

**Query Keys Pattern:**
```typescript
// Add to src/lib/queryKeys.ts
events: {
  // ... existing
  players: (eventId: string) => [...queryKeys.events.detail(eventId), 'players'] as const,
  registration: (eventId: string, userId?: string) => [...queryKeys.events.detail(eventId), 'registration', { userId }] as const,
}
```

**Mobile-First CSS Patterns:**
```css
/* Standard padding */
.container { @apply px-3 py-4 md:px-6 md:py-8; }

/* Standard spacing */
.content { @apply space-y-3 md:space-y-4; }

/* Touch targets */
.button { @apply h-12 w-12 min-h-[48px] min-w-[48px]; }

/* Card pattern */
.card { @apply bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md; }
```

### Database Schema Requirements

**player_status Table (Step 2A):**
```sql
CREATE TABLE public.player_status (
  player_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'waitlist', 'absent', 'substituted')),
  substitute_id UUID REFERENCES public.profiles(id),
  registration_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ranking_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (player_id, event_id)
);
```

**Required Indexes (Step 2A):**
```sql
CREATE INDEX idx_player_status_event_id ON public.player_status(event_id);
CREATE INDEX idx_player_status_status ON public.player_status(status);
CREATE INDEX idx_player_status_registration_timestamp ON public.player_status(registration_timestamp);
CREATE INDEX idx_player_status_ranking_order ON public.player_status(ranking_order);
```

### Navigation Integration Points

**Current EventCard Component (src/components/groups/events/EventCard.tsx):**
- Has onClick prop that needs to navigate to Event Details Page (Step 2C)
- Currently renders basic event info: title, date, time, location, registration status

**Navigation Pattern to Follow:**
```typescript
// In GroupCalendarTab.tsx (Step 2C)
const handleEventClick = (eventId: string) => {
  navigate(`/groups/${groupId}/events/${eventId}`);
};
```

### Routing Requirements (Step 2C)

**New Route to Add:**
```typescript
// In src/routing/AppRoutes.tsx
<Route 
  path="/groups/:groupId/events/:eventId" 
  element={
    <RouteLoader>
      <RouteErrorBoundary>
        <LazyEventDetailsPage />
      </RouteErrorBoundary>
    </RouteLoader>
  } 
/>
```

**Lazy Loading (Step 2C):**
```typescript
// Add to src/pages/lazy/index.ts
export const LazyEventDetailsPage = createLazyComponent(() => 
  import('../EventDetailsPage').then(m => ({ default: m.EventDetailsPage }))
);
```

### Data Fetching Patterns

**Event Players Hook (Step 2D):**
```typescript
export const useEventPlayers = (eventId: string) => {
  return useQuery({
    queryKey: queryKeys.events.players(eventId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_status')
        .select(`
          *,
          profiles:player_id (
            id,
            first_name,
            last_name,
            dupr_rating,
            skill_level,
            avatar_url
          )
        `)
        .eq('event_id', eventId)
        .order('ranking_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!eventId
  });
};
```

### UI Component Architecture

**Event Details Page Structure (Step 2B):**
```
EventDetailsPage
├── EventDetailsHeader (sticky)
├── EventDetailsTabs
│   ├── DetailsTab
│   ├── ConfirmedPlayersTab
│   └── WaitlistTab
└── EventDetailsFooter (sticky with Register button)
```

**Registration Button Logic (Step 2E):**
- Check if user is group member
- Check if registration is open
- Check if user is already registered
- Show appropriate state: Register, Registered, Waitlisted, Full

### Implementation Steps Breakdown

**Step 2A: Database Foundation**
- Create player_status table
- Add indexes
- Test with sample data
- No UI changes

**Step 2B: Event Details Page Structure**
- Create EventDetailsPage component
- Create tab structure
- Add basic event info display
- No registration functionality yet

**Step 2C: Navigation Integration**
- Add route to AppRoutes.tsx
- Update EventCard onClick
- Test navigation flow
- Minimal changes to existing components

**Step 2D: Registration Data Hooks**
- Create useEventPlayers hook
- Create useEventRegistration hook
- Add query keys
- Test data fetching

**Step 2E: Registration UI Components**
- Create RegistrationButton component
- Create PlayersList component
- Add registration UI to Event Details Page
- No backend integration yet

**Step 2F: Registration Logic Integration**
- Create registration mutation
- Wire up registration flow
- Add error handling
- Test full registration process

### Error Prevention Guidelines

**Breaking Changes to Avoid:**
- Never modify existing EventCard props structure
- Never change existing route paths
- Never modify queryKeys structure without updating all consumers
- Never change database table names that are already referenced

**Safe Change Patterns:**
- Add new optional props to existing components
- Add new routes without modifying existing ones
- Extend queryKeys object without modifying existing keys
- Add new database tables without modifying existing ones

**Testing Checkpoints:**
- After Step 2A: Database queries work
- After Step 2B: Event Details Page renders
- After Step 2C: Navigation works from calendar
- After Step 2D: Data hooks return correct data
- After Step 2E: Registration UI displays correctly
- After Step 2F: Full registration flow works

### Current File Dependencies

**Files That Import EventCard:**
- `src/components/groups/events/EventsList.tsx`
- `src/components/groups/mobile/GroupCalendarTab.tsx`

**Files That Use Event Types:**
- `src/components/groups/events/hooks/useGroupEvents.ts`
- `src/components/groups/events/types.ts`

**Files That Define Query Keys:**
- `src/lib/queryKeys.ts`

**Authentication Context:**
- Available via `useAuth()` hook
- Profile available as `profile` from context
- User ID available as `user?.id`

This context provides everything needed to implement Steps 2A through 2F safely without breaking existing functionality.
