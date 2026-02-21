type TokenEntry = [RegExp, (d: Date) => string];

const FORMAT_TOKENS: TokenEntry[] = [
  [/yyyy/g, (d) => String(d.getFullYear())],
  [/MM/g, (d) => String(d.getMonth() + 1).padStart(2, "0")],
  [/dd/g, (d) => String(d.getDate()).padStart(2, "0")],
  [/HH/g, (d) => String(d.getHours()).padStart(2, "0")],
  [/mm/g, (d) => String(d.getMinutes()).padStart(2, "0")],
];

/**
 * Format a timestamp using a date-fns-style format string.
 * Supported tokens: yyyy, MM, dd, HH, mm
 */
export function formatDate(timestamp: number, format: string): string {
  const d = new Date(timestamp);
  let result = format;
  for (const [regex, fn] of FORMAT_TOKENS) {
    result = result.replace(regex, fn(d));
  }
  return result;
}

/**
 * Parse a date string back into a timestamp using the given format string.
 * Returns NaN if the string does not match the format.
 */
export function parseDate(value: string, format: string): number {
  const escaped = format.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regexStr = escaped
    .replace("yyyy", "(?<yyyy>\\d{4})")
    .replace("MM", "(?<MM>\\d{1,2})")
    .replace("dd", "(?<dd>\\d{1,2})")
    .replace("HH", "(?<HH>\\d{1,2})")
    .replace("mm", "(?<mm>\\d{1,2})");

  const match = new RegExp(`^${regexStr}$`).exec(value.trim());
  if (!match?.groups) return NaN;

  const { yyyy, MM, dd, HH = "0", mm = "0" } = match.groups;
  const year = parseInt(yyyy, 10);
  const month = parseInt(MM, 10) - 1;
  const day = parseInt(dd, 10);
  const hours = parseInt(HH, 10);
  const minutes = parseInt(mm, 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return NaN;

  return new Date(year, month, day, hours, minutes).getTime();
}
