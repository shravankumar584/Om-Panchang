export interface ZodiacSign {
  slug: string;
  english: string;
  sanskrit: string;
  symbol: string;
  lord: string;
  element: string;
  dateRange: string;
  shortDescription: string;
  traits: string[];
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    slug: "aries",
    english: "Aries",
    sanskrit: "Mesha",
    symbol: "♈",
    lord: "Mars (Mangal)",
    element: "Fire",
    dateRange: "Apr 14 – May 14 (Vedic)",
    shortDescription: "Aries (Mesha) is the first sign of the zodiac, ruled by Mars. Aries natives are pioneering, courageous, and energetic — natural leaders who charge fearlessly into new ventures.",
    traits: ["Courageous", "Energetic", "Pioneering", "Impulsive", "Competitive"],
  },
  {
    slug: "taurus",
    english: "Taurus",
    sanskrit: "Vrishabha",
    symbol: "♉",
    lord: "Venus (Shukra)",
    element: "Earth",
    dateRange: "May 15 – Jun 14 (Vedic)",
    shortDescription: "Taurus (Vrishabha), ruled by Venus, brings stability, sensual pleasure, and material prosperity. Taurus natives are patient, loyal, and deeply rooted in comfort and beauty.",
    traits: ["Patient", "Reliable", "Sensual", "Stubborn", "Practical"],
  },
  {
    slug: "gemini",
    english: "Gemini",
    sanskrit: "Mithuna",
    symbol: "♊",
    lord: "Mercury (Budha)",
    element: "Air",
    dateRange: "Jun 15 – Jul 15 (Vedic)",
    shortDescription: "Gemini (Mithuna), ruled by Mercury, embodies duality, communication, and intellectual agility. Gemini natives are witty, curious, and excellent at conversation and learning.",
    traits: ["Quick-witted", "Adaptable", "Curious", "Sociable", "Restless"],
  },
  {
    slug: "cancer",
    english: "Cancer",
    sanskrit: "Karka",
    symbol: "♋",
    lord: "Moon (Chandra)",
    element: "Water",
    dateRange: "Jul 16 – Aug 16 (Vedic)",
    shortDescription: "Cancer (Karka), ruled by the Moon, is the most nurturing and emotionally sensitive sign. Cancer natives are deeply intuitive, family-oriented, and protective of loved ones.",
    traits: ["Nurturing", "Intuitive", "Protective", "Emotional", "Loyal"],
  },
  {
    slug: "leo",
    english: "Leo",
    sanskrit: "Simha",
    symbol: "♌",
    lord: "Sun (Surya)",
    element: "Fire",
    dateRange: "Aug 17 – Sep 16 (Vedic)",
    shortDescription: "Leo (Simha), ruled by the Sun, radiates royalty, warmth, and natural authority. Leo natives are generous, dramatic, and shine brightest when in the spotlight.",
    traits: ["Confident", "Generous", "Charismatic", "Proud", "Creative"],
  },
  {
    slug: "virgo",
    english: "Virgo",
    sanskrit: "Kanya",
    symbol: "♍",
    lord: "Mercury (Budha)",
    element: "Earth",
    dateRange: "Sep 17 – Oct 17 (Vedic)",
    shortDescription: "Virgo (Kanya), ruled by Mercury, brings precision, service, and analytical clarity. Virgo natives excel at detail-oriented work and quietly improving the world around them.",
    traits: ["Analytical", "Practical", "Helpful", "Modest", "Perfectionist"],
  },
  {
    slug: "libra",
    english: "Libra",
    sanskrit: "Tula",
    symbol: "♎",
    lord: "Venus (Shukra)",
    element: "Air",
    dateRange: "Oct 18 – Nov 16 (Vedic)",
    shortDescription: "Libra (Tula), ruled by Venus, seeks balance, harmony, and beautiful relationships. Libra natives are diplomatic, charming, and excel at bringing people together.",
    traits: ["Diplomatic", "Charming", "Fair-minded", "Indecisive", "Romantic"],
  },
  {
    slug: "scorpio",
    english: "Scorpio",
    sanskrit: "Vrishchika",
    symbol: "♏",
    lord: "Mars (Mangal)",
    element: "Water",
    dateRange: "Nov 17 – Dec 15 (Vedic)",
    shortDescription: "Scorpio (Vrishchika), ruled by Mars, is intense, transformative, and deeply perceptive. Scorpio natives sense hidden truths and undergo profound personal transformations.",
    traits: ["Intense", "Passionate", "Perceptive", "Secretive", "Loyal"],
  },
  {
    slug: "sagittarius",
    english: "Sagittarius",
    sanskrit: "Dhanu",
    symbol: "♐",
    lord: "Jupiter (Guru)",
    element: "Fire",
    dateRange: "Dec 16 – Jan 13 (Vedic)",
    shortDescription: "Sagittarius (Dhanu), ruled by Jupiter, is the seeker — optimistic, philosophical, and always aiming at higher truth. Sagittarius natives love travel, learning, and freedom.",
    traits: ["Optimistic", "Philosophical", "Adventurous", "Honest", "Restless"],
  },
  {
    slug: "capricorn",
    english: "Capricorn",
    sanskrit: "Makara",
    symbol: "♑",
    lord: "Saturn (Shani)",
    element: "Earth",
    dateRange: "Jan 14 – Feb 12 (Vedic)",
    shortDescription: "Capricorn (Makara), ruled by Saturn, embodies discipline, responsibility, and patient ambition. Capricorn natives climb steadily and achieve lasting success through hard work.",
    traits: ["Disciplined", "Ambitious", "Responsible", "Patient", "Reserved"],
  },
  {
    slug: "aquarius",
    english: "Aquarius",
    sanskrit: "Kumbha",
    symbol: "♒",
    lord: "Saturn (Shani)",
    element: "Air",
    dateRange: "Feb 13 – Mar 13 (Vedic)",
    shortDescription: "Aquarius (Kumbha), ruled by Saturn, is the visionary humanitarian. Aquarius natives think independently, value progress, and serve the collective good.",
    traits: ["Innovative", "Independent", "Humanitarian", "Detached", "Visionary"],
  },
  {
    slug: "pisces",
    english: "Pisces",
    sanskrit: "Meena",
    symbol: "♓",
    lord: "Jupiter (Guru)",
    element: "Water",
    dateRange: "Mar 14 – Apr 13 (Vedic)",
    shortDescription: "Pisces (Meena), ruled by Jupiter, is deeply compassionate, intuitive, and spiritually attuned. Pisces natives navigate between the material and dream worlds with grace.",
    traits: ["Compassionate", "Intuitive", "Artistic", "Spiritual", "Sensitive"],
  },
];

export function getZodiacBySlug(slug: string): ZodiacSign | undefined {
  return ZODIAC_SIGNS.find((s) => s.slug === slug);
}

export const ELEMENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Fire:  { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" },
  Earth: { bg: "#D1FAE5", text: "#065F46", border: "#6EE7B7" },
  Air:   { bg: "#E0E7FF", text: "#3730A3", border: "#A5B4FC" },
  Water: { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD" },
};
