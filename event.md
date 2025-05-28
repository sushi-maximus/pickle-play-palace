
# Pickle Ninja Implementation Prompt: Step 3 - Advanced Registration Features

## Overview
This is Step 3 of the Pickle Ninja player registration system, building upon the basic registration functionality from Step 2. This step implements advanced registration features including waitlist promotion, batch confirmation, court assignments, email notifications, and registration deadline management.

**Prerequisites:** 
- Step 1: Calendar Page (completed)
- Step 2: Basic Registration (completed)
- Database tables: `player_status`, `events`, `groups`, `group_members`, `profiles` (existing)

## Step 3A: Automatic Waitlist Promotion (Split into Sub-Steps)

### Step 3A-1: Database Schema Updates for Promotion Tracking

**Purpose**: Add necessary database fields to track promotion history and batch information.

**Database Requirements**:
```sql
-- Add batch tracking to player_status table
ALTER TABLE public.player_status 
ADD COLUMN batch_id UUID DEFAULT NULL,
ADD COLUMN promoted_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN promotion_reason TEXT DEFAULT NULL;

-- Create indexes for performance
CREATE INDEX idx_player_status_batch_id ON public.player_status(batch_id);
CREATE INDEX idx_player_status_promoted_at ON public.player_status(promoted_at);
CREATE INDEX idx_player_status_event_status ON public.player_status(event_id, status);
```

**Implementation Focus**:
- Only add database fields needed for promotion tracking
- No business logic changes in this step
- Focus on data structure preparation

**Testing**:
- Verify new columns added successfully
- Check that existing registrations still work
- Confirm indexes improve query performance

---

### Step 3A-2: Basic Promotion Logic in Registration Service

**Purpose**: Extend existing `playerRegistrationService.ts` with basic promotion logic when players cancel.

**Implementation Details**:
- Modify the `cancelRegistration` method to include promotion logic
- Add a new `promoteWaitlistPlayers` method
- Keep changes minimal and focused on core promotion functionality

**Key Functions to Add**:
```typescript
// In playerRegistrationService.ts
async promoteWaitlistPlayers(eventId: string, slotsAvailable: number): Promise<PromotionResult[]>
async updatePlayerStatus(playerId: string, eventId: string, newStatus: string, promotionReason?: string): Promise<boolean>
```

**Testing Scenarios**:
1. Cancel confirmed player → verify first waitlist player promoted
2. Cancel multiple players → verify correct number promoted in order
3. Empty waitlist → verify no errors when promoting

---

### Step 3A-3: Advanced Promotion Edge Function

**Purpose**: Create dedicated Supabase Edge Function for complex promotion scenarios and batch operations.

**Edge Function**: `promote-waitlist-players`
**Location**: `supabase/functions/promote-waitlist-players/index.ts`

**Functionality**:
- Handle bulk promotions
- Manage promotion notifications
- Process complex ranking updates
- Handle edge cases (simultaneous cancellations, etc.)

**Triggers**:
- Called by `playerRegistrationService` when cancellations occur
- Can be called manually by organizers
- Handles batch promotions when multiple slots open

**Implementation Focus**:
- Complex promotion algorithms
- Batch processing capabilities
- Error handling for edge cases
- Logging for debugging

---

### Step 3A-4: Frontend Promotion Indicators

**Purpose**: Add UI components to show promotion status and history.

**Components to Create**:
- `PromotionBadge.tsx` - Shows "Recently Promoted" status
- `PromotionHistory.tsx` - Displays promotion timeline
- Update `PlayersList.tsx` to show promotion indicators
- Update `EventRegistrationStatus.tsx` for promotion states

**UI Features**:
- Visual indicators for recently promoted players
- Promotion timestamps in player lists
- Promotion reason display
- Smooth transitions for status changes

**Implementation Focus**:
- Only UI changes, no business logic
- Use existing components where possible
- Mobile-first responsive design
- Consistent with existing design system

---

### Step 3A-5: Integration Testing and Refinement

**Purpose**: Comprehensive testing of the complete promotion system.

**Testing Matrix**:
```
Scenario 1: Single player cancellation
- Setup: Event with 4 confirmed, 3 waitlisted
- Action: 1 confirmed player cancels
- Expected: 1st waitlisted player promoted
- Verify: UI updates, notifications sent, database correct

Scenario 2: Multiple simultaneous cancellations
- Setup: Event with 8 confirmed, 5 waitlisted  
- Action: 3 confirmed players cancel within 1 minute
- Expected: 3 waitlisted players promoted in order
- Verify: Correct ranking order maintained

Scenario 3: Edge cases
- Empty waitlist cancellation
- Promotion during registration deadline
- Simultaneous registration and cancellation
```

