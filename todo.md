
# TODO List - Advanced Event Registration System

## Current Status
✅ **Phase 4 Complete**: Basic promotion validation and database schema integration
- Native database types implemented
- Promotion tracking fields active
- Component validation complete

## Advanced Registration Features (Priority Order)

### 1. Batch Confirmation Logic
**Status**: Not Implemented
**Priority**: High

**What it is:**
Batch confirmation is a system that automatically groups and confirms players in predefined batches (typically 4 players for pickleball). Instead of confirming players individually, the system waits until enough players register and then confirms them all together as a "batch."

**How it works:**
- **Waitlist Accumulation**: When players register for a full event, they go to a waitlist
- **Batch Size Monitoring**: The system monitors when the waitlist reaches the batch size (default: 4 players)
- **Automatic Confirmation**: Once 4 players are waitlisted, they're automatically moved to "confirmed" status as a group
- **Batch Tracking**: Each batch gets a unique ID and timestamp for organization
- **Court Assignment Ready**: Confirmed batches become eligible for court assignments

**Implementation approach:**
- **Database**: Add batch_id, current_batch_number to track batches
- **Edge Function**: process-batch-confirmation that triggers when batch size is reached
- **Frontend**: Batch progress indicators showing "Batch 3: 4/4 confirmed"
- **Logic Flow**: Registration → Waitlist → Batch Formation → Batch Confirmation → Court Assignment

### 2. Full Email Notification System
**Status**: Not Implemented
**Priority**: High

**What it is:**
A comprehensive email system that automatically sends notifications for every registration state change and event milestone. It uses templated emails with variable substitution and tracks delivery status.

**How it works:**
- **Template System**: Pre-defined email templates with placeholders like {{event_title}}, {{event_date}}
- **Trigger Events**: Every registration action triggers appropriate notifications
- **Variable Replacement**: Templates are populated with actual event/player data
- **Delivery Tracking**: All emails are logged with delivery status and error handling
- **Multiple Notification Types**: Different emails for different scenarios

**Notification triggers include:**
- Registration Confirmed: "You're confirmed for [Event]"
- Waitlist Added: "You've been added to the waitlist"
- Waitlist Promoted: "Great news! You've been confirmed"
- Batch Confirmed: "Your batch has been confirmed"
- Court Assigned: "You're assigned to Court 2"
- Registration Cancelled: "Your registration has been cancelled"
- Reminders: 24h and 2h before event

**Implementation approach:**
- **Database**: notification_templates and notification_logs tables
- **Edge Function**: send-event-notifications using Resend API
- **Integration**: Hooks into all registration state changes
- **Error Handling**: Retry failed emails, log delivery status

### 3. Registration Deadline Management
**Status**: Not Implemented
**Priority**: Medium

**What it is:**
A time-based system that automatically manages registration windows, enforces deadlines, applies late fees, and closes registration when deadlines are reached.

**How it works:**
- **Multiple Registration Periods**: Early bird → Regular → Late → Closed
- **Automated Monitoring**: Cron job checks deadlines every 15 minutes
- **Progressive Reminders**: Emails sent at 24h, 6h, 1h before deadline
- **Automatic Closure**: Registration automatically closes at deadline
- **Late Fee Handling**: Optional late registration with additional fees
- **Real-time Countdown**: Frontend shows time remaining

**Registration periods:**
- **Early Bird**: Discounted rate (e.g., $15 vs $20)
- **Regular**: Standard registration period
- **Late**: Higher fee period (e.g., $25) if enabled
- **Closed**: Hard deadline, no registrations accepted

**Implementation approach:**
- **Database**: Add deadline fields to events, registration_periods table
- **Cron Job**: manage-registration-deadlines runs every 15 minutes
- **Frontend**: Countdown timers, late registration interfaces
- **Automation**: Status changes, fee calculations, reminder emails

## How These Features Work Together

The three systems integrate seamlessly:
1. **Deadline management** controls when registrations can happen
2. **Batch confirmation** organizes players into manageable groups
3. **Email notifications** keep everyone informed throughout the process

This creates a fully automated, professional registration experience that requires minimal manual intervention while providing excellent user communication.

---

## Systematic Feature Development Template

### Phase 1: Database Schema Design
- [ ] Review existing schema compatibility
- [ ] Design new tables and relationships
- [ ] Plan migration strategy
- [ ] Create SQL migration files

### Phase 2: Type System Integration
- [ ] Update TypeScript types to match database schema
- [ ] Ensure native database type usage
- [ ] Remove any custom type definitions that duplicate database types
- [ ] Validate type imports across components

### Phase 3: Backend Service Implementation
- [ ] Create edge functions for complex logic
- [ ] Implement service layer functions
- [ ] Add proper error handling and logging
- [ ] Set up cron jobs if needed

### Phase 4: Frontend Component Development
- [ ] Create focused, small components (50 lines or less)
- [ ] Implement hooks for data fetching and state management
- [ ] Add proper loading and error states
- [ ] Ensure mobile-first responsive design

### Phase 5: Validation and Testing
- [ ] Create validation test components
- [ ] Add comprehensive logging for debugging
- [ ] Test all user flows and edge cases
- [ ] Verify database integration

### Phase 6: Integration and Polish
- [ ] Integrate all components into main application flow
- [ ] Add proper error boundaries
- [ ] Implement user feedback (toasts, notifications)
- [ ] Final testing and optimization

---

## Current File Structure Notes

### Files that may need refactoring (getting large):
- `src/components/groups/events/services/playerRegistrationService.ts` (340+ lines)
- Consider breaking into smaller, focused service files

### Recent Successful Patterns:
- Using native database types from `@/integrations/supabase/types`
- Small, focused components with single responsibilities
- Proper promotion tracking with `promoted_at` and `promotion_reason` fields
- Comprehensive logging for debugging complex flows

### Next Steps:
1. Choose which advanced feature to implement first
2. Follow the systematic development template
3. Start with Phase 1 (Database Schema Design)
4. Get user approval before proceeding to next phase

---

## Technical Debt and Maintenance

### Regular Maintenance Tasks:
- [ ] Review and refactor large files (>200 lines)
- [ ] Update TypeScript types when database schema changes
- [ ] Clean up unused imports and dead code
- [ ] Ensure all components follow mobile-first design principles
- [ ] Verify all error boundaries are in place

### Performance Considerations:
- [ ] Implement proper caching strategies
- [ ] Use React.memo() for expensive components
- [ ] Optimize database queries
- [ ] Consider implementing optimistic updates
