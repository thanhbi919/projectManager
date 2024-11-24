export function formatMinutesToTime(minutes) {
  const hours = Math.floor(minutes / 60) // Get the whole number of hours
  const remainingMinutes = minutes % 60 // Get the remaining minutes

  // Format the hours and minutes to always display two digits (e.g., "03:05")
  return `${String(hours).padStart(2, '0')}h ${String(remainingMinutes).padStart(2, '0')}m`
}
