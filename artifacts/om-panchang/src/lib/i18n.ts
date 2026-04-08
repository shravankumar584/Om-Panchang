export type CalendarLang = "en" | "hi" | "te";

export const LANG_LABELS: Record<CalendarLang, string> = {
  en: "EN", hi: "हि", te: "తె",
};
export const LANG_CYCLE: CalendarLang[] = ["en", "hi", "te"];

const TITHI_HI: Record<string, string> = {
  "Pratipada": "प्रतिपदा", "Dvitiya": "द्वितीया", "Tritiya": "तृतीया",
  "Chaturthi": "चतुर्थी", "Panchami": "पंचमी", "Shashthi": "षष्ठी",
  "Saptami": "सप्तमी", "Ashtami": "अष्टमी", "Navami": "नवमी",
  "Dashami": "दशमी", "Ekadashi": "एकादशी", "Dvadashi": "द्वादशी",
  "Trayodashi": "त्रयोदशी", "Chaturdashi": "चतुर्दशी",
  "Purnima / Amavasya": "पूर्णिमा / अमावस्या",
};

const TITHI_TE: Record<string, string> = {
  "Pratipada": "పాడ్యమి", "Dvitiya": "విదియ", "Tritiya": "తదియ",
  "Chaturthi": "చవితి", "Panchami": "పంచమి", "Shashthi": "షష్టి",
  "Saptami": "సప్తమి", "Ashtami": "అష్టమి", "Navami": "నవమి",
  "Dashami": "దశమి", "Ekadashi": "ఏకాదశి", "Dvadashi": "ద్వాదశి",
  "Trayodashi": "త్రయోదశి", "Chaturdashi": "చతుర్దశి",
  "Purnima / Amavasya": "పౌర్ణమి / అమావాస్య",
};

const NAKSHATRA_HI: Record<string, string> = {
  "Ashwini": "अश्विनी", "Bharani": "भरणी", "Krittika": "कृत्तिका",
  "Rohini": "रोहिणी", "Mrigashira": "मृगशिरा", "Ardra": "आर्द्रा",
  "Punarvasu": "पुनर्वसु", "Pushya": "पुष्य", "Ashlesha": "आश्लेषा",
  "Magha": "मघा", "Purva Phalguni": "पूर्व फाल्गुनी", "Uttara Phalguni": "उत्तर फाल्गुनी",
  "Hasta": "हस्त", "Chitra": "चित्रा", "Swati": "स्वाती",
  "Vishakha": "विशाखा", "Anuradha": "अनुराधा", "Jyeshtha": "ज्येष्ठा",
  "Mula": "मूला", "Purva Ashadha": "पूर्वाषाढा", "Uttara Ashadha": "उत्तराषाढा",
  "Shravana": "श्रवण", "Dhanishtha": "धनिष्ठा", "Shatabhisha": "शतभिषा",
  "Purva Bhadrapada": "पूर्व भाद्रपदा", "Uttara Bhadrapada": "उत्तर भाद्रपदा",
  "Revati": "रेवती",
};

const NAKSHATRA_TE: Record<string, string> = {
  "Ashwini": "అశ్వని", "Bharani": "భరణి", "Krittika": "కృత్తిక",
  "Rohini": "రోహిణి", "Mrigashira": "మృగశిర", "Ardra": "ఆర్ద్ర",
  "Punarvasu": "పునర్వసు", "Pushya": "పుష్యమి", "Ashlesha": "ఆశ్లేష",
  "Magha": "మఖ", "Purva Phalguni": "పుబ్బ", "Uttara Phalguni": "ఉత్తర",
  "Hasta": "హస్త", "Chitra": "చిత్త", "Swati": "స్వాతి",
  "Vishakha": "విశాఖ", "Anuradha": "అనూరాధ", "Jyeshtha": "జ్యేష్ఠ",
  "Mula": "మూల", "Purva Ashadha": "పూర్వాషాఢ", "Uttara Ashadha": "ఉత్తరాషాఢ",
  "Shravana": "శ్రవణం", "Dhanishtha": "ధనిష్ఠ", "Shatabhisha": "శతభిషం",
  "Purva Bhadrapada": "పూర్వాభాద్ర", "Uttara Bhadrapada": "ఉత్తరాభాద్ర",
  "Revati": "రేవతి",
};

export function translateTithi(name: string, lang: CalendarLang): string {
  if (lang === "hi") return TITHI_HI[name] || name;
  if (lang === "te") return TITHI_TE[name] || name;
  return name;
}

export function translateNakshatra(name: string, lang: CalendarLang): string {
  if (lang === "hi") return NAKSHATRA_HI[name] || name;
  if (lang === "te") return NAKSHATRA_TE[name] || name;
  return name;
}

// Build Google Calendar "Add Event" URL for a festival
export function gcalUrl(festivalName: string, dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const fmt = (dt: Date) =>
    dt.toISOString().replace(/[-:]/g, "").slice(0, 8);
  const start = fmt(d);
  const end   = fmt(new Date(d.getTime() + 86_400_000)); // next day (exclusive)
  const text    = encodeURIComponent(festivalName);
  const details = encodeURIComponent("Hindu Festival · Om Panchang");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}`;
}
