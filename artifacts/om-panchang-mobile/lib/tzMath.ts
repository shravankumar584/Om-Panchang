// ─── Hermes-safe DST-aware timezone conversion ───────────────────────────────

function getOffsetHoursAtUtc(timezone: string, utcMs: number): number {
  try {
    const d = new Date(utcMs);
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone, hour12: false,
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });
    const parts = fmt.formatToParts(d);
    const get = (t: string) => parseInt(parts.find(p => p.type === t)?.value ?? "0", 10);
    const localAsUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour") % 24, get("minute"));
    return (localAsUtc - utcMs) / 3600000;
  } catch {
    return 0;
  }
}

/**
 * Convert a local wall-clock time in `timezone` to a true UTC instant.
 * DST-safe: iterates to converge across spring-forward/fall-back boundaries.
 *
 * For ambiguous local times (fall-back hour exists twice), returns the first
 * (DST) interpretation. For non-existent local times (spring-forward gap),
 * returns the post-gap UTC instant.
 */
export function localToUtcMs(
  timezone: string,
  y: number, m: number, d: number, h: number, mi: number,
): number {
  const naive = Date.UTC(y, m - 1, d, h, mi);
  const off1  = getOffsetHoursAtUtc(timezone, naive);
  const guess = naive - off1 * 3600000;
  const off2  = getOffsetHoursAtUtc(timezone, guess);
  return naive - off2 * 3600000;
}

/** Returns 0-6 (Sun-Sat) for the calendar day in the given IANA timezone. */
export function weekdayInTimezone(date: Date, timezone: string): number {
  try {
    const wd = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone, weekday: "short",
    }).format(date);
    const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return map[wd] ?? date.getDay();
  } catch {
    return date.getDay();
  }
}

/** YYYY-MM-DD in the given timezone — used for same-day comparison. */
export function dateKeyInTimezone(date: Date, timezone: string): string {
  try {
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit",
    });
    return fmt.format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

/** Current wall-clock minutes since midnight in the given IANA timezone. */
export function nowMinutesInTimezone(timezone: string): number {
  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone, hour12: false, hour: "2-digit", minute: "2-digit",
    });
    const parts = fmt.formatToParts(new Date());
    const h = parseInt(parts.find(p => p.type === "hour")?.value ?? "0", 10);
    const m = parseInt(parts.find(p => p.type === "minute")?.value ?? "0", 10);
    return ((h % 24) * 60) + m;
  } catch {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  }
}
