/**
 * Kundali Milan — Ashtakoota Matching Engine
 *
 * All tables sourced from Brihat Parashara Hora Shastra (BPHS) and
 * Phalaratnamala.  Nakshatra index 0-26 (Ashwini … Revati).
 * Rashi index 0-11 (Mesha … Meena).
 */

// ─── Rashi / Nakshatra name lists ───────────────────────────────────────────
export const RASHI_NAMES_EN = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];
export const RASHI_NAMES_SA = [
  "Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya",
  "Tula","Vrishchika","Dhanu","Makara","Kumbha","Meena",
];
export const NAKSHATRA_NAMES_SA = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra",
  "Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni",
  "Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha",
  "Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati",
];

// ════════════════════════════════════════════════════════════════════════════
// 1. VARNA KOOTA  (max 1 pt)
//    Source: BPHS — Fire=Kshatriya, Earth=Vaishya, Air=Shudra, Water=Brahmin
// ════════════════════════════════════════════════════════════════════════════
const VARNA_RANK: number[] = [
  3,2,1,4,  // Mesha(Fire)=Kshatriya, Vrishabha(Earth)=Vaishya, Mithuna(Air)=Shudra, Karka(Water)=Brahmin
  3,2,1,4,  // Simha, Kanya, Tula, Vrishchika
  3,2,1,4,  // Dhanu, Makara, Kumbha, Meena
];
const VARNA_LABEL = ["","Shudra","Vaishya","Kshatriya","Brahmin"];

