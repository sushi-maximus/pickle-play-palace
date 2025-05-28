
# Pickle Ninja Implementation Prompt: Player Registration and Initial Ranking - Step 1 (Event List)

## Overview
This file is Step 1 of the implementation guide for the player registration and initial ranking functionality of the "Pickle Ninja" app. It focuses on displaying events on the Calendar Page, allowing group members to view upcoming events within their group. Subsequent steps will cover the registration process, additional UI/UX recommendations, ranking logic, database tables, and Supabase functions. This step is designed to be small and testable to ensure compatibility with Lovable.dev.

**Current Date/Time**: 05:37 PM MST, May 27, 2025  
**Module 1 Status**: Group functionality (e.g., creating groups like "Pickle Pros," ID 456) is already implemented.  
**Module 2 Status**: Event Creation Wizard creates events within a group (e.g., "Week 1 Ladder Matchup," ID 789), providing the foundation for displaying events.  
**Functionality (This Step)**: Group members can access a Calendar Page to view a list of upcoming events for their group, with basic details and a status indicator.

## Mobile-First UI/UX Design Principles (Lovable.dev Guidelines)
The Calendar Page is optimized for mobile devices with the following principles to ensure consistency in Lovable.dev:
1. **Single-Column Layout**: Content fits within a 360px viewport, avoiding horizontal scrolling.
2. **Large Touch Targets**: Interactive elements (buttons, cards) have a minimum size of 48x48 pixels.
3. **Minimal Content per Screen**: Prioritize key information to reduce scrolling.
4. **Sticky Navigation**: Sticky headers/footers for consistent navigation (e.g., "Back to Group").
5. **Clear Progress Indicators**: Not applicable in this step (used in multi-step processes).
6. **Optimized Interactions**: Use mobile-friendly gestures (e.g., pull-to-refresh) and input types.
7. **Haptic Feedback**: Light vibration (`navigator.vibrate(200)`) on button presses for tactile confirmation.
8. **Responsive Typography**: Base font size of 16px, headings at 20px, scaling for larger screens.
9. **Error Handling**: Inline error messages in red (e.g., "No upcoming events") in the main content area.
10. **Onboarding Tooltips**: Dismissible tooltips or first-use modals to guide users, with a "Skip" option.

## Database Tables
This section defines the database tables required for the Calendar Page: `groups`, `group_members`, `events`, and `auth.users`. These tables store group information, group membership, event details, and user authentication data, respectively.

### 1. `groups` Table
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
- **Relationships**:
  - Foreign Key: `organizer_id` references `auth.users(id)`, linking the group to its creator.
  - One-to-Many: A single `groups` entry can have multiple `group_members` entries (via `group_id`).
  - One-to-Many: A single `groups` entry can have multiple `events` entries (via `group_id`).
- **Usage**:
  - Stores groups as the top-level organizational unit for events and membership.
  - The `member_count` field will be dynamically updated by triggers on `group_members`.
- **Example Entry**:
  | `id`               | `group_name`   | `description`           | `location`   | `organizer_id`    | `member_count` | `created_at`              |
  |--------------------|----------------|-------------------------|--------------|-------------------|----------------|---------------------------|
  | `456e7890-e89b-12d3-a456-426614174000` | "Pickle Pros" | "Local pickleball community" | "Denver, CO" | `123e4567-e89b-12d3-a456-426614174000` | 5              | "2025-05-27T17:37:00Z"    |
- **Indexing Recommendations**:
  - Index on `organizer_id` for efficient retrieval of groups by organizer.
  - Index on `created_at` for sorting and filtering by creation date.

### 2. Custom Enum Types
- **Type: `group_member_role`**:
  ```sql
  CREATE TYPE public.group_member_role AS ENUM ('member', 'organizer', 'admin');
  ```
  - **Purpose**: Defines the roles a user can have within a group.
  - **Values**:
    - `member`: Default role for players who can view and register for events.
    - `organizer`: Role for the group creator.
    - `admin`: Role for users who can manage events (future functionality).
  - **Usage**: Used in `group_members.role` to specify the user's role in the group.

- **Type: `group_member_status`**:
  ```sql
  CREATE TYPE public.group_member_status AS ENUM ('active', 'pending', 'invited');
  ```
  - **Purpose**: Defines the status of a user's membership in a group.
  - **Values**:
    - `active`: Default status for members who can participate in events.
    - `pending`: Membership request pending approval (not used in this step).
    - `invited`: User has been invited but not yet joined (not used in this step).
  - **Usage**: Used in `group_members.status` to specify the membership status.

