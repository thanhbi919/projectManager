export function formatMinutesToTime(minutes) {
  const hours = Math.floor(minutes / 60) // Get the whole number of hours
  const remainingMinutes = minutes % 60 // Get the remaining minutes

  // Format the hours and minutes to always display two digits (e.g., "03:05")
  return `${String(hours).padStart(2, '0')}h ${String(remainingMinutes).padStart(2, '0')}m`
}

export function calculateMinutes(time: string) {
  const timeUnits = {
    w: 7 * 24 * 60,
    d: 24 * 60,
    h: 60,
    m: 1
  }

  const timeParts = time.trim().match(/(\d+\s*[wdhm]?)/g)

  if (!timeParts || timeParts.join('') !== time.replace(/\s+/g, '')) {
    throw new Error(
      "Invalid input format. Please use 'w', 'd', 'h', 'm', or numbers without units."
    )
  }

  let totalMinutes = 0
  timeParts.forEach((part) => {
    const value = parseInt(part)
    const unitMatch = part.trim().match(/[wdhm]$/)
    const unit = unitMatch ? unitMatch[0] : 'm'

    if (!(unit in timeUnits)) {
      throw new Error(`Invalid time unit: ${unit}. Only 'w', 'd', 'h', 'm' are allowed.`)
    }

    totalMinutes += value * timeUnits[unit]
  })

  return totalMinutes
}
