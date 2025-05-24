
// Phase 3: Legacy wrapper functions for backward compatibility
// These will be removed in Phase 4

import { fetchAllGroupsOptimized, fetchUserMembershipsOptimized } from "./groupDataUtils";

/**
 * @deprecated Use fetchAllGroupsOptimized from groupDataUtils instead
 * A utility function to fetch all groups
 */
export const fetchAllGroups = async () => {
  console.warn("fetchAllGroups is deprecated. Use fetchAllGroupsOptimized from groupDataUtils instead.");
  return fetchAllGroupsOptimized();
};

/**
 * @deprecated Use fetchUserMembershipsOptimized from groupDataUtils instead
 * A utility function to fetch groups where user is a member
 */
export const fetchUserMemberships = async (userId: string) => {
  console.warn("fetchUserMemberships is deprecated. Use fetchUserMembershipsOptimized from groupDataUtils instead.");
  return fetchUserMembershipsOptimized(userId);
};
