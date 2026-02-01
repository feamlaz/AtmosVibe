export function formatTempC(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  const rounded = Math.round(value);
  return `${rounded}°C`;
}

export function formatTimeHHMM(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '—';
  const h = date.getHours();
  const m = date.getMinutes();
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
