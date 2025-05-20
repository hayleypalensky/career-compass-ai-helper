
/**
 * Formats a date string to a localized string format, handling both ISO and YYYY-MM-DD formats
 */
export const formatDate = (dateString: string) => {
  // If the date string is in YYYY-MM-DD format (from form inputs)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    // Parse the date without timezone concerns
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  
  // Fallback to standard date parsing for other formats
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