export interface VarnaResult {
  score: number; max: 1;
  boyVarna: string; girlVarna: string;
  dosha: boolean;
}
export function varnaKoota(rashiB: number, rashiG: number): VarnaResult {
  const rb = VARNA_RANK[rashiB], rg = VARNA_RANK[rashiG];
  return {
    score: rb >= rg ? 1 : 0, max: 1,
    boyVarna: VARNA_LABEL[rb], girlVarna: VARNA_LABEL[rg],
    dosha: rb < rg,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// 2. VASHYA KOOTA  (max 2 pts)
//    Each rashi "controls" (vashya) certain other rashis.
//    Source: Phalaratnamala ch.10 — standard South+North Indian consensus.
// ════════════════════════════════════════════════════════════════════════════
const VASHYA: number[][] = [
  [1,3],    // 0 Mesha → Vrishabha, Karka
  [3,6],    // 1 Vrishabha → Karka, Tula
  [5],      // 2 Mithuna → Kanya
  [7,8],    // 3 Karka → Vrishchika, Dhanu
  [7],      // 4 Simha → Vrishchika
  [2,11],   // 5 Kanya → Mithuna, Meena
  [9],      // 6 Tula → Makara
  [3],      // 7 Vrishchika → Karka
  [11],     // 8 Dhanu → Meena
  [10,0],   // 9 Makara → Kumbha, Mesha
  [0],      // 10 Kumbha → Mesha
  [9],      // 11 Meena → Makara
];

export function vashyaKoota(rashiB: number, rashiG: number): { score: number; max: 2 } {
  const bControls = VASHYA[rashiB].includes(rashiG);
  const gControls = VASHYA[rashiG].includes(rashiB);
  if (bControls && gControls) return { score: 2, max: 2 };
  if (bControls) return { score: 2, max: 2 };   // boy protects girl = full
  if (gControls) return { score: 1, max: 2 };   // partial (girl controls)
  return { score: 0, max: 2 };
}

// ════════════════════════════════════════════════════════════════════════════
// 3. TARA KOOTA  (max 3 pts)
//    Count nakshatra from girl→boy and boy→girl; reduce mod 9 (0→9).
//    Good taras: 2(Sampat),4(Kshema),6(Sadhaka),8(Mitra),9(Ati-Mitra)
//    Bad taras:  1(Janma),3(Vipat),5(Pratyak/Pradhvamsha),7(Vadha/Naidhana)
// ════════════════════════════════════════════════════════════════════════════
const TARA_NAMES = [
  "","Janma","Sampat","Vipat","Kshema","Pratyak","Sadhaka","Vadha","Mitra","Ati-Mitra"
];
const GOOD_TARA = new Set([2,4,6,8,9]);
const BAD_TARA  = new Set([1,3,5,7]);

function taraCategory(from: number, to: number): number {
  const count = (to - from + 27) % 27 + 1;
  const t = (count - 1) % 9 + 1; // 1-9
  return t === 0 ? 9 : t;
}

export function taraKoota(nakB: number, nakG: number): {
  score: number; max: 3; boyTara: string; girlTara: string; dosha: boolean;
} {
  const t_gb = taraCategory(nakG, nakB); // Girl → Boy
  const t_bg = taraCategory(nakB, nakG); // Boy → Girl
  const goodGB = GOOD_TARA.has(t_gb), goodBG = GOOD_TARA.has(t_bg);
  const score = (goodGB && goodBG) ? 3 : (goodGB || goodBG) ? 1.5 : 0;
  return {
    score, max: 3,
    boyTara:  TARA_NAMES[t_gb],  // tara of boy counted from girl's nak
    girlTara: TARA_NAMES[t_bg],  // tara of girl counted from boy's nak
    dosha: score === 0,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// 4. YONI KOOTA  (max 4 pts)
//    BPHS Table 81 — each nakshatra has an animal yoni.
//    Natural pairs (same animal, opposite gender) = 4 pts.
//    Same animal same gender = 3 pts.
//    Neutral (no relation) = 2 pts.
//    Enemy pair = 0 pts.
// ════════════════════════════════════════════════════════════════════════════
const YONI: { animal: string; gender: "M" | "F" }[] = [
  { animal:"horse",    gender:"M" }, // 0  Ashwini
  { animal:"elephant", gender:"M" }, // 1  Bharani
  { animal:"sheep",    gender:"F" }, // 2  Krittika
  { animal:"snake",    gender:"M" }, // 3  Rohini
  { animal:"snake",    gender:"F" }, // 4  Mrigashira
  { animal:"dog",      gender:"F" }, // 5  Ardra
  { animal:"cat",      gender:"F" }, // 6  Punarvasu   — Female cat (BPHS)
  { animal:"sheep",    gender:"M" }, // 7  Pushya
  { animal:"cat",      gender:"M" }, // 8  Ashlesha    — Male cat (BPHS)
  { animal:"rat",      gender:"M" }, // 9  Magha
  { animal:"rat",      gender:"F" }, // 10 Purva Phalguni
  { animal:"cow",      gender:"F" }, // 11 Uttara Phalguni
  { animal:"buffalo",  gender:"F" }, // 12 Hasta       — Female buffalo (BPHS)
  { animal:"tiger",    gender:"F" }, // 13 Chitra
  { animal:"buffalo",  gender:"M" }, // 14 Swati
  { animal:"tiger",    gender:"M" }, // 15 Vishakha
  { animal:"deer",     gender:"F" }, // 16 Anuradha
  { animal:"deer",     gender:"M" }, // 17 Jyeshtha
  { animal:"dog",      gender:"M" }, // 18 Mula
  { animal:"monkey",   gender:"F" }, // 19 Purva Ashadha
  { animal:"mongoose", gender:"M" }, // 20 Uttara Ashadha
  { animal:"monkey",   gender:"M" }, // 21 Shravana
  { animal:"lion",     gender:"F" }, // 22 Dhanishtha
  { animal:"horse",    gender:"F" }, // 23 Shatabhisha
  { animal:"lion",     gender:"M" }, // 24 Purva Bhadrapada
  { animal:"cow",      gender:"M" }, // 25 Uttara Bhadrapada
  { animal:"elephant", gender:"F" }, // 26 Revati
];

// Hostile pairs (0 pts) — Phalaratnamala / BPHS
const YONI_ENEMIES: [string,string][] = [
  ["sheep","tiger"],  ["snake","mongoose"], ["dog","deer"],
  ["cat","rat"],      ["monkey","dog"],     ["elephant","lion"],
  ["horse","buffalo"],["cow","tiger"],      ["lion","sheep"],
];

const YONI_EMOJI: Record<string,string> = {
  horse:"🐎",elephant:"🐘",sheep:"🐑",snake:"🐍",dog:"🐕",cat:"🐈",
  rat:"🐀",cow:"🐄",buffalo:"🐃",tiger:"🐅",deer:"🦌",
  monkey:"🐒",mongoose:"🦡",lion:"🦁",
};

export function yoniKoota(nakB: number, nakG: number): {
  score: number; max: 4; boyYoni: string; girlYoni: string; dosha: boolean;
} {
  const b = YONI[nakB], g = YONI[nakG];
  const boyYoni  = `${YONI_EMOJI[b.animal]} ${b.animal} (${b.gender === "M" ? "Male" : "Female"})`;
  const girlYoni = `${YONI_EMOJI[g.animal]} ${g.animal} (${g.gender === "M" ? "Male" : "Female"})`;
  let score = 2;
  if (b.animal === g.animal) {
    score = b.gender !== g.gender ? 4 : 3;
  } else {
    const enemy = YONI_ENEMIES.some(
      ([a1,a2]) => (b.animal===a1 && g.animal===a2) || (b.animal===a2 && g.animal===a1)
    );
    if (enemy) score = 0;
  }
  return { score, max: 4, boyYoni, girlYoni, dosha: score === 0 };
}

// ════════════════════════════════════════════════════════════════════════════
// 5. GRAHA MAITRI KOOTA  (max 5 pts)
//    Natural (naisargika) planetary friendships from BPHS Ch.3.
//    Score based on relationship between Moon-sign lords.
// ════════════════════════════════════════════════════════════════════════════
const SIGN_LORD: string[] = [
  "mars","venus","mercury","moon","sun","mercury",
  "venus","mars","jupiter","saturn","saturn","jupiter",
];
const LORD_NAME: Record<string,string> = {
  sun:"Sun",moon:"Moon",mars:"Mars",mercury:"Mercury",
  jupiter:"Jupiter",venus:"Venus",saturn:"Saturn",
};
// rel > 0 = friend, rel = 0 = neutral, rel < 0 = enemy
const PLANET_REL: Record<string,Record<string,number>> = {
  sun:     { moon:1,  mars:1,  jupiter:1,  mercury:0,  venus:-1, saturn:-1 },
  moon:    { sun:1,   mercury:1, mars:0,   jupiter:0,  venus:0,  saturn:0  },
  mars:    { sun:1,   moon:1,   jupiter:1,  venus:0,   saturn:0, mercury:-1 },
  mercury: { sun:1,   venus:1,  mars:0,    jupiter:0,  saturn:0, moon:-1   },
  jupiter: { sun:1,   moon:1,   mars:1,    saturn:0,   venus:-1, mercury:-1 },
  venus:   { mercury:1, saturn:1, mars:0,  jupiter:0,  moon:0,  sun:-1    },
  saturn:  { mercury:1, venus:1, jupiter:0, sun:-1,    moon:-1, mars:-1   },
};

export function grahaMaitriKoota(rashiB: number, rashiG: number): {
  score: number; max: 5; boyLord: string; girlLord: string; relation: string;
} {
  const lb = SIGN_LORD[rashiB], lg = SIGN_LORD[rashiG];
  const boyLord  = LORD_NAME[lb]  ?? lb;
  const girlLord = LORD_NAME[lg] ?? lg;
  if (lb === lg) return { score: 5, max: 5, boyLord, girlLord, relation: "Same lord — perfect affinity" };
  const relBG = PLANET_REL[lb]?.[lg] ?? 0;
  const relGB = PLANET_REL[lg]?.[lb] ?? 0;
  const sum = relBG + relGB;
  let score: number, relation: string;
  if (sum === 2)       { score=5; relation="Mutual friends"; }
  else if (sum === 1)  { score=4; relation="Friend + Neutral"; }
  else if (relBG===0 && relGB===0) { score=3; relation="Mutual neutrals"; }
  else if (sum === 0)  { score=1; relation="Friend + Enemy (mixed)"; }
  else if (sum === -1) { score=0; relation="Enemy + Neutral"; }
  else                 { score=0; relation="Mutual enemies"; }
  return { score, max: 5, boyLord, girlLord, relation };
}

// ════════════════════════════════════════════════════════════════════════════
// 6. GANA KOOTA  (max 6 pts)
//    BPHS Table 82 — Deva, Manava, Rakshasa.
//    Same gana=6, Deva+Manava=5, Manava+Rakshasa=1, Deva+Rakshasa=0.
// ════════════════════════════════════════════════════════════════════════════
// 0=Deva, 1=Manava, 2=Rakshasa
const GANA: number[] = [
  0, // 0  Ashwini
  1, // 1  Bharani
  2, // 2  Krittika
  1, // 3  Rohini
  0, // 4  Mrigashira
  1, // 5  Ardra
  0, // 6  Punarvasu
  0, // 7  Pushya
  2, // 8  Ashlesha
  2, // 9  Magha
  1, // 10 Purva Phalguni
  1, // 11 Uttara Phalguni
  0, // 12 Hasta
  2, // 13 Chitra
  0, // 14 Swati
  2, // 15 Vishakha
  0, // 16 Anuradha
  2, // 17 Jyeshtha
  2, // 18 Mula
  1, // 19 Purva Ashadha
  1, // 20 Uttara Ashadha
  0, // 21 Shravana
  2, // 22 Dhanishtha
  2, // 23 Shatabhisha
  1, // 24 Purva Bhadrapada
  1, // 25 Uttara Bhadrapada
  0, // 26 Revati
];
const GANA_LABEL = ["Deva","Manava","Rakshasa"];

export function ganaKoota(nakB: number, nakG: number): {
  score: number; max: 6; boyGana: string; girlGana: string; dosha: boolean;
} {
  const gb = GANA[nakB], gg = GANA[nakG];
  const boyGana = GANA_LABEL[gb], girlGana = GANA_LABEL[gg];
  let score: number;
  if (gb === gg)                                    score = 6;
  else if ((gb===0&&gg===1)||(gb===1&&gg===0))      score = 5;
  else if ((gb===1&&gg===2)||(gb===2&&gg===1))      score = 1;
  else                                              score = 0; // Deva+Rakshasa
  return { score, max: 6, boyGana, girlGana, dosha: score === 0 };
}

// ════════════════════════════════════════════════════════════════════════════
// 7. BHAKOOT KOOTA  (max 7 pts)
//    Distance between Moon rashis. Dosha if 6/8 or 2/12. All others = 7.
// ════════════════════════════════════════════════════════════════════════════
export function bhakootKoota(rashiB: number, rashiG: number): {
  score: number; max: 7; relation: string; dosha: boolean;
} {
  const d1 = ((rashiG - rashiB + 12) % 12) + 1; // Boy → Girl count
  const d2 = ((rashiB - rashiG + 12) % 12) + 1; // Girl → Boy count
  const pair = `${Math.min(d1,d2)}/${Math.max(d1,d2)}`;
  const isSame = rashiB === rashiG;
  const dosha = !isSame && (pair === "2/12" || pair === "6/8");
  let relation: string;
  if (isSame)         relation = "Same rashi (1/1)";
  else if (pair==="6/8")  relation = "Shadashtaka (6/8) — Dosha";
  else if (pair==="2/12") relation = "Dvidrva Dashaka (2/12) — Dosha";
  else                relation = `${d1}/${d2} — Auspicious`;
  return { score: dosha ? 0 : 7, max: 7, relation, dosha };
}

// ════════════════════════════════════════════════════════════════════════════
// 8. NADI KOOTA  (max 8 pts)
//    BPHS — Aadi(Vata), Madhya(Pitta), Antya(Kapha).
//    Same nadi = Nadi Dosha = 0. Different = 8.
// ════════════════════════════════════════════════════════════════════════════
// 0=Aadi, 1=Madhya, 2=Antya
const NADI: number[] = [
  0, // 0  Ashwini       — Aadi
  1, // 1  Bharani       — Madhya
  2, // 2  Krittika      — Antya
  2, // 3  Rohini        — Antya
  1, // 4  Mrigashira    — Madhya
  0, // 5  Ardra         — Aadi
  0, // 6  Punarvasu     — Aadi
  1, // 7  Pushya        — Madhya
  2, // 8  Ashlesha      — Antya
  2, // 9  Magha         — Antya
  1, // 10 Purva Phalguni— Madhya
  0, // 11 Uttara Phalguni—Aadi
  0, // 12 Hasta         — Aadi
  1, // 13 Chitra        — Madhya
  2, // 14 Swati         — Antya
  2, // 15 Vishakha      — Antya
  1, // 16 Anuradha      — Madhya
  0, // 17 Jyeshtha      — Aadi
  0, // 18 Mula          — Aadi
  1, // 19 Purva Ashadha — Madhya
  2, // 20 Uttara Ashadha— Antya
  2, // 21 Shravana      — Antya
  1, // 22 Dhanishtha    — Madhya
  0, // 23 Shatabhisha   — Aadi
  0, // 24 Purva Bhadrapada—Aadi
  1, // 25 Uttara Bhadrapada—Madhya
  2, // 26 Revati        — Antya
];
const NADI_LABEL = ["Aadi (Vata)","Madhya (Pitta)","Antya (Kapha)"];

export function nadiKoota(nakB: number, nakG: number): {
  score: number; max: 8; boyNadi: string; girlNadi: string; dosha: boolean;
} {
  const nb = NADI[nakB], ng = NADI[nakG];
  return {
    score: nb !== ng ? 8 : 0,
    max: 8,
    boyNadi:  NADI_LABEL[nb],
    girlNadi: NADI_LABEL[ng],
    dosha: nb === ng,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// MASTER RESULT
// ════════════════════════════════════════════════════════════════════════════
export interface MilanResult {
  total: number;
  max: 36;
  varna:       ReturnType<typeof varnaKoota>;
  vashya:      ReturnType<typeof vashyaKoota>;
  tara:        ReturnType<typeof taraKoota>;
  yoni:        ReturnType<typeof yoniKoota>;
  grahaMaitri: ReturnType<typeof grahaMaitriKoota>;
  gana:        ReturnType<typeof ganaKoota>;
  bhakoot:     ReturnType<typeof bhakootKoota>;
  nadi:        ReturnType<typeof nadiKoota>;
  nadiDosha:   boolean;
  bhakootDosha: boolean;
  ganaDosha:   boolean;
  recommendation: "Excellent" | "Good" | "Acceptable" | "Below average" | "Poor";
}

export function computeMilan(rashiB: number, nakB: number, rashiG: number, nakG: number): MilanResult {
  const varna       = varnaKoota(rashiB, rashiG);
  const vashya      = vashyaKoota(rashiB, rashiG);
  const tara        = taraKoota(nakB, nakG);
  const yoni        = yoniKoota(nakB, nakG);
  const grahaMaitri = grahaMaitriKoota(rashiB, rashiG);
  const gana        = ganaKoota(nakB, nakG);
  const bhakoot     = bhakootKoota(rashiB, rashiG);
  const nadi        = nadiKoota(nakB, nakG);
  const total = varna.score + vashya.score + tara.score + yoni.score
              + grahaMaitri.score + gana.score + bhakoot.score + nadi.score;
  let recommendation: MilanResult["recommendation"];
  if      (total >= 27) recommendation = "Excellent";
  else if (total >= 21) recommendation = "Good";
  else if (total >= 18) recommendation = "Acceptable";
  else if (total >= 12) recommendation = "Below average";
  else                  recommendation = "Poor";
  return {
    total, max: 36,
    varna, vashya, tara, yoni, grahaMaitri, gana, bhakoot, nadi,
    nadiDosha: nadi.dosha,
    bhakootDosha: bhakoot.dosha,
    ganaDosha: gana.dosha,
    recommendation,
  };
}