### 3. `group_members` Table
- **Purpose**: Tracks membership of users in groups, ensuring only group members with `role: 'member'` and `status: 'active'` can view events on the Calendar Page.
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
- **Constraints**:
  - `group_members_pkey`: Primary key on `id`.
  - `group_members_group_id_user_id_key`: Unique constraint on (`group_id`, `user_id`).
  - `group_members_group_id_fkey`: Foreign key to `groups(id)` with CASCADE delete.
  - `group_members_user_id_fkey`: Foreign key to `auth.users(id)` with CASCADE delete.
- **Relationships**:
  - Unique Key: (`group_id`, `user_id`) ensures a user can only be a member of a group once.
  - Foreign Key: `group_id` references `groups(id)`, `user_id` references `auth.users(id)`.
- **Usage**:
  - Validates that a user is part of the group with `role: 'member'` and `status: 'active'` before allowing access to the Calendar Page.
- **Example Entry**:
  | `id`               | `group_id`        | `user_id`         | `role`      | `status`   | `joined_at`               | `request_message`   |
  |--------------------|-------------------|-------------------|-------------|------------|---------------------------|---------------------|
  | `999e8888-e89b-12d3-a456-426614174000` | `456e7890-e89b-12d3-a456-426614174000` | `111e2223-e89b-12d3-a456-426614174000` | "member"    | "active"   | "2025-05-27T17:37:00Z"    | NULL                |
- **Indexing Recommendations**:
  - Index on `group_id` for efficient retrieval of members in a group.
  - Index on `user_id` for efficient retrieval of groups a user belongs to.
  - Index on `role` and `status` for efficient filtering by role and status.

### 4. `events` Table
- **Purpose**: Stores individual events within a group, providing the event details for display on the Calendar Page.
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
- **Relationships**:
  - Foreign Key: `group_id` references `groups(id)`, linking each event to its group.
- **Usage**:
  - Provides the event details for display on the Calendar Page.
  - The `registration_open` flag indicates whether players can join the event (used in a later step).
- **Example Entry**:
  | `id`               | `group_id`        | `event_title`    | `description`           | `event_date` | `event_time` | `location`         | `registration_open` | `created_at`              |
  |--------------------|-------------------|------------------|-------------------------|--------------|--------------|--------------------|---------------------|---------------------------|
  | `789e0123-e89b-12d3-a456-426614174000` | `456e7890-e89b-12d3-a456-426614174000` | "Week 1 Ladder Matchup" | "Competitive ladder..." | "2025-05-28" | "18:00"      | "Central Park Courts" | true                | "2025-05-27T17:37:00Z"    |
- **Indexing Recommendations**:
  - Index on `group_id` for efficient retrieval of events within a group.
  - Index on `event_date` and `event_time` for sorting events on the calendar.
  - Index on `registration_open` for efficient filtering of events open for registration.

### 5. `auth.users` Table
- **Purpose**: Stores core user authentication data, managed by Supabase Auth.
- **Table Design**:
  | Field Name      | Data Type   | Constraints/Description                                      |
  |-----------------|-------------|-------------------------------------------------------------|
  | `id`            | UUID        | Primary Key, auto-generated                                 |
  | `email`         | TEXT        | NOT NULL, unique                                            |
- **Usage**:
  - Managed by Supabase Auth to handle user authentication.
  - Linked to the `group_members` table via the `user_id` field.
- **Example Entry**:
  | `id`               | `email`             |
  |--------------------|---------------------|
  | `111e2223-e89b-12d3-a456-426614174000` | "john.doe@example.com" |

## Calendar Page and Event Display
- **Access**: Group members (with `role: 'member'` and `status: 'active'` in `group_members`) can access a Calendar Page displaying all events for the current group ("Pickle Pros," ID 456).
- **Functionality**:
  - The Calendar Page fetches events from the `events` table, filtered by the group (`group_id: 456`).
  - Events are displayed with basic details: `event_title`, `event_date`, `event_time`, `location`, and a status indicator (e.g., "Registration Open" if `registration_open` is true).
  - Clicking an event navigates to the Event Details page (implemented in the next step).
- **Query Example**:
  ```sql
  SELECT e.id, e.event_title, e.event_date, e.event_time, e.location, e.registration_open
  FROM events e
  WHERE e.group_id = :group_id
    AND e.event_date >= CURRENT_DATE
  ORDER BY e.event_date, e.event_time;
  ```
