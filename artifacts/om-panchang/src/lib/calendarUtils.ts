const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export function monthToSlug(month: number, year: number): string {
  return `${MONTHS[month].toLowerCase()}-${year}`;
}

export function slugToMonthYear(slug: string): { month: number; year: number } | null {
  if (!slug) return null;
  const parts = slug.split("-");
  if (parts.length < 2) return null;
  const year = parseInt(parts[parts.length - 1]);
  if (isNaN(year) || year < 2000 || year > 2100) return null;
  const monthName = parts.slice(0, -1).join("-");
  const month = MONTHS.findIndex(m => m.toLowerCase() === monthName);
  if (month === -1) return null;
  return { month, year };
}
