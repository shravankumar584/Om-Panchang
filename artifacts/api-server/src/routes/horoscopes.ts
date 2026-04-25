import { Router, type IRouter } from "express";
import { db, horoscopesTable } from "@workspace/db";
import { GetHoroscopeParams } from "@workspace/api-zod";
import { and, eq } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

const SIGN_INFO: Record<string, { english: string; sanskrit: string; lord: string; element: string }> = {
  aries:       { english: "Aries",       sanskrit: "Mesha",      lord: "Mars (Mangal)",   element: "Fire" },
  taurus:      { english: "Taurus",      sanskrit: "Vrishabha",  lord: "Venus (Shukra)",  element: "Earth" },
  gemini:      { english: "Gemini",      sanskrit: "Mithuna",    lord: "Mercury (Budha)", element: "Air" },
  cancer:      { english: "Cancer",      sanskrit: "Karka",      lord: "Moon (Chandra)",  element: "Water" },
  leo:         { english: "Leo",         sanskrit: "Simha",      lord: "Sun (Surya)",     element: "Fire" },
  virgo:       { english: "Virgo",       sanskrit: "Kanya",      lord: "Mercury (Budha)", element: "Earth" },
  libra:       { english: "Libra",       sanskrit: "Tula",       lord: "Venus (Shukra)",  element: "Air" },
  scorpio:     { english: "Scorpio",     sanskrit: "Vrishchika", lord: "Mars (Mangal)",   element: "Water" },
  sagittarius: { english: "Sagittarius", sanskrit: "Dhanu",      lord: "Jupiter (Guru)",  element: "Fire" },
  capricorn:   { english: "Capricorn",   sanskrit: "Makara",     lord: "Saturn (Shani)",  element: "Earth" },
  aquarius:    { english: "Aquarius",    sanskrit: "Kumbha",     lord: "Saturn (Shani)",  element: "Air" },
  pisces:      { english: "Pisces",      sanskrit: "Meena",      lord: "Jupiter (Guru)",  element: "Water" },
};

function todayIST(): string {
  // Horoscope day rolls over at midnight IST so all users see the same content.
  const now = new Date();
  const istMs = now.getTime() + (5.5 * 60 * 60 * 1000);
  const ist = new Date(istMs);
  const y = ist.getUTCFullYear();
  const m = String(ist.getUTCMonth() + 1).padStart(2, "0");
  const d = String(ist.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

interface GeneratedHoroscope {
  overview: string;
  love: string;
  career: string;
  health: string;
  finance: string;
  luckyNumber: number;
  luckyColor: string;
  luckyTime: string;
  mood: string;
}

async function generateHoroscope(sign: string, dateStr: string): Promise<GeneratedHoroscope> {
  const info = SIGN_INFO[sign];
  const weekday = new Date(dateStr + "T00:00:00Z").toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });

  const prompt = `You are a Vedic astrologer writing the daily horoscope for ${info.english} (${info.sanskrit}) for ${weekday}, ${dateStr}.

Sign details:
- Ruling planet: ${info.lord}
- Element: ${info.element}

Write a warm, specific, and encouraging horoscope. Avoid generic phrases like "today is a good day." Be concrete with practical guidance. Respond ONLY with valid JSON matching this exact shape:

{
  "overview": "2-3 sentences summarizing the day's energy",
  "love": "1-2 sentences about relationships and romance",
  "career": "1-2 sentences about work, money decisions, productivity",
  "health": "1-2 sentences about physical and mental wellbeing",
  "finance": "1-2 sentences about money, investments, spending",
  "luckyNumber": <integer between 1 and 99>,
  "luckyColor": "<one color name>",
  "luckyTime": "<time range like '10:00 AM – 12:00 PM'>",
  "mood": "<one or two words describing today's mood>"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5-nano",
    max_completion_tokens: 8192,
    messages: [
      { role: "system", content: "You write Vedic-influenced daily horoscopes. Respond with valid JSON only, no markdown code fences." },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content) as GeneratedHoroscope;

  // Defensive validation in case the model returns something off.
  if (
    typeof parsed.overview !== "string" ||
    typeof parsed.love !== "string" ||
    typeof parsed.career !== "string" ||
    typeof parsed.health !== "string" ||
    typeof parsed.finance !== "string" ||
    typeof parsed.luckyColor !== "string" ||
    typeof parsed.luckyTime !== "string" ||
    typeof parsed.mood !== "string"
  ) {
    throw new Error("Invalid horoscope response shape");
  }
  const luckyNumber = Number(parsed.luckyNumber);
  if (!Number.isFinite(luckyNumber) || luckyNumber < 1 || luckyNumber > 99) {
    parsed.luckyNumber = Math.floor(Math.random() * 99) + 1;
  } else {
    parsed.luckyNumber = Math.round(luckyNumber);
  }

  return parsed;
}

router.get("/horoscope/:sign", async (req, res) => {
  const parsed = GetHoroscopeParams.safeParse({ sign: req.params.sign });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid zodiac sign" });
  }
  const sign = parsed.data.sign;
  const date = todayIST();

  try {
    const existing = await db
      .select()
      .from(horoscopesTable)
      .where(and(eq(horoscopesTable.sign, sign), eq(horoscopesTable.date, date)))
      .limit(1);

    if (existing.length > 0) {
      const h = existing[0];
      return res.json({
        sign: h.sign,
        date: h.date,
        overview: h.overview,
        love: h.love,
        career: h.career,
        health: h.health,
        finance: h.finance,
        luckyNumber: h.luckyNumber,
        luckyColor: h.luckyColor,
        luckyTime: h.luckyTime,
        mood: h.mood,
      });
    }

    const generated = await generateHoroscope(sign, date);

    // Cache it. If a parallel request inserted first, fetch and return that one.
    try {
      const [inserted] = await db
        .insert(horoscopesTable)
        .values({ sign, date, ...generated })
        .returning();
      return res.json({
        sign: inserted.sign,
        date: inserted.date,
        overview: inserted.overview,
        love: inserted.love,
        career: inserted.career,
        health: inserted.health,
        finance: inserted.finance,
        luckyNumber: inserted.luckyNumber,
        luckyColor: inserted.luckyColor,
        luckyTime: inserted.luckyTime,
        mood: inserted.mood,
      });
    } catch {
      const refetched = await db
        .select()
        .from(horoscopesTable)
        .where(and(eq(horoscopesTable.sign, sign), eq(horoscopesTable.date, date)))
        .limit(1);
      if (refetched.length > 0) {
        const h = refetched[0];
        return res.json({
          sign: h.sign,
          date: h.date,
          overview: h.overview,
          love: h.love,
          career: h.career,
          health: h.health,
          finance: h.finance,
          luckyNumber: h.luckyNumber,
          luckyColor: h.luckyColor,
          luckyTime: h.luckyTime,
          mood: h.mood,
        });
      }
      throw new Error("Failed to cache or retrieve horoscope");
    }
  } catch (err) {
    req.log?.error({ err }, "Failed to fetch/generate horoscope");
    return res.status(500).json({ error: "Could not load horoscope right now." });
  }
});

export default router;