**Performance Testing**:
- Load testing with 100+ players
- Concurrent cancellation handling
- Database query optimization verification

**Error Handling**:
- Failed promotion rollback
- Notification delivery failures
- Database constraint violations

---

## Implementation Order for Step 3A

1. **Start with Step 3A-1**: Database schema (safe, isolated change)
2. **Step 3A-2**: Basic service logic (core functionality)
3. **Step 3A-4**: Frontend indicators (visible progress)
4. **Step 3A-3**: Advanced Edge Function (complex scenarios)
5. **Step 3A-5**: Integration testing (validation)

## Benefits of This Approach

**Error Isolation**: Each step can be tested independently
**Incremental Progress**: Users see improvements at each step
**Easier Rollbacks**: Smaller changes are easier to revert
**Code Review**: Smaller changes are easier to review
**Debugging**: Issues are easier to isolate and fix

---

## Step 3B: Batch Confirmation Logic

### Database Requirements
```sql
-- Create batch_confirmations table
CREATE TABLE public.batch_confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  batch_number INTEGER NOT NULL,
  confirmed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  player_count INTEGER NOT NULL DEFAULT 0,
  court_assignments JSONB DEFAULT NULL,
  UNIQUE(event_id, batch_number)
);

-- Add batch status tracking to events
ALTER TABLE public.events 
ADD COLUMN current_batch_number INTEGER DEFAULT 0,
ADD COLUMN last_batch_confirmed_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN next_batch_size INTEGER DEFAULT 4;

-- Create batch_rules table
CREATE TABLE public.batch_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  min_players_per_batch INTEGER NOT NULL DEFAULT 4,
  max_players_per_batch INTEGER NOT NULL DEFAULT 4,
  auto_confirm_enabled BOOLEAN NOT NULL DEFAULT true,
  confirmation_delay_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_batch_confirmations_event_id ON public.batch_confirmations(event_id);
```

### Implementation Details

#### Supabase Edge Function: `process-batch-confirmation`
```typescript
// Location: supabase/functions/process-batch-confirmation/index.ts
// Triggers: When player registers and waitlist reaches batch size
// Logic:
//   1. Check if waitlist has enough players for a batch (default: 4)
//   2. Select oldest waitlisted players by registration_timestamp
//   3. Move them to confirmed status
//   4. Assign batch_id and update ranking_order
//   5. Create batch_confirmations record
//   6. Send batch confirmation emails
//   7. Check if ready for court assignments
```

#### Frontend Features
- **Batch Status Display**: Show current batch progress (e.g., "Batch 3: 4/4 confirmed")
- **Batch Timeline**: Visual timeline showing batch confirmation history
- **Admin Controls**: Allow organizers to manually trigger batch confirmations
- **Batch Players View**: Group players by batch in the confirmed list

#### UI Components
```typescript
// src/components/groups/events/batch/BatchProgress.tsx
// Shows progress bar for current batch filling up

// src/components/groups/events/batch/BatchTimeline.tsx
// Visual timeline of all batch confirmations

// src/components/groups/events/batch/BatchManagement.tsx
// Admin controls for batch operations
```

#### Testing Scenarios
1. **Auto Batch Confirmation**: Register 4th player → verify batch auto-confirms
2. **Manual Batch Confirmation**: Admin manually confirms partial batch
3. **Batch Size Variations**: Test with different batch sizes (2, 4, 6, 8 players)
4. **Multiple Batches**: Register 12 players → verify 3 batches of 4 created
5. **Partial Batches**: Handle events with non-multiple-of-4 registrations

---

## Step 3C: Court Assignment System

### Database Requirements
```sql
-- Create courts table
CREATE TABLE public.courts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  court_number INTEGER NOT NULL,
  court_name TEXT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  surface_type TEXT DEFAULT 'outdoor',
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, court_number)
);

-- Create court_assignments table
CREATE TABLE public.court_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  court_id UUID NOT NULL REFERENCES public.courts(id) ON DELETE CASCADE,
  batch_id UUID NOT NULL REFERENCES public.batch_confirmations(id) ON DELETE CASCADE,
  player_ids UUID[] NOT NULL,
  assignment_method TEXT NOT NULL DEFAULT 'automatic',
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  round_number INTEGER DEFAULT 1,
  match_duration_minutes INTEGER DEFAULT 60
);

-- Create indexes
CREATE INDEX idx_courts_event_id ON public.courts(event_id);
CREATE INDEX idx_court_assignments_event_id ON public.court_assignments(event_id);
CREATE INDEX idx_court_assignments_court_id ON public.court_assignments(court_id);
```

