
# Facebook-Style Activity2 Tab Implementation Plan

## Overview
Build a complete Facebook-style activity feed as "activity2" tab, completely independent from existing activity code. Every component will be built from scratch to avoid any dependency conflicts.

## Implementation Steps (Broken Down to Smallest Safe Steps)

### Step 1: Add Activity2 Tab (5 mins)
**Goal:** Add new tab option without breaking existing functionality
**Files to modify:**
- `src/components/groups/mobile/GroupHorizontalTabs.tsx` - Add activity2 tab
- `src/components/groups/details/GroupDetailsContent.tsx` - Add routing case

**What we're doing:**
- Add "activity2" option to tabs array
- Add switch case for "activity2" in content renderer
- Test that tab appears and doesn't break anything

### Step 2: Create Empty Activity2Tab Container (10 mins)
**Goal:** Create basic container that renders without errors
**Files to create:**
- `src/components/groups/mobile/Activity2Tab.tsx`

**What we're doing:**
- Create simple container with proper TypeScript types
- Accept same props as other tabs for consistency
- Render "Activity2 Coming Soon" placeholder
- Verify it renders without errors

### Step 3: Create Facebook-Style Layout Structure (15 mins)
**Goal:** Build the main layout container with Facebook styling
**Files to modify:**
- `src/components/groups/mobile/Activity2Tab.tsx`

**What we're doing:**
- Add proper container styling (white background, padding)
- Create sections for: header, create post, posts list
- Add Facebook-style spacing and layout structure
- No functionality yet, just visual structure

### Step 4: Build Basic Facebook Create Post Component (20 mins)
**Goal:** Create post creation component with Facebook visual style
**Files to create:**
- `src/components/groups/mobile/FacebookCreatePost.tsx`

**What we're doing:**
- Card container with subtle border
- User avatar placeholder + "What's on your mind?" text
- No functionality yet, just visual Facebook-style layout
- Add to Activity2Tab to test rendering

### Step 5: Add Create Post Functionality (25 mins)
**Goal:** Make create post actually work
**Files to modify:**
- `src/components/groups/mobile/FacebookCreatePost.tsx`

**What we're doing:**
- Add expandable textarea
- Add state management for post content
- Add submit functionality using existing post creation hooks
- Test that posts can be created successfully

### Step 6: Create Basic Facebook Post Card Component (20 mins)
**Goal:** Create post display component with Facebook visual style
**Files to create:**
- `src/components/groups/mobile/FacebookPostCard.tsx`

**What we're doing:**
- Clean card design (white background, subtle border)
- Header with user info and timestamp
- Content area without background bubbles
- No interactions yet, just visual layout

### Step 7: Add Posts List to Activity2Tab (15 mins)
**Goal:** Display posts using new Facebook-style cards
**Files to modify:**
- `src/components/groups/mobile/Activity2Tab.tsx`

**What we're doing:**
- Create posts fetching logic (copy from existing but independent)
- Map through posts using FacebookPostCard
- Test that posts display correctly

### Step 8: Create Facebook Reaction Summary Component (20 mins)
**Goal:** Show reaction counts above action buttons
**Files to create:**
- `src/components/groups/mobile/FacebookReactionSummary.tsx`

**What we're doing:**
- Component to show "👍 You and 5 others" style display
- Handle different reaction types and counts
- Add to FacebookPostCard above action area

### Step 9: Create Facebook Action Bar Component (25 mins)
**Goal:** Create simplified action bar with Like, Comment, Share
**Files to create:**
- `src/components/groups/mobile/FacebookActionBar.tsx`

**What we're doing:**
- Single "Like" button (not separate thumbs up/down/heart)
- Comment button
- Share button (placeholder for now)
- Facebook-style button design and spacing

### Step 10: Add Like Functionality to Action Bar (20 mins)
**Goal:** Make Like button work with reactions
**Files to modify:**
- `src/components/groups/mobile/FacebookActionBar.tsx`

**What we're doing:**
- Connect Like button to reaction system
- Toggle like state when clicked
- Update reaction summary when liked/unliked
- Use existing reaction hooks but independently

### Step 11: Create Facebook Comments Component (30 mins)
**Goal:** Create Facebook-style comments section
**Files to create:**
- `src/components/groups/mobile/FacebookComments.tsx`
- `src/components/groups/mobile/FacebookCommentCard.tsx`

**What we're doing:**
- Comments list with Facebook styling
- Individual comment cards with clean design
- Comment form at bottom
- No advanced features yet, just basic display

### Step 12: Add Comments Functionality (25 mins)
**Goal:** Make comments actually work
**Files to modify:**
- `src/components/groups/mobile/FacebookComments.tsx`
- `src/components/groups/mobile/FacebookCommentCard.tsx`

**What we're doing:**
- Connect to existing comment hooks independently
- Add comment submission
- Display existing comments
- Test comment creation and display

### Step 13: Integrate Comments into Post Cards (10 mins)
**Goal:** Add comments to Facebook post cards
**Files to modify:**
- `src/components/groups/mobile/FacebookPostCard.tsx`

**What we're doing:**
- Add FacebookComments component to post cards
- Show/hide comments when Comment button clicked
- Test comment toggling and display

### Step 14: Add Action Icons and Polish (15 mins)
**Goal:** Add proper icons and final visual polish
**Files to modify:**
- `src/components/groups/mobile/FacebookActionBar.tsx`
- `src/components/groups/mobile/FacebookCreatePost.tsx`

**What we're doing:**
- Add thumbs-up, message-square, share icons
- Add camera, image icons to create post
- Fine-tune spacing, colors, typography
- Test on mobile viewport

### Step 15: Add Loading and Error States (20 mins)
**Goal:** Handle loading and error states properly
**Files to modify:**
- `src/components/groups/mobile/Activity2Tab.tsx`

**What we're doing:**
- Add loading skeletons for posts
- Add error handling for failed requests
- Test loading states and error scenarios

### Step 16: Final Mobile Responsiveness Check (10 mins)
**Goal:** Ensure everything works perfectly on mobile
**Files to check:**
- All Activity2 components

**What we're doing:**
- Test touch targets (44px minimum)
- Test scrolling and interactions
- Verify responsive layout
- Test on different screen sizes

## Total Estimated Time: 5 hours

## Safety Measures
- Each step builds on the previous without breaking existing functionality
- Every component is completely independent of existing activity code
- Can test after each step to ensure no errors
- If any step fails, can rollback without affecting existing activity tab

## Files That Will Be Created (New Files Only)
- `src/components/groups/mobile/Activity2Tab.tsx`
- `src/components/groups/mobile/FacebookCreatePost.tsx`
- `src/components/groups/mobile/FacebookPostCard.tsx`
- `src/components/groups/mobile/FacebookReactionSummary.tsx`
- `src/components/groups/mobile/FacebookActionBar.tsx`
- `src/components/groups/mobile/FacebookComments.tsx`
- `src/components/groups/mobile/FacebookCommentCard.tsx`

## Files That Will Be Modified (Minimal Changes)
- `src/components/groups/mobile/GroupHorizontalTabs.tsx` (add one tab)
- `src/components/groups/details/GroupDetailsContent.tsx` (add one route case)

## Post-Implementation
Once activity2 is working perfectly and user approves:
- Can safely remove "home2" tab from GroupHorizontalTabs
- Can remove MobileHome2Tab.tsx and related files
- Can rename "activity2" to "activity" if desired
- Zero risk of breaking anything due to complete code separation
