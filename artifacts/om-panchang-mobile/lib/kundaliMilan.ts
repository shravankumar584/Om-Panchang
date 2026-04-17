/**
 * Kundali Milan — Ashtakoota Matching Engine
 * Pure logic — same engine as web (artifacts/om-panchang/src/lib/kundaliMilan.ts)
 */

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

const VARNA_RANK: number[] = [3,2,1,4, 3,2,1,4, 3,2,1,4];
const VARNA_LABEL = ["","Shudra","Vaishya","Kshatriya","Brahmin"];

export function varnaKoota(rashiB: number, rashiG: number) {
  const rb = VARNA_RANK[rashiB], rg = VARNA_RANK[rashiG];
  return {
    score: rb >= rg ? 1 : 0, max: 1 as const,
    boyVarna: VARNA_LABEL[rb], girlVarna: VARNA_LABEL[rg],
    dosha: rb < rg,
  };
}

const VASHYA: number[][] = [
  [1,3], [3,6], [5], [7,8], [7], [2,11], [9], [3], [11], [10,0], [0], [9],
];

export function vashyaKoota(rashiB: number, rashiG: number) {
  const bControls = VASHYA[rashiB].includes(rashiG);
  const gControls = VASHYA[rashiG].includes(rashiB);
  if (bControls && gControls) return { score: 2, max: 2 as const };
  if (bControls) return { score: 2, max: 2 as const };
  if (gControls) return { score: 1, max: 2 as const };
  return { score: 0, max: 2 as const };
}

const TARA_NAMES = ["","Janma","Sampat","Vipat","Kshema","Pratyak","Sadhaka","Vadha","Mitra","Ati-Mitra"];
const GOOD_TARA = new Set([2,4,6,8,9]);

function taraCategory(from: number, to: number): number {
  const count = (to - from + 27) % 27 + 1;
  const t = (count - 1) % 9 + 1;
  return t === 0 ? 9 : t;
}

export function taraKoota(nakB: number, nakG: number) {
  const t_gb = taraCategory(nakG, nakB);
  const t_bg = taraCategory(nakB, nakG);
  const goodGB = GOOD_TARA.has(t_gb), goodBG = GOOD_TARA.has(t_bg);
  const score = (goodGB && goodBG) ? 3 : (goodGB || goodBG) ? 1.5 : 0;
  return {
    score, max: 3 as const,
    boyTara: TARA_NAMES[t_gb],
    girlTara: TARA_NAMES[t_bg],
    dosha: score === 0,
  };
}

const YONI: { animal: string; gender: "M" | "F" }[] = [
  { animal:"horse",gender:"M" },{ animal:"elephant",gender:"M" },{ animal:"sheep",gender:"F" },
  { animal:"snake",gender:"M" },{ animal:"snake",gender:"F" },{ animal:"dog",gender:"F" },
  { animal:"cat",gender:"F" },{ animal:"sheep",gender:"M" },{ animal:"cat",gender:"M" },
  { animal:"rat",gender:"M" },{ animal:"rat",gender:"F" },{ animal:"cow",gender:"F" },
  { animal:"buffalo",gender:"F" },{ animal:"tiger",gender:"F" },{ animal:"buffalo",gender:"M" },
  { animal:"tiger",gender:"M" },{ animal:"deer",gender:"F" },{ animal:"deer",gender:"M" },
  { animal:"dog",gender:"M" },{ animal:"monkey",gender:"F" },{ animal:"mongoose",gender:"M" },
  { animal:"monkey",gender:"M" },{ animal:"lion",gender:"F" },{ animal:"horse",gender:"F" },
  { animal:"lion",gender:"M" },{ animal:"cow",gender:"M" },{ animal:"elephant",gender:"F" },
];

const YONI_ENEMIES: [string,string][] = [
  ["sheep","tiger"],["snake","mongoose"],["dog","deer"],["cat","rat"],
  ["monkey","dog"],["elephant","lion"],["horse","buffalo"],["cow","tiger"],["lion","sheep"],
];

const YONI_EMOJI: Record<string,string> = {
  horse:"🐎",elephant:"🐘",sheep:"🐑",snake:"🐍",dog:"🐕",cat:"🐈",
  rat:"🐀",cow:"🐄",buffalo:"🐃",tiger:"🐅",deer:"🦌",monkey:"🐒",mongoose:"🦡",lion:"🦁",
};

