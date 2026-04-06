// Shared high-precision astronomy functions used by both jyotishData.ts and panchangData.ts.
// Placing them here avoids the circular-dependency that would arise from a direct import
// between jyotishData ↔ panchangData.

export const DEG = Math.PI / 180;
export const mod360 = (x: number) => ((x % 360) + 360) % 360;

// ─── Julian Day (Meeus Ch. 7) ───────────────────────────────────────────────
export function julianDay(date: Date): number {
  let Y = date.getUTCFullYear();
  let M = date.getUTCMonth() + 1;
  const D = date.getUTCDate()
          + date.getUTCHours()   / 24
          + date.getUTCMinutes() / 1440
          + date.getUTCSeconds() / 86400;
  if (M <= 2) { Y -= 1; M += 12; }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716))
       + Math.floor(30.6001 * (M + 1))
       + D + B - 1524.5;
}

// ─── Lahiri ayanamsa (time-varying, 50.3"/year) ────────────────────────────
export function getLahiriAyanamsa(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  return mod360(23.85324 + 1.3972 * T);
}

// ─── Moon tropical longitude — Meeus Ch. 47 (accuracy ≈ 10") ──────────────
export function computeMoonTropicalLon(T: number): number {
  const s = Math.sin;
  const Lp = mod360(218.3164477  + 481267.88123421 * T);
  const M  = mod360(357.5291092  +  35999.0502909  * T);
  const Mp = mod360(134.9633964  + 477198.8675055  * T);
  const D  = mod360(297.8501921  + 445267.1114034  * T);
  const F  = mod360(93.2720950   + 483202.0175233  * T);

  const Mr = M * DEG, Mpr = Mp * DEG, Dr = D * DEG, Fr = F * DEG;

  const E  = 1 - 0.002516 * T - 0.0000074 * T * T;
  const E2 = E * E;

  const SigL = (
      6288774 * s(Mpr)
    + 1274027 * s(2*Dr - Mpr)
    +  658314 * s(2*Dr)
    +  213618 * s(2*Mpr)
    -  185116 * E * s(Mr)
    -  114332 * s(2*Fr)
    +   58793 * s(2*Dr - 2*Mpr)
    +   57066 * E * s(2*Dr - Mr - Mpr)
    +   53322 * s(2*Dr + Mpr)
    +   45758 * E * s(2*Dr - Mr)
    -   40923 * E * s(Mr - Mpr)
    -   34720 * s(Dr)
    -   30383 * E * s(Mr + Mpr)
    +   15327 * s(2*Dr - 2*Fr)
    -   12528 * s(Mpr + 2*Fr)
    +   10980 * s(Mpr - 2*Fr)
    +   10675 * s(4*Dr - Mpr)
    +   10034 * s(3*Mpr)
    +    8548 * s(4*Dr - 2*Mpr)
    -    7888 * E * s(2*Dr + Mr - Mpr)
    -    6766 * E * s(2*Dr + Mr)
    -    5163 * s(Dr - Mpr)
    +    4987 * E * s(Dr + Mr)
    +    4036 * E * s(2*Dr - Mr + Mpr)
    +    3994 * s(2*Dr + 2*Mpr)
    +    3861 * s(4*Dr)
    +    3665 * s(2*Dr - 3*Mpr)
    -    2689 * E * s(Mr - 2*Mpr)
    -    2602 * s(2*Dr - Mpr + 2*Fr)
    +    2390 * E * s(2*Dr - Mr - 2*Mpr)
    -    2348 * s(Dr + Mpr)
    +    2236 * E2 * s(2*Dr - 2*Mr)
    -    2120 * E * s(Mr + 2*Mpr)
    -    2069 * E2 * s(2*Mr)
    +    2048 * E2 * s(2*Dr - 2*Mr - Mpr)
    -    1773 * s(2*Dr + Mpr - 2*Fr)
    -    1595 * s(2*Dr + 2*Fr)
    +    1215 * E * s(4*Dr - Mr - Mpr)
    -    1110 * s(2*Mpr + 2*Fr)
    -     892 * s(3*Dr - Mpr)
    -     810 * E * s(2*Dr + Mr + Mpr)
    +     759 * E * s(4*Dr - Mr - 2*Mpr)
    -     713 * E2 * s(2*Mr - Mpr)
    -     700 * E2 * s(2*Dr + 2*Mr - Mpr)
    +     691 * E * s(2*Dr + Mr - 2*Mpr)
    +     596 * E * s(2*Dr - Mr - 2*Fr)
    +     549 * s(4*Dr + Mpr)
    +     537 * s(4*Mpr)
    +     520 * E * s(4*Dr - Mr)
    -     487 * s(Dr - 2*Mpr)
    -     399 * E * s(2*Dr + Mr - 2*Fr)
    -     381 * s(2*Mpr - 2*Fr)
    +     351 * E * s(Dr + Mr + Mpr)
    -     340 * s(3*Dr - 2*Mpr)
    +     330 * s(4*Dr - 3*Mpr)
    +     327 * E * s(2*Dr - Mr + 2*Mpr)
    -     323 * E2 * s(2*Mr + Mpr)
    +     299 * E * s(Dr + Mr - Mpr)
    +     294 * s(2*Dr + 3*Mpr)
  ) * 1e-6;

  const A1 = mod360(119.75 + 131.849 * T);
  const A2 = mod360(53.09  + 479264.290 * T);
  const addL = 3958 * s(A1 * DEG) + 1962 * s((Lp - F) * DEG) + 318 * s(A2 * DEG);

  return mod360(Lp + SigL + addL * 1e-6);
}

