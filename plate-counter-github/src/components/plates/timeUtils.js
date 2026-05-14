export function timeToMinutes(time) {
  if (!time || !/^\d{2}:\d{2}$/.test(time)) return null;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function getCurrentMinutes(date = new Date()) {
  return date.getHours() * 60 + date.getMinutes();
}

export function isWindowActive(window, date = new Date()) {
  if (!window?.enabled) return false;

  const start = timeToMinutes(window.start);
  const end = timeToMinutes(window.end);
  const now = getCurrentMinutes(date);

  if (start === null || end === null) return false;

  // Same-day window, for example 08:00-18:00.
  if (start <= end) {
    return now >= start && now < end;
  }

  // Overnight window, for example 22:00-06:00.
  return now >= start || now < end;
}

export function getActiveWindow(timeWindows, date = new Date()) {
  return timeWindows.find((window) => isWindowActive(window, date)) || null;
}

export function getNextWindow(timeWindows, date = new Date()) {
  const now = getCurrentMinutes(date);
  const enabled = timeWindows.filter((window) => window.enabled);

  const withDistance = enabled
    .map((window) => {
      const start = timeToMinutes(window.start);
      if (start === null) return null;

      const distance = start >= now ? start - now : 24 * 60 - now + start;
      return { ...window, distance };
    })
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance);

  return withDistance[0] || null;
}
