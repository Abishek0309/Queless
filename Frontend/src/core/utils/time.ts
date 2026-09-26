/**
 * Time and formatting utilities
 */

export function formatWaitTime(minutes: number): string {
  if (minutes <= 0) return 'Immediate';
  if (minutes === 1) return '~1 min';
  if (minutes < 60) return `~${minutes} mins`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  
  if (remainingMins === 0) {
    return hours === 1 ? '~1 hour' : `~${hours} hours`;
  }
  return `~${hours}h ${remainingMins.toString().padStart(2, '0')}m`;
}

export function formatSecondsToTimer(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeString(isoString?: string | null): string {
  if (!isoString) return '--:--';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