// ─── Sun tropical longitude — Meeus Ch. 25 (accuracy ≈ 0.01°) ─────────────
export function computeSunTropicalLon(T: number): number {
  const L0 = mod360(280.46646  + 36000.76983  * T + 0.0003032  * T * T);
  const M  = mod360(357.52911  + 35999.05029  * T - 0.0001537  * T * T);
  const Mr = M * DEG;
  const C  = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr)
           + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr)
           +  0.000289 * Math.sin(3 * Mr);
  const sunTrue = mod360(L0 + C);
  const omega = mod360(125.04 - 1934.136 * T);
  return mod360(sunTrue - 0.00569 - 0.00478 * Math.sin(omega * DEG));
}

// ─── Convenience: compute both sidereal longitudes for a Date ───────────────
// utcOffset is optional; when provided the computation is evaluated at
// approximate local sunrise (6 AM local) for more accurate panchang.
export function computeSiderealPositions(
  date: Date,
  utcOffset = 0,
): { moonSid: number; sunSid: number; jd: number; T: number } {
  // Evaluate at local 06:00 (≈ sunrise) to match Vedic sunrise-based panchang
  const baseUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const localSixAMMs = baseUTC + (6 - utcOffset) * 3600_000;
  const evalDate = new Date(localSixAMMs);

  const jd  = julianDay(evalDate);
  const T   = (jd - 2451545.0) / 36525.0;
  const ayanamsa = getLahiriAyanamsa(jd);

  const moonSid = mod360(computeMoonTropicalLon(T) - ayanamsa);
  const sunSid  = mod360(computeSunTropicalLon(T)  - ayanamsa);

  return { moonSid, sunSid, jd, T };
}

// ─── Internal helper: sidereal elongation for a given UTC timestamp ──────────
function elongationAtMs(ms: number): number {
  const jd = julianDay(new Date(ms));
  const T  = (jd - 2451545.0) / 36525.0;
  const ay = getLahiriAyanamsa(jd);
  return mod360(mod360(computeMoonTropicalLon(T) - ay) - mod360(computeSunTropicalLon(T) - ay));
}

// Binary-search for the UTC timestamp where elongation crosses `target` degrees.
// Search window is [loMs, hiMs]. Returns the crossing time as a Date.
function findElongationCrossing(target: number, loMs: number, hiMs: number): Date {
  for (let i = 0; i < 60; i++) {
    const midMs = (loMs + hiMs) / 2;
    let el = elongationAtMs(midMs);
    // Handle the 0°/360° wrap-around at Amavasya
    if (target < 24 && el > 336) el -= 360;
    if (target > 336 && el < 24) el += 360;
    if (el < target) loMs = midMs; else hiMs = midMs;
  }
  return new Date((loMs + hiMs) / 2);
}

// ─── Compute the exact start & end time of the tithi prevailing at `date` ───
// Returns Date objects in UTC; format them in the city's local timezone outside.
export function computeTithiWindow(
  date: Date,
  utcOffset: number,
): { tithiStart: Date; tithiEnd: Date } {
  // Reference point: local 6 AM
  const baseUTC      = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const localSixAMMs = baseUTC + (6 - utcOffset) * 3600_000;

  const el       = elongationAtMs(localSixAMMs);
  const tithiNum = Math.floor(el / 12);

  const startDeg = tithiNum * 12;        // lower boundary (degrees)
  const endDeg   = (tithiNum + 1) * 12;  // upper boundary (degrees)

  // Tithi typically lasts ~23-26 hours; search ±2 days from reference
  const tithiStart = findElongationCrossing(startDeg, localSixAMMs - 2 * 86_400_000, localSixAMMs);
  const tithiEnd   = findElongationCrossing(endDeg,   localSixAMMs, localSixAMMs + 2 * 86_400_000);

  return { tithiStart, tithiEnd };
}