### Implementation Details

#### Supabase Edge Function: `assign-courts`
```typescript
// Location: supabase/functions/assign-courts/index.ts
// Triggers: When batch is confirmed and courts are available
// Logic:
//   1. Get available courts for the event
//   2. Calculate optimal court assignments based on:
//      - Player skill levels and rankings
//      - Court availability and capacity
//      - Balancing algorithm (skill-based grouping)
//   3. Create court_assignments records
//   4. Update player_status with court assignments
//   5. Send court assignment notifications
```

#### Frontend Features
- **Court Setup Interface**: Organizers define available courts before event
- **Assignment Visualization**: Visual court layout showing player assignments
- **Manual Reassignment**: Drag-and-drop interface for manual court changes
- **Court Status Dashboard**: Real-time view of all court assignments

#### Assignment Algorithms
1. **Skill-Based**: Group players by similar skill levels
2. **Random**: Random assignment within confirmed batches
3. **Balanced**: Mix skill levels for competitive balance
4. **Manual**: Full organizer control over assignments

#### Testing Scenarios
1. **Basic Assignment**: 4 courts, 16 players → verify 4 players per court
2. **Skill Grouping**: Verify similar skill levels grouped together
3. **Court Overflow**: More players than courts → verify waitlist handling
4. **Manual Reassignment**: Drag player to different court → verify update
5. **Court Unavailability**: Mark court unavailable → verify reassignment

---

## Step 3D: Full Email Notification System

### Database Requirements
```sql
-- Create notification_templates table
CREATE TABLE public.notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT NOT NULL UNIQUE,
  subject_template TEXT NOT NULL,
  body_template TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create notification_logs table
CREATE TABLE public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  event_id UUID NOT NULL REFERENCES public.events(id),
  notification_type TEXT NOT NULL,
  template_used TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'sent',
  error_message TEXT DEFAULT NULL,
  email_address TEXT NOT NULL
);

-- Insert default templates
INSERT INTO public.notification_templates (template_name, subject_template, body_template) VALUES
('registration_confirmed', 'Registration Confirmed: {{event_title}}', 'You are confirmed for {{event_title}} on {{event_date}} at {{event_time}}...'),
('waitlist_added', 'Added to Waitlist: {{event_title}}', 'You have been added to the waitlist for {{event_title}}...'),
('waitlist_promoted', 'Confirmed! Promoted from Waitlist: {{event_title}}', 'Great news! You have been confirmed for {{event_title}}...'),
('batch_confirmed', 'Batch Confirmed: {{event_title}}', 'Your batch has been confirmed for {{event_title}}...'),
('court_assigned', 'Court Assignment: {{event_title}}', 'You have been assigned to Court {{court_number}} for {{event_title}}...'),
('registration_cancelled', 'Registration Cancelled: {{event_title}}', 'Your registration for {{event_title}} has been cancelled...');
```

### Implementation Details

#### Supabase Edge Function: `send-event-notifications`
```typescript
// Location: supabase/functions/send-event-notifications/index.ts
// Requires: RESEND_API_KEY secret
// Triggers: All registration state changes
// Logic:
//   1. Receive notification request with type and user/event data
//   2. Load appropriate email template
//   3. Replace template variables with actual data
//   4. Send email via Resend API
//   5. Log notification attempt
//   6. Handle delivery errors gracefully
```

#### Notification Triggers
- **Registration Confirmed**: When player moves from waitlist to confirmed
- **Waitlist Added**: When player initially registers but goes to waitlist
- **Waitlist Promoted**: When waitlisted player gets promoted to confirmed
- **Batch Confirmed**: When entire batch gets confirmed together
- **Court Assigned**: When court assignments are made
- **Registration Cancelled**: When player cancels their registration
- **Event Reminder**: 24 hours before event starts
- **Final Details**: 2 hours before event starts

#### Frontend Features
- **Email Preferences**: Players can customize notification preferences
- **Notification History**: Players can view their notification history
- **Template Management**: Organizers can customize email templates
- **Delivery Status**: Real-time delivery status for organizers

