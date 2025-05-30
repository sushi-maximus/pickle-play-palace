
import { format, parseISO, isValid, parse } from "date-fns";

/**
 * Formats a date for display in the UI (e.g., "MMM d, yyyy")
 */
export const formatDateForDisplay = (dateStr: string): string => {
  if (!dateStr) return '';
  
  try {
    // Try parsing as ISO date first
    const isoDate = parseISO(dateStr);
    if (isValid(isoDate)) {
      return format(isoDate, 'MMM d, yyyy');
    }
    
    // If that fails, try parsing MM-DD-YY format
    const parsedDate = parseEventDate(dateStr);
    if (parsedDate && isValid(parsedDate)) {
      return format(parsedDate, 'MMM d, yyyy');
    }
    
    return dateStr; // Return as-is if can't parse
  } catch (error) {
    console.warn('Error formatting date for display:', error);
    return dateStr;
  }
};

/**
 * Formats a date for HTML input (YYYY-MM-DD)
 */
export const formatDateForInput = (dateStr: string): string => {
  if (!dateStr) return '';
  
  try {
    // Try parsing as ISO date first
    const isoDate = parseISO(dateStr);
    if (isValid(isoDate)) {
      return format(isoDate, 'yyyy-MM-dd');
    }
    
    // If that fails, try parsing MM-DD-YY format
    const parsedDate = parseEventDate(dateStr);
    if (parsedDate && isValid(parsedDate)) {
      return format(parsedDate, 'yyyy-MM-dd');
    }
    
    return ''; // Return empty if can't parse
  } catch (error) {
    console.warn('Error formatting date for input:', error);
    return '';
  }
};

/**
 * Parses event dates in various formats and returns a Date object
 */
export const parseEventDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  
  try {
    // Try ISO format first (YYYY-MM-DD)
    const isoDate = parseISO(dateStr);
    if (isValid(isoDate)) {
      return isoDate;
    }
    
    // Try MM-DD-YY format
    if (dateStr.match(/^\d{1,2}-\d{1,2}-\d{2}$/)) {
      const [month, day, year] = dateStr.split('-');
      const fullYear = `20${year}`;
      const isoString = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      const parsedDate = parseISO(isoString);
      if (isValid(parsedDate)) {
        return parsedDate;
      }
    }
    
    // Try other common formats
    const formats = ['M/d/yyyy', 'MM/dd/yyyy', 'M-d-yyyy', 'MM-dd-yyyy'];
    for (const formatStr of formats) {
      try {
        const parsedDate = parse(dateStr, formatStr, new Date());
        if (isValid(parsedDate)) {
          return parsedDate;
        }
      } catch {
        // Continue to next format
      }
    }
    
    return null;
  } catch (error) {
    console.warn('Error parsing event date:', error);
    return null;
  }
};

/**
 * Normalizes event dates to ISO format (YYYY-MM-DD) for storage
 */
export const normalizeEventDate = (dateStr: string): string => {
  if (!dateStr) return '';
  
  const parsedDate = parseEventDate(dateStr);
  if (parsedDate && isValid(parsedDate)) {
    return format(parsedDate, 'yyyy-MM-dd');
  }
  
  return dateStr; // Return as-is if can't parse
};

/**
 * Checks if a date string is in ISO format (YYYY-MM-DD)
 */
export const isISODateFormat = (dateStr: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
};
