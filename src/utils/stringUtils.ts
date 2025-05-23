
/**
 * Get initials from a name (up to 2 letters)
 */
export const getInitialsFromName = (name: string): string => {
  if (!name) return '?';
  
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Add an alias for backward compatibility
export const getInitials = getInitialsFromName;