#### Testing Scenarios
1. **Registration Flow**: Register → verify confirmation email received
2. **Waitlist Flow**: Join waitlist → verify waitlist email → get promoted → verify promotion email
3. **Batch Confirmation**: 4th player joins → verify all 4 get batch confirmation emails
4. **Court Assignment**: Courts assigned → verify court assignment emails
5. **Email Delivery**: Test with invalid email → verify error logging
6. **Template Variables**: Verify all {{variables}} replaced correctly

---

## Step 3E: Registration Deadline Management

### Database Requirements
```sql
-- Add deadline fields to events table
ALTER TABLE public.events 
ADD COLUMN registration_deadline TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN early_bird_deadline TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN late_registration_allowed BOOLEAN DEFAULT false,
ADD COLUMN late_registration_fee DECIMAL DEFAULT NULL,
ADD COLUMN auto_close_registration BOOLEAN DEFAULT true;

-- Create registration_periods table
CREATE TABLE public.registration_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  period_name TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  base_fee DECIMAL DEFAULT NULL,
  additional_fee DECIMAL DEFAULT NULL,
  max_registrations INTEGER DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);
```

### Implementation Details

#### Supabase Edge Function: `manage-registration-deadlines`
```typescript
// Location: supabase/functions/manage-registration-deadlines/index.ts
// Triggers: Cron job every 15 minutes
// Logic:
//   1. Check all events for approaching deadlines
//   2. Send deadline reminder emails (24h, 6h, 1h before)
//   3. Auto-close registration when deadline reached
//   4. Handle late registration requests if allowed
//   5. Apply late registration fees
//   6. Update registration_open status
```

#### Cron Job Setup
```sql
-- Schedule deadline management to run every 15 minutes
SELECT cron.schedule(
  'manage-registration-deadlines',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url:='https://tkqiklfpleoiupgfvsxp.supabase.co/functions/v1/manage-registration-deadlines',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
    body:='{"scheduled": true}'::jsonb
  ) as request_id;
  $$
);
```

#### Frontend Features
- **Deadline Display**: Countdown timers showing time until deadline
- **Late Registration**: Interface for late registration with fee display
- **Deadline Management**: Organizer tools to set and modify deadlines
- **Registration Status**: Clear indicators when registration is closed

#### Deadline Types
1. **Early Bird**: Discounted registration period
2. **Regular**: Standard registration period
3. **Late**: Higher fee registration period (optional)
4. **Final**: Hard deadline, no registrations accepted

#### Testing Scenarios
1. **Deadline Countdown**: Verify countdown displays correctly
2. **Auto-Close**: Set deadline 1 minute away → verify auto-closure
3. **Late Registration**: After deadline → verify late fee applied
4. **Reminder Emails**: Test 24h, 6h, 1h deadline reminders
5. **No Late Registration**: Verify hard deadline enforcement
6. **Multiple Periods**: Test early bird → regular → late transitions

---

## Implementation Order Recommendation

1. **Step 3A (Waitlist Promotion)**: Foundation for advanced features
   - Start with 3A-1 (Database schema)
   - Then 3A-2 (Basic service logic)
   - Continue with remaining sub-steps
2. **Step 3B (Batch Confirmation)**: Builds on promotion logic
3. **Step 3D (Email Notifications)**: Essential for user communication
4. **Step 3C (Court Assignment)**: Complex feature, implement after others stable
5. **Step 3E (Registration Deadlines)**: Final polish feature

## Testing Integration Points

### Cross-Feature Testing
- **Promotion + Notifications**: Waitlist promotion triggers correct emails
- **Batch + Court Assignment**: Confirmed batches get court assignments
- **Deadline + All Features**: Deadline enforcement affects all registration flows
- **Cancellation + Promotion + Notification**: Full cancellation → promotion → email flow

### Performance Considerations
- **Database Indexes**: Ensure all queries are properly indexed
- **Email Rate Limits**: Handle Resend API rate limits gracefully
- **Cron Job Efficiency**: Minimize cron job execution time
- **Real-time Updates**: Use Supabase realtime for live UI updates

### Error Handling
- **Email Delivery Failures**: Queue and retry failed email sends
- **Court Assignment Conflicts**: Handle double-bookings gracefully
- **Deadline Race Conditions**: Prevent registration after deadline in edge cases
- **Batch Confirmation Errors**: Rollback failed batch confirmations

This comprehensive implementation plan provides a robust, scalable registration system that handles complex scenarios while maintaining excellent user experience.
