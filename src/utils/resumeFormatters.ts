
/**
 * Utility functions for formatting resume content
 */

/**
 * Format date string from YYYY-MM to "Month Year" format
 * @param dateString Date in YYYY-MM format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'Present';
  
  try {
    // Input format is YYYY-MM
    const [year, month] = dateString.split('-');
    
    // Convert month number to month name
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const monthIndex = parseInt(month, 10) - 1;
    const monthName = monthNames[monthIndex];
    
    // Return formatted date (e.g., "Jan 2023")
    return `${monthName} ${year}`;
  } catch (error) {
    // If any error in parsing, return the original string
    return dateString;
  }
};

/**
 * Format phone number to include hyphens
 * @param phone Phone number string
 * @returns Formatted phone number with hyphens
 */
export const formatPhoneNumber = (phone: string | undefined): string => {
  if (!phone) return '';
  
  // Remove any existing formatting (spaces, parentheses, hyphens, etc.)
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as XXX-XXX-XXXX
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }
  
  // If it's not exactly 10 digits, return as is with hyphens where possible
  if (cleaned.length > 6) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length > 3) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }
  
  return cleaned;
};