- **Mobile-First UI/UX Recommendations**:
  - **Layout**: Single-column layout with a sticky header showing the group name ("Pickle Pros") and a sticky footer with a "Back to Group" button (48x48px touch target). The calendar view occupies the full viewport width (e.g., 360px).
  - **Calendar View**: Use a simplified list view instead of a grid calendar to minimize scrolling on mobile. Events are displayed as cards in chronological order (sorted by `event_date` and `event_time`).
    - Each event card shows: Title (e.g., "Week 1 Ladder Matchup"), Date (e.g., "May 28, 2025"), Time (e.g., "18:00"), Location (e.g., "Central Park Courts"), and Status (e.g., "Registration Open" in green; "Closed" in red).
    - Card height: ~80px, with 16px padding, 16px font size, and a subtle border (1px solid #ddd).
    - Add a "Current Event" badge (e.g., green dot) for the nearest upcoming event after 2025-05-27 17:37 PM MST.
  - **Interaction**: Tapping an event card navigates to the Event Details page (to be implemented in the next step). Cards are touch-friendly with a 48px touch target (entire card tappable).
  - **Onboarding**: Tooltip on first load: "View upcoming events for your group. Tap an event to see details and register!" (dismissible with "Don't Show Again").
  - **Pull-to-Refresh**: Implement a pull-to-refresh gesture to reload events, ensuring real-time updates (e.g., if `registration_open` changes).
  - **Error Handling**: If no events are found, display a centered message: "No upcoming events. Check back later!" with 16px font size.

---

## Implementation Breakdown - Smaller Steps

Based on the requirements above, here's the breakdown into smaller, manageable steps to avoid breaking the website:

### Step 1A: Update Calendar Tab UI (SAFE - UI Only)
**What**: Enhance the existing GroupCalendarTab component to display events in a list view
**Files to modify**: `src/components/groups/mobile/GroupCalendarTab.tsx`
**Risk**: Low - only UI changes to existing component
**Changes**:
- Replace the "No events scheduled" placeholder with event list UI
- Add event card components with proper mobile-first styling
- Implement proper loading and error states

### Step 1B: Create Event Data Fetching Hook (SAFE - New Hook)
**What**: Create a custom hook to fetch events for a group
**Files to create**: `src/components/groups/events/hooks/useGroupEvents.ts`
**Risk**: Low - new isolated hook, no existing functionality modified
**Changes**:
- Create hook using React Query for event fetching
- Include proper TypeScript types
- Handle loading, error, and success states

### Step 1C: Create Event Card Component (SAFE - New Component)
**What**: Create reusable event card component
**Files to create**: `src/components/groups/events/EventCard.tsx`
**Risk**: Low - new isolated component
**Changes**:
- Mobile-first design with 80px height, 16px padding
- Touch-friendly 48px target
- Status indicators for registration

### Step 1D: Add Event List Container (SAFE - New Component)
**What**: Create container component to manage event list state
**Files to create**: `src/components/groups/events/EventsList.tsx`
**Risk**: Low - new isolated component
**Changes**:
- Integrate event fetching hook
- Handle empty states
- Implement pull-to-refresh

### Step 1E: Update Database Types (SAFE - Type Updates)
**What**: Ensure TypeScript types match the database schema
**Files to check/update**: `src/integrations/supabase/types.ts`
**Risk**: Very Low - type-only changes
**Changes**:
- Verify event table types match requirements
- Add any missing type definitions

### Step 1F: Integration Testing (SAFE - Connect Components)
**What**: Connect all components in GroupCalendarTab
**Files to modify**: `src/components/groups/mobile/GroupCalendarTab.tsx`
**Risk**: Low - controlled integration
**Changes**:
- Replace placeholder with EventsList component
- Test with existing event data
- Ensure proper mobile layout

---

## Notes for Implementation
- All database tables mentioned already exist based on the current codebase
- Focus on UI/UX first, then data integration
- Each step is designed to be independently testable
- No breaking changes to existing event creation functionality
- Mobile-first approach ensures compatibility across devices

**Ready for implementation. Please specify which step you'd like to start with.**

## Context for AI Assistant

### Current Project State
This is a React application built with Vite, TypeScript, Tailwind CSS, and Supabase integration. The project already has:

1. **Authentication System**: Fully implemented with Supabase Auth
2. **Group Management**: Users can create/join groups, with role-based permissions
3. **Event Creation Wizard**: Multi-step wizard for creating events within groups
4. **Database Schema**: All required tables exist (groups, group_members, events, profiles, etc.)
5. **Mobile-First Design**: Responsive layout with bottom navigation and mobile optimization

### Key Components Already Implemented
- `GroupCalendarTab`: Currently shows placeholder "No events scheduled"
- `EventCreationWizard`: Full wizard for creating events
- Group membership and role management
- Mobile navigation and responsive design
- Database integration with proper TypeScript types

### What's Needed
The Calendar Page functionality to display existing events in a mobile-optimized list view. The event creation is working, but viewing created events is not yet implemented.

### Architecture Guidelines
- Use existing patterns (React Query, TypeScript, mobile-first design)
- Follow established file structure under `src/components/groups/`
- Maintain consistency with existing UI components
- Use database types from `src/integrations/supabase/types.ts`
- Keep components small and focused (50 lines or less when possible)

This context should help you understand the current state and make informed decisions about implementation without breaking existing functionality.
