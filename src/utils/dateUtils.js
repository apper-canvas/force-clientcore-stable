import { format, isValid, parseISO } from 'date-fns';

/**
 * Safely formats a date value, handling invalid dates gracefully
 * @param {string|Date|null|undefined} dateValue - The date value to format
 * @param {string} formatPattern - The date-fns format pattern
 * @param {string} fallback - Fallback text for invalid dates
 * @returns {string} Formatted date or fallback text
 */
export const formatSafely = (dateValue, formatPattern, fallback = "Invalid date") => {
  // Handle null, undefined, or empty string
  if (!dateValue) {
    return fallback;
  }

  let dateObject;
  
  // If already a Date object
  if (dateValue instanceof Date) {
    dateObject = dateValue;
  } else if (typeof dateValue === 'string') {
    // Try to parse as ISO string first, then fall back to Date constructor
    try {
      dateObject = parseISO(dateValue);
      // If parseISO doesn't work, try Date constructor
      if (!isValid(dateObject)) {
        dateObject = new Date(dateValue);
      }
    } catch {
      dateObject = new Date(dateValue);
    }
  } else {
    // Try to convert other types
    dateObject = new Date(dateValue);
  }

  // Check if the resulting date is valid
  if (!isValid(dateObject)) {
    return fallback;
  }

  try {
    return format(dateObject, formatPattern);
  } catch (error) {
    console.warn('Date formatting error:', error);
    return fallback;
  }
};

/**
 * Safely creates a Date object for sorting/comparison
 * @param {string|Date|null|undefined} dateValue - The date value
 * @returns {Date} Valid Date object or epoch date for invalid values
 */
export const dateSafely = (dateValue) => {
  if (!dateValue) {
    return new Date(0); // Return epoch for null/undefined
  }

  let dateObject;
  
  if (dateValue instanceof Date) {
    dateObject = dateValue;
  } else if (typeof dateValue === 'string') {
    try {
      dateObject = parseISO(dateValue);
      if (!isValid(dateObject)) {
        dateObject = new Date(dateValue);
      }
    } catch {
      dateObject = new Date(dateValue);
    }
  } else {
    dateObject = new Date(dateValue);
  }

  return isValid(dateObject) ? dateObject : new Date(0);
};