export function yoniKoota(nakB: number, nakG: number) {
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
  return { score, max: 4 as const, boyYoni, girlYoni, dosha: score === 0 };
}

const SIGN_LORD: string[] = [
  "mars","venus","mercury","moon","sun","mercury",
  "venus","mars","jupiter","saturn","saturn","jupiter",
];
const LORD_NAME: Record<string,string> = {
  sun:"Sun",moon:"Moon",mars:"Mars",mercury:"Mercury",
  jupiter:"Jupiter",venus:"Venus",saturn:"Saturn",
};
const PLANET_REL: Record<string,Record<string,number>> = {
  sun:     { moon:1,  mars:1,  jupiter:1,  mercury:0,  venus:-1, saturn:-1 },
  moon:    { sun:1,   mercury:1, mars:0,   jupiter:0,  venus:0,  saturn:0  },
  mars:    { sun:1,   moon:1,   jupiter:1,  venus:0,   saturn:0, mercury:-1 },
  mercury: { sun:1,   venus:1,  mars:0,    jupiter:0,  saturn:0, moon:-1   },
  jupiter: { sun:1,   moon:1,   mars:1,    saturn:0,   venus:-1, mercury:-1 },
  venus:   { mercury:1, saturn:1, mars:0,  jupiter:0,  moon:0,  sun:-1    },
  saturn:  { mercury:1, venus:1, jupiter:0, sun:-1,    moon:-1, mars:-1   },
};

export function grahaMaitriKoota(rashiB: number, rashiG: number) {
  const lb = SIGN_LORD[rashiB], lg = SIGN_LORD[rashiG];
  const boyLord  = LORD_NAME[lb]  ?? lb;
  const girlLord = LORD_NAME[lg] ?? lg;
  if (lb === lg) return { score: 5, max: 5 as const, boyLord, girlLord, relation: "Same lord — perfect affinity" };
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
  return { score, max: 5 as const, boyLord, girlLord, relation };
}

const GANA: number[] = [
  0,1,2,1,0,1,0,0,2,2,1,1,0,2,0,2,0,2,2,1,1,0,2,2,1,1,0,
];
const GANA_LABEL = ["Deva","Manava","Rakshasa"];

export function ganaKoota(nakB: number, nakG: number) {
  const gb = GANA[nakB], gg = GANA[nakG];
  let score: number;
  if (gb === gg)                                    score = 6;
  else if ((gb===0&&gg===1)||(gb===1&&gg===0))      score = 5;
  else if ((gb===1&&gg===2)||(gb===2&&gg===1))      score = 1;
  else                                              score = 0;
  return { score, max: 6 as const, boyGana: GANA_LABEL[gb], girlGana: GANA_LABEL[gg], dosha: score === 0 };
}

export function bhakootKoota(rashiB: number, rashiG: number) {
  const d1 = ((rashiG - rashiB + 12) % 12) + 1;
  const d2 = ((rashiB - rashiG + 12) % 12) + 1;
  const pair = `${Math.min(d1,d2)}/${Math.max(d1,d2)}`;
  const isSame = rashiB === rashiG;
  const dosha = !isSame && (pair === "2/12" || pair === "6/8");
  let relation: string;
  if (isSame)             relation = "Same rashi (1/1)";
  else if (pair==="6/8")  relation = "Shadashtaka (6/8) — Dosha";
  else if (pair==="2/12") relation = "Dvidrva Dashaka (2/12) — Dosha";
  else                    relation = `${d1}/${d2} — Auspicious`;
  return { score: dosha ? 0 : 7, max: 7 as const, relation, dosha };
}

const NADI: number[] = [
  0,1,2,2,1,0,0,1,2,2,1,0,0,1,2,2,1,0,0,1,2,2,1,0,0,1,2,
];
const NADI_LABEL = ["Aadi (Vata)","Madhya (Pitta)","Antya (Kapha)"];

export function nadiKoota(nakB: number, nakG: number) {
  const nb = NADI[nakB], ng = NADI[nakG];
  return {
    score: nb !== ng ? 8 : 0,
    max: 8 as const,
    boyNadi:  NADI_LABEL[nb],
    girlNadi: NADI_LABEL[ng],
    dosha: nb === ng,
  };
}

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
    recommendation,
  };
}
