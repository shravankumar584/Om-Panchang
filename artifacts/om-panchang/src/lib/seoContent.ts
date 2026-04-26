// Long-form, original SEO content shown beneath each indexed Panchang variant page.
// Goal: give every indexed page 500–1200 words of unique, useful prose so search
// engines (and AdSense reviewers) see substantive original content instead of
// templated tables. Each variant gets its own copy — DO NOT share text across
// variants, that defeats the purpose.

export interface SeoArticleSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface SeoFaq {
  q: string;
  a: string;
}

export interface SeoContent {
  intro: string;
  sections: SeoArticleSection[];
  faqs: SeoFaq[];
}

export const SEO_CONTENT: Partial<Record<string, SeoContent>> = {
  default: {
    intro:
      "Om Panchang is a free, location-aware Hindu almanac (Panchang or Panchangam) that calculates today's Tithi, Nakshatra, Yoga, Karana and Vara along with sunrise, sunset, Rahu Kalam and the festival calendar for the city you actually live in. Whether you are in Delhi, Chennai, New York or London, the times shown here are computed from astronomical positions of the Sun and Moon for your local timezone — not copied from a printed regional almanac.",
    sections: [
      {
        heading: "What is Panchang and why it matters",
        paragraphs: [
          "Panchang literally means \"five limbs\" — the five astronomical components that together describe the religious quality of any given day in the Hindu calendar. Most Hindu households consult a Panchang before fasting on Ekadashi, doing a puja, scheduling a wedding, breaking ground on a house (Griha Pravesh), or simply choosing the best time to start a new business venture. Even small daily decisions like cutting hair, travelling north, or signing important papers are traditionally guided by it.",
          "The reason this works is that Panchang is not symbolic — it is a calculation. The Tithi is determined by the angular distance between the Sun and the Moon. The Nakshatra is determined by where the Moon sits among the 27 lunar mansions. The Yoga is the sum of solar and lunar longitudes. None of these change because of where you are on Earth, but the time at which they begin and end shifts by your timezone, and the festivals that depend on sunrise (like Ekadashi or Karwa Chauth) genuinely fall on different calendar days in San Francisco than in Mumbai.",
        ],
      },
      {
        heading: "The five elements explained",
        paragraphs: [
          "Each element of the Panchang answers a different practical question:",
        ],
        bullets: [
          "Tithi — the lunar day. There are 30 tithis in a lunar month, split into the waxing fortnight (Shukla Paksha) ending in Purnima (full moon) and the waning fortnight (Krishna Paksha) ending in Amavasya (new moon). Tithis like Ekadashi (the 11th lunar day), Chaturdashi (14th) and Amavasya (15th of Krishna Paksha) carry strong religious significance.",
          "Nakshatra — the lunar mansion. The Moon's path is divided into 27 Nakshatras, each around 13°20′ wide. Your Janma Nakshatra (the Nakshatra at the moment of your birth) is the foundation of Vedic astrology and is used to choose baby names, evaluate horoscope compatibility, and select auspicious dates for personal events.",
          "Yoga — there are 27 named Yogas, computed by adding the longitudes of Sun and Moon and dividing by 13°20′. Some Yogas like Vishkambha or Vyatipata are considered inauspicious, while Siddha, Shubha and Amrita are considered favourable for spiritual or new-beginning activities.",
          "Karana — half a Tithi. There are 11 Karanas (4 fixed and 7 movable), each lasting half a lunar day. Karanas are mostly relevant for fine-grained Muhurta calculations and for determining auspicious time slots within a single day.",
          "Vara — the weekday, ruled by one of the seven classical planets (Surya, Soma, Mangala, Budha, Guru, Shukra, Shani). Each weekday inherits the qualities of its ruling planet, which is why certain rituals are tied to specific days — Hanuman puja on Tuesday and Saturday, Lakshmi puja on Friday, fasting for Lord Vishnu on Thursday.",
        ],
      },
      {
        heading: "How to use this Panchang day to day",
        paragraphs: [
          "Start by checking that the city shown at the top matches your actual location — sunrise and sunset, and therefore everything that depends on them, change with longitude. Once your city is set, the daily Panchang card on the home page shows you the current Tithi, Nakshatra and Vara along with sunrise, sunset and the Rahu Kalam window for today.",
          "If you are planning anything sensitive — a wedding, a housewarming, signing a property deal, or starting a new venture — open the Muhurta tab, pick the type of activity, and the page will list the next several auspicious windows for your city. For routine decisions, the Choghadiya and Hora widgets break the day down into smaller auspicious and inauspicious slots so you can pick a good half-hour for an important call or meeting.",
          "Vrat days like Ekadashi, Pradosh, Amavasya and Purnima are highlighted in the calendar with start and end times. Because the Tithi technically changes mid-day, the page tells you when the fast actually begins and ends in your local time, instead of forcing you to guess.",
        ],
      },
      {
        heading: "Regional variations: Drik vs Vakya, North vs South",
        paragraphs: [
          "Hindu astronomy uses two main calculation traditions. The Drik Ganitha (\"observed calculation\") method computes positions from the actual astronomical positions of the Sun and Moon and is used by most modern Panchangs, including this one. The older Vakya method uses simpler formulae that have drifted slightly over the centuries; it is still used by some traditional South Indian almanacs and can show dates one day off from Drik for certain festivals.",
          "We use the Lahiri Ayanamsa (the standard sidereal correction adopted by the Indian government for civil calendar purposes) and Drik calculations throughout the site. North Indian (Purnimanta) and South Indian (Amanta) traditions also start the lunar month on different days — the Purnimanta month ends on Purnima while the Amanta month ends on Amavasya — but the underlying tithis and festival dates are the same; only the month-name labelling differs.",
        ],
      },
      {
        heading: "Why a location-aware Panchang matters",
        paragraphs: [
          "A printed regional Panchang from Tamil Nadu will tell you the right Ekadashi sunrise time for Madurai, but it cannot tell you what time Ekadashi sunrise is in San Jose, California. The Hindu diaspora has historically had to manually \"adjust\" festival dates to their local timezone, which often led to confusion — celebrating a vrat on the wrong day, or starting a fast at the wrong sunrise.",
          "Om Panchang solves this by recomputing everything for your actual city. If you live in Edison, NJ, the Ekadashi vrat sunrise time on the calendar is the actual sunrise in Edison. If you live in Sydney, the sunrise is Sydney's. The festival list, vrat windows, sankalp times and even the auspicious Choghadiya slots are all aligned to where you really are.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is the Panchang on Om Panchang accurate?",
        a: "Yes. We use the Drik Ganitha method with Lahiri Ayanamsa — the same standard used by the Government of India's Rashtriya Panchang. Astronomical positions are computed from Swiss Ephemeris-grade routines and adjusted for your city's exact latitude, longitude and timezone, so timings can vary by ±3 minutes from a regional printed almanac due to standard refraction correction.",
      },
      {
        q: "Why are the timings different from the Panchang my parents use back home?",
        a: "Because the Sun rises at different times in different places. A festival like Karwa Chauth or Ekadashi is technically tied to the moment of sunrise on a specific Tithi, and that moment is hours apart between India and North America. We recompute everything for your local city, so the date shown is the date you should observe — not the date observed in India.",
      },
      {
        q: "Can I trust the Muhurta dates for my wedding?",
        a: "The Muhurta calculator gives you astronomically valid Shubh Muhurta windows based on Tithi, Nakshatra, Yoga, Karana and the avoidance of Rahu Kalam, Yamagandam and Gulika Kalam. For a wedding, we still recommend cross-checking with a family priest who may overlay additional Gotra and ancestral conventions, but the dates listed are auspicious by classical Vedic standards.",
      },
      {
        q: "Do you store any of my data?",
        a: "No personal data is required to use the daily Panchang, festivals, Choghadiya, Hora or horoscope features — the only thing we store on your device is your selected city. The Kundali calculator processes birth details locally in your browser and does not send them to any server. See our Privacy Policy for details.",
      },
      {
        q: "Is this site free to use forever?",
        a: "Yes. Om Panchang is and will remain free for all users. We may show non-intrusive ads or offer optional subscription features for advanced reports in the future, but the core daily Panchang, festival calendar, and Muhurta tools will always be free.",
      },
    ],
  },

  hindu: {
    intro:
      "The Hindu Calendar (also called Vikram Samvat or Shaka Samvat depending on tradition) is a luni-solar calendar — meaning it tracks both the cycles of the Moon (which determine festivals) and the cycles of the Sun (which keep the calendar aligned with the seasons). Om Panchang shows you the live Hindu calendar for your city, with each date marked by its Tithi, Nakshatra, festivals and major Vrat days.",
    sections: [
      {
        heading: "How the Hindu calendar is structured",
        paragraphs: [
          "A Hindu year has 12 lunar months, each averaging 29.5 days. To keep the lunar months in step with the solar year, an extra month called Adhik Maas (or Mal Maas) is inserted approximately every 32 to 33 months — this is the Hindu equivalent of a leap month. The result is that the calendar slides slightly each year against the Gregorian calendar but never drifts away from the seasons.",
          "The 12 months are: Chaitra, Vaishakha, Jyeshtha, Ashadha, Shravana, Bhadrapada, Ashwin, Kartik, Margashirsha, Pausha, Magha and Phalguna. Each month is split into two pakshas — Shukla (waxing moon, Pratipada to Purnima) and Krishna (waning moon, Pratipada to Amavasya). North Indian Purnimanta tradition ends the month on Purnima; South Indian Amanta tradition ends the month on Amavasya. The festivals fall on the same calendar date in both traditions; only the month-name attached to the date can differ.",
        ],
      },
      {
        heading: "Vikram Samvat, Shaka Samvat and the modern Saka year",
        paragraphs: [
          "Hindu years are counted from different epochs depending on tradition. The most widely used today is Vikram Samvat (year 2083 in 2026) which begins on Chaitra Shukla Pratipada (the Hindu New Year, also celebrated as Ugadi or Gudi Padwa). The Shaka Samvat (year 1948 in 2026) starts on the same day and is the official civil calendar of India, used in the Government's Rashtriya Panchang.",
          "The Hindu year you commonly see on a Panchang — \"Vikram Samvat 2083\" or \"Shaka Samvat 1948\" — refers to one of these epochs. Om Panchang labels both clearly on every daily Panchang card so you never lose track of where you are in the cycle.",
        ],
      },
      {
        heading: "Major festivals on the Hindu calendar",
        paragraphs: [
          "The festival calendar follows the lunar months, which means a festival like Diwali falls on Kartik Amavasya every year — but Kartik Amavasya falls on a different Gregorian date each year because the lunar and solar years drift against each other. Some of the highest-impact festivals are:",
        ],
        bullets: [
          "Diwali — Kartik Amavasya (October–November). The festival of lights honouring Lakshmi.",
          "Holi — Phalguna Purnima (February–March). The festival of colours marking the arrival of spring.",
          "Navratri & Dussehra — first 9 days of Ashwin Shukla, ending on Vijayadashami. Worship of the Goddess and victory of good over evil.",
          "Ganesh Chaturthi — Bhadrapada Shukla Chaturthi (August–September). Birth of Lord Ganesha.",
          "Janmashtami — Bhadrapada Krishna Ashtami. Birth of Lord Krishna.",
          "Maha Shivratri — Phalguna Krishna Chaturdashi. The great night of Shiva.",
          "Ram Navami — Chaitra Shukla Navami. Birth of Lord Rama.",
          "Raksha Bandhan — Shravana Purnima. The bond between siblings.",
          "Karwa Chauth — Kartik Krishna Chaturthi. Fast for the well-being of husbands.",
        ],
      },
      {
        heading: "Why this calendar shows different dates from a printed Panchang",
        paragraphs: [
          "If you compare Om Panchang to a printed Panchang from your hometown in India, you may see a one-day difference for some festivals. This is almost always because the festival is technically determined by which day's sunrise falls within a specific Tithi — and your city's sunrise is several hours offset from India's. Diwali might fall on November 8 in Mumbai but on November 7 in Los Angeles because Kartik Amavasya extends across both sunrises in different timezones.",
          "We always show the festival on the day that is correct for your city's sunrise. If you would prefer to follow your hometown's date instead, you can switch the city setting at the top of the page back to a city in India.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is this a Vikram Samvat or Shaka Samvat calendar?",
        a: "Both are shown. Each daily Panchang card lists the Vikram Samvat year (year + 57 from Gregorian) and the Shaka Samvat year (year − 78 from Gregorian) so you can use whichever your tradition follows.",
      },
      {
        q: "Why is there sometimes an extra month in the year?",
        a: "That is Adhik Maas (also called Mal Maas or Purushottam Maas), inserted roughly every 32 months to keep the lunar calendar aligned with the solar year. During Adhik Maas, certain auspicious activities like marriages and house-warmings are traditionally avoided.",
      },
      {
        q: "Can I see the calendar for previous or future years?",
        a: "Yes. Use the month/year selector on the calendar page to navigate to any month from 2024 through 2027. Festival dates, vrat days and full Panchang are computed live for any date you choose.",
      },
    ],
  },

  telugu: {
    intro:
      "The Telugu Calendar (తెలుగు పంచాంగం) is the Hindu lunisolar calendar followed in Andhra Pradesh, Telangana and the wider Telugu diaspora. It uses the Amanta month-ending tradition (months end on Amavasya), and its New Year — Ugadi — falls on Chaitra Shukla Pratipada, traditionally regarded as the day Lord Brahma began creation. Om Panchang gives you the live Telugu Panchangam recomputed for any city in the world, in your local timezone.",
    sections: [
      {
        heading: "Structure of the Telugu Panchangam",
        paragraphs: [
          "The Telugu calendar names its 12 months: Chaitra, Vaishakha, Jyeshtha, Ashadha, Shravana, Bhadrapada, Ashwayuja, Karthika, Margasira, Pushya, Magha and Phalguna. Like other Hindu calendars, each month is divided into two pakshas — Shukla and Krishna — and each day is described by its Tithi, Vara, Nakshatra, Yoga and Karana.",
          "Telugu astrologers traditionally rely on the Drik (sidereal) calculations along with the Lahiri Ayanamsa, which is what Om Panchang uses internally. Festival dates published on this site match those followed by major Telugu temples and the official Andhra Pradesh / Telangana state festival calendars.",
        ],
      },
      {
        heading: "Major Telugu festivals",
        paragraphs: [
          "While most pan-Hindu festivals are observed across Telugu-speaking regions, several festivals carry particular regional importance:",
        ],
        bullets: [
          "Ugadi — Chaitra Shukla Pratipada. The Telugu New Year, celebrated with Ugadi Pachadi (a six-flavoured chutney symbolising life's flavours).",
          "Sri Rama Navami — Chaitra Shukla Navami. Especially significant in Bhadrachalam, the seat of Sri Sita Ramachandra Swamy.",
          "Bonalu — Ashadha month. Telangana's festival to Mahakali.",
          "Bathukamma — nine days ending on Mahalaya Amavasya. Telangana's flower festival for Goddess Gauri.",
          "Vinayaka Chaviti — Bhadrapada Shukla Chaturthi. Ganesh Chaturthi celebrated grandly across Telugu states.",
          "Dasara — first 9 days of Ashwayuja Shukla. Vijayadashami marks the climax with Sri Rama returning to Ayodhya.",
          "Sankranti / Pongal — solar festival in mid-January marking Uttarayana, the Sun's northward movement.",
          "Karthika Masam — entire month of Karthika is considered the most auspicious for Shiva worship; Karthika Pournami and Karthika Somavar fasts are major.",
        ],
      },
      {
        heading: "How to use the Telugu Panchang",
        paragraphs: [
          "Set your city at the top of the page. The daily Panchang card will then show your local Tithi, Nakshatra, Yoga and Karana, along with sunrise, sunset and Rahu Kalam in your timezone. The calendar grid below highlights all major Telugu festivals (Bonalu, Bathukamma, Karthika Pournami, Atla Tadiya and others) on their correct local dates.",
          "Use the Choghadiya and Muhurta tabs when planning a Griha Pravesh, marriage, vehicle purchase or any other muhurta-sensitive event. The Kundali tab generates a Telugu-style Vedic birth chart with rashi, nakshatra and dasha details.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is the Telugu calendar Amanta or Purnimanta?",
        a: "Telugu tradition is Amanta — months end on Amavasya. So Bhadrapada Krishna Amavasya is the last day of Bhadrapada, and Ashwayuja begins the next morning. Om Panchang labels months according to the Amanta convention for the Telugu variant.",
      },
      {
        q: "Why does Ugadi fall on a different date every year?",
        a: "Ugadi is fixed to Chaitra Shukla Pratipada — the first day of the bright fortnight of the lunar month Chaitra. Because the lunar year is shorter than the solar year, that day moves between mid-March and mid-April on the Gregorian calendar each year.",
      },
      {
        q: "How is the Telugu Panchang different from the Tamil Panchang?",
        a: "Both are South Indian Panchangs and use very similar calculations, but the Tamil Panchang follows the solar calendar for month names (Chithirai, Vaikasi, Aani, etc., based on the Sun's rashi) while the Telugu Panchang follows the lunar calendar for month names (Chaitra, Vaishakha, etc., based on the Moon). So Tamil New Year (Puthandu) falls in mid-April when the Sun enters Mesha, while Telugu New Year (Ugadi) follows the lunar Chaitra Shukla Pratipada.",
      },
    ],
  },

  "vedic-astrology": {
    intro:
      "Vedic astrology — Jyotish (\"the science of light\") — is one of the six Vedangas, the limbs of the Vedas. Unlike modern Western astrology, Jyotish uses the sidereal zodiac (the actual star positions corrected by the Lahiri Ayanamsa) and places enormous weight on the Moon's Nakshatra at birth. This page brings together the daily Panchang, current planetary positions, Kundali tools and Vedic horoscope data in one place for your city.",
    sections: [
      {
        heading: "The foundations of Vedic astrology",
        paragraphs: [
          "Jyotish rests on three pillars: Siddhanta (mathematical astronomy), Samhita (mundane and event astrology — weather, harvests, kingdoms) and Hora (personal horoscopy). The Hora branch is what most people mean when they say \"astrology\" today — the analysis of an individual's birth chart (Kundali) to read personality, predict events and select auspicious times.",
          "A Vedic horoscope is centred on the Moon, not the Sun. Where Western astrology asks \"what's your sun sign?\", Jyotish asks \"what's your janma rashi (Moon sign) and janma nakshatra?\" Your janma nakshatra defines your dasha periods — the planetary timeline that runs through your life — using the Vimshottari system of 120 years.",
        ],
      },
      {
        heading: "The Navagraha — the nine planets of Jyotish",
        paragraphs: [
          "Vedic astrology recognises nine grahas (\"seizers\" or planetary forces). They are the seven classical planets visible to the eye plus the two lunar nodes. Each graha rules certain rashis, certain nakshatras, certain weekdays and certain physiological / psychological domains.",
        ],
        bullets: [
          "Surya (Sun) — soul, father, government, vitality. Rules Simha (Leo) and the nakshatras Krittika, Uttara Phalguni and Uttarashadha.",
          "Chandra (Moon) — mind, mother, emotions, the public. Rules Karka (Cancer) and the nakshatras Rohini, Hasta and Shravana.",
          "Mangala (Mars) — energy, courage, brothers, real estate. Rules Mesha (Aries) and Vrishchika (Scorpio); nakshatras Mrigashira, Chitra and Dhanishta.",
          "Budha (Mercury) — intellect, communication, business. Rules Mithuna (Gemini) and Kanya (Virgo); nakshatras Ashlesha, Jyeshtha and Revati.",
          "Guru (Jupiter) — wisdom, dharma, children, fortune. Rules Dhanu (Sagittarius) and Meena (Pisces); nakshatras Punarvasu, Vishakha and Purva Bhadrapada.",
          "Shukra (Venus) — love, art, vehicles, comforts. Rules Vrishabha (Taurus) and Tula (Libra); nakshatras Bharani, Purva Phalguni and Purva Ashadha.",
          "Shani (Saturn) — discipline, longevity, karma, hard work. Rules Makara (Capricorn) and Kumbha (Aquarius); nakshatras Pushya, Anuradha and Uttara Bhadrapada.",
          "Rahu (North Node) — desire, foreign things, technology, sudden change. Co-rules with Shani; nakshatras Ardra, Swati and Shatabhisha.",
          "Ketu (South Node) — moksha, intuition, detachment, past karma. Co-rules with Mangala; nakshatras Ashwini, Magha and Mula.",
        ],
      },
      {
        heading: "How to use this page",
        paragraphs: [
          "The current Panchang card shows you today's Tithi, Nakshatra and Yoga — three of the most important factors when selecting a Muhurta or starting a new venture. The Planets widget shows the live sidereal longitude of all nine grahas, including which rashi each is currently transiting and whether it is retrograde.",
          "Use the Kundali tab to generate a free birth chart with rashi positions, dasha breakdown, and analysis of important yogas (planetary combinations). The Daily Horoscope section gives you a sign-wise reading based on your Moon rashi (or Sun rashi if you don't know your Moon sign), updated every day at IST midnight.",
        ],
      },
    ],
    faqs: [
      {
        q: "Why does Vedic astrology give different rashi than Western astrology?",
        a: "Western tropical astrology measures from the spring equinox; Vedic sidereal astrology measures from the actual star positions, corrected by the Ayanamsa (currently around 24°). The two systems drift apart by about one zodiac sign — so someone whose Western Sun sign is Aries usually has a Vedic Sun rashi of Pisces.",
      },
      {
        q: "What is more important — rashi or nakshatra?",
        a: "In Jyotish, nakshatra usually carries more weight. Your janma nakshatra determines your Vimshottari dasha sequence (the planetary periods that govern your life events), influences your name, and is the primary factor in marriage compatibility (Ashtakoot). Rashi matters for transit predictions and broad personality.",
      },
      {
        q: "Are dasha predictions accurate?",
        a: "Vimshottari dasha is one of the most field-tested predictive techniques in Jyotish. It works as a timing tool — telling you when something is likely to happen — provided the underlying birth time is precise (within 4 minutes for ideal results). Even small birth-time errors can shift dasha periods by months.",
      },
    ],
  },

  "hindu-astrology": {
    intro:
      "Hindu astrology — known traditionally as Jyotish Shastra — is the broader system that includes Vedic astrology, Nakshatra-based Muhurta calculation, festival astronomy, and rashi-based horoscope readings. This page combines the daily Panchang, Nakshatra of the day, Kundali tools and zodiac-wise Daily Horoscope so you can see today's astrological picture in one place for your city.",
    sections: [
      {
        heading: "The branches of Hindu astrology",
        paragraphs: [
          "Hindu astrology is conventionally divided into three skandas: Siddhanta (the mathematical and astronomical foundation), Samhita (mundane astrology covering events, weather and politics), and Hora (personal horoscopy). Within Hora, several traditions have evolved over centuries — Parashari (the most widely practised classical school), Jaimini, Tajika (used for varshaphal / annual prediction), and Nadi (palm-leaf based).",
          "Most everyday questions — When should I get married? Is this house good for me? When will my career take off? — fall under Hora. The tools on this site lean on Parashari Jyotish: rashi-nakshatra-graha analysis, Vimshottari dasha periods, and Ashtakoot compatibility.",
        ],
      },
      {
        heading: "Janma Rashi and Janma Nakshatra",
        paragraphs: [
          "Your janma rashi is the rashi (zodiac sign) the Moon was in at the moment of your birth. There are 12 rashis: Mesha, Vrishabha, Mithuna, Karka, Simha, Kanya, Tula, Vrishchika, Dhanu, Makara, Kumbha and Meena. Your janma nakshatra is the lunar mansion the Moon was in — there are 27 nakshatras spanning the whole zodiac, so each rashi contains either two full nakshatras or two-and-a-quarter.",
          "Together, rashi and nakshatra (and the sub-pada within the nakshatra) form the basis of nearly every traditional Hindu astrological calculation — from the syllable used to name a baby, to determining whether two horoscopes are compatible for marriage, to predicting which planetary period is likely to bring a major life event.",
        ],
      },
      {
        heading: "Doshas and remedies",
        paragraphs: [
          "Hindu astrology recognises several common chart conditions or \"doshas\" that may suggest a need for remedy or extra care — Mangal Dosha (Mars in certain houses, said to affect marital harmony), Kaal Sarp Dosha (all planets between Rahu and Ketu), Sade Sati (the 7.5-year transit of Saturn over the Moon sign), and Pitru Dosha (afflictions tied to ancestors).",
          "The traditional remedies for these doshas are predominantly behavioural and devotional — observing certain vrats, doing dana (charity), reciting mantras, performing pujas at the right Muhurta. Material remedies like gemstones and yantras are recommended only after careful chart analysis by a qualified Jyotishi.",
        ],
      },
    ],
    faqs: [
      {
        q: "What's the difference between Hindu astrology and Vedic astrology?",
        a: "They refer to the same tradition. \"Vedic astrology\" is the term that became popular in the West in the late 20th century. Within India, the traditional terms are Jyotish or Jyotish Shastra, and the broader phrase \"Hindu astrology\" is also used.",
      },
      {
        q: "Can I trust online astrology?",
        a: "Computational astrology — Panchang, Kundali generation, dasha calculation, transit reports — is purely mathematical and is reliable when computed with proper ephemeris data and Lahiri Ayanamsa, which is what this site does. Predictive interpretation, however, depends on the skill and ethics of the astrologer; treat any online prediction as a starting point, not a verdict.",
      },
      {
        q: "What if my janma rashi differs from the rashi shown by my Sun sign?",
        a: "This is normal and expected. In Hindu astrology, your janma rashi is your Moon rashi — the rashi the Moon was in at your birth — not the rashi the Sun was in. Pop horoscopes that ask for your birthday alone use Sun rashi, but classical Jyotish gives more weight to Moon rashi for most predictions. To find your true janma rashi, use the Kundali calculator with your birth date, time and place.",
      },
      {
        q: "Are the daily horoscopes on this site based on rashi or Sun sign?",
        a: "The daily horoscopes here are organised by rashi (Moon sign). If you know your Moon rashi, use that; if not, you can use your Sun rashi as an approximation, but the reading will be more accurate against your Moon rashi.",
      },
    ],
  },

  kundali: {
    intro:
      "A Kundali (also called Janma Kundali, Janam Patrika or Vedic birth chart) is the snapshot of the sky at the exact moment and place of your birth. It records where each of the nine grahas (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu and Ketu) was located in the sidereal zodiac at that instant. The Kundali Calculator on this page generates a free, ephemeris-grade Vedic birth chart from your birth date, time and place.",
    sections: [
      {
        heading: "What goes into a Kundali",
        paragraphs: [
          "Three pieces of information are needed to cast a Kundali: the date of birth, the time of birth (as accurate as possible — ideally within 4 minutes), and the geographic location of birth (city is usually enough; the calculator looks up the latitude, longitude and historical timezone). The output includes:",
        ],
        bullets: [
          "Lagna (Ascendant) — the rashi rising on the eastern horizon at the moment of birth. Lagna defines the first house of the chart and is one of the most important reference points.",
          "Rashi chart (D-1) — the main chart showing each planet's house and sign placement.",
          "Navamsa chart (D-9) — a divisional chart used heavily for marriage and overall fortune analysis.",
          "Janma Rashi (Moon sign) and Janma Nakshatra (Moon's nakshatra) — the foundation for dasha calculation and naming.",
          "Vimshottari Dasha — the lifelong sequence of planetary periods (Mahadasha and Antardasha) that governs the timing of life events.",
          "Yogas — special planetary combinations (Gajakesari Yoga, Raj Yoga, Pancha Mahapurusha Yogas, etc.) that strengthen or modify chart interpretation.",
        ],
      },
      {
        heading: "How to read your Kundali",
        paragraphs: [
          "Start with the Lagna and the Moon — these are the two most important reference points. Read the strength of each graha based on its sign (own sign, exalted, debilitated, neutral) and house placement. Houses 1, 4, 7 and 10 are kendras (the strongest); 1, 5 and 9 are trikonas (the most auspicious).",
          "Then look at your current Mahadasha and Antardasha. These tell you which planetary energy is most active in your life right now. A well-placed Jupiter Mahadasha typically brings expansion and good fortune; a Saturn Mahadasha typically brings discipline, hard work and structural change.",
          "For specific life questions — career, marriage, children, education, finances — astrologers analyse the appropriate house, its lord, and the divisional chart most relevant to that question. You can use the generated Kundali as a starting point and consult a qualified Jyotishi for deeper analysis.",
        ],
      },
      {
        heading: "Privacy and how the calculator works",
        paragraphs: [
          "Birth details are processed entirely in your browser. We do not transmit your name, birth date, time or location to any server, and we do not store the resulting Kundali. You can save or screenshot the chart for your records; it is not retained by us.",
          "Calculations use the Lahiri Ayanamsa with the Drik Ganitha method — the same standard used by the Government of India's Rashtriya Panchang. Planetary positions are accurate to the arcsecond when correct birth time is provided.",
        ],
      },
    ],
    faqs: [
      {
        q: "I don't know my exact birth time. Can I still get a useful Kundali?",
        a: "You can. The Moon sign, Sun sign and broad planetary positions will be correct even with a wrong time. However, the Lagna (Ascendant) and house placements depend heavily on time — even a 30-minute error can shift the Lagna by one rashi. If you have a time-sensitive question, consider birth-time rectification with an astrologer.",
      },
      {
        q: "What is the difference between Lagna and Rashi?",
        a: "Lagna (Ascendant) is the rashi rising in the east at your birth time — it defines the first house and changes roughly every two hours. Rashi usually refers to the Moon sign — the rashi where the Moon was at your birth — and changes roughly every two-and-a-half days. Both are important, but they answer different questions.",
      },
      {
        q: "Is the Kundali calculator free?",
        a: "Yes, completely free with no account required. Birth details stay on your device.",
      },
    ],
  },

  "kundali-milan": {
    intro:
      "Kundali Milan (also called Guna Milan or Ashtakoot Matching) is the traditional Vedic system for evaluating marriage compatibility between two horoscopes. It assigns up to 36 points across eight categories — Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot and Nadi — and most communities consider 18 or more points a good match.",
    sections: [
      {
        heading: "The eight koots (categories)",
        paragraphs: [
          "Each koot examines a different aspect of compatibility. Higher scores in each koot indicate better alignment in that domain:",
        ],
        bullets: [
          "Varna (1 point) — spiritual or temperamental compatibility.",
          "Vashya (2 points) — mutual control and influence.",
          "Tara (3 points) — destiny and birth-star compatibility (based on each partner's nakshatra).",
          "Yoni (4 points) — sexual and natural-instinct compatibility.",
          "Graha Maitri (5 points) — friendship between the lords of the Moon signs.",
          "Gana (6 points) — temperament class — Deva (divine), Manushya (human) or Rakshasa (demonic).",
          "Bhakoot (7 points) — relative position of the two Moon signs; affects family well-being and finances.",
          "Nadi (8 points) — physiological and genetic compatibility; a Nadi dosha (both partners having the same Nadi) is traditionally considered a serious mismatch.",
        ],
      },
      {
        heading: "Beyond the score: Mangal Dosha and other considerations",
        paragraphs: [
          "An Ashtakoot score of 18+ is the conventional threshold, but a high Guna score alone is not enough. Astrologers also examine Mangal Dosha (placement of Mars in certain houses), the strength of the 7th house and its lord, the Navamsa chart (D-9) for marital fortune, and the dasha periods both partners are running into.",
          "If both partners have Mangal Dosha, the dosha is generally considered cancelled (\"Manglik-Manglik\" pairing). A Mangal Dosha in only one partner can sometimes be remedied with appropriate puja and Muhurta selection. The Kundali Milan tool here flags Mangal Dosha automatically, along with the overall compatibility score and a koot-by-koot breakdown.",
        ],
      },
      {
        heading: "How to use the Kundali Milan tool",
        paragraphs: [
          "Enter the bride's and groom's full birth details (date, time, place) and the calculator generates an Ashtakoot match report along with key compatibility flags. The result shows total Guna points (out of 36), a colour-coded breakdown of each koot, the Mangal Dosha status of each partner, and an overall recommendation.",
          "Treat the result as a starting point. A 24+ score with no major doshas is generally considered a strong match; lower scores or significant doshas usually warrant a more detailed reading from a family priest or qualified astrologer who can examine divisional charts and dashas in depth.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is 18 Gunas always enough?",
        a: "18 is the minimum threshold most traditions accept, but a higher score does not automatically guarantee a happy marriage, and a lower score does not necessarily doom it. Treat Ashtakoot as one input alongside Mangal Dosha, Navamsa analysis, and dasha alignment.",
      },
      {
        q: "What is Nadi Dosha and is it really serious?",
        a: "Nadi Dosha occurs when both partners share the same Nadi (Aadi, Madhya or Antya). Classical texts consider it a serious mismatch primarily for genetic and progeny reasons. However, if both partners have the same Janma Rashi or Janma Nakshatra, Nadi Dosha is generally considered cancelled. Modern astrologers often weigh the medical and ancestral context alongside the dosha.",
      },
      {
        q: "Are my partner's birth details safe?",
        a: "Yes. Kundali Milan calculations run entirely in your browser; we don't transmit or store any of the birth details you enter.",
      },
    ],
  },

  "marriage-muhurat": {
    intro:
      "Marriage Muhurat (Vivaha Muhurat) is the carefully selected auspicious time at which a Hindu wedding ceremony begins. The right Muhurat is chosen by combining the bride's and groom's Janma Nakshatra with the day's Tithi, Nakshatra, Yoga, Karana, Lagna and the avoidance of inauspicious periods like Rahu Kalam, Yamagandam and Bhadra Karana. This page lists upcoming Shubh Vivaha Muhurat dates for your city.",
    sections: [
      {
        heading: "What makes a Muhurat auspicious for marriage",
        paragraphs: [
          "Several criteria must align for a date to be acceptable as Vivaha Muhurat. A traditional Muhurat avoids inauspicious months (the lunar months when the Sun is in certain rashis), avoids Adhik Maas (the leap month), avoids the Pitru Paksha period, and falls on a day when the Tithi, Nakshatra and Yoga are all considered favourable for marriage.",
        ],
        bullets: [
          "Auspicious months: Magha, Phalguna, Chaitra (in some traditions), Vaishakha, Jyeshtha (with restrictions), Margashirsha. Marriages are generally avoided in Ashadha, Bhadrapada, Ashwin (during Pitru Paksha), Pausha and Adhik Maas.",
          "Auspicious nakshatras for Vivaha: Rohini, Mrigashira, Magha, Uttara Phalguni, Hasta, Swati, Anuradha, Mula, Uttara Ashadha, Uttara Bhadrapada and Revati. Several of these have specific pada (quarter) restrictions.",
          "Tithi: most fortnights from Dwitiya through Trayodashi are generally usable, except for Rikta tithis (Chaturthi, Navami, Chaturdashi). Amavasya is avoided.",
          "Vara: Sunday, Monday, Wednesday, Thursday and Friday are generally favourable; Tuesday and Saturday are usually avoided unless other factors are exceptionally strong.",
          "Avoid Rahu Kalam, Yamagandam and Gulika Kalam during the actual phera (saat phere) ceremony.",
          "The Lagna at the time of the lagna-bandhana should be one of the chara (movable) or sthira (fixed) signs depending on tradition; the Moon should be well placed and not afflicted in the Lagna chart.",
        ],
      },
      {
        heading: "Selecting your Muhurat",
        paragraphs: [
          "Open the Marriage Muhurat tab and the page lists all upcoming Shubh Vivaha Muhurat dates for the year, computed from the rules above. Each date shows the Tithi, Nakshatra and recommended time window. You can filter the list by month and city to find a date that fits your scheduling constraints.",
          "Always cross-check the shortlist with a family priest or qualified astrologer — they will overlay additional factors specific to the bride and groom's nakshatras (their personal Tara Bala and Chandra Bala) and may suggest a sub-window within the listed Muhurat that is most beneficial for the couple.",
        ],
      },
    ],
    faqs: [
      {
        q: "Why are no Muhurat dates listed for some months?",
        a: "Some months — particularly Ashadha (Chaturmas begins), Bhadrapada (Pitru Paksha), Pausha (Khar Maas) and Adhik Maas — have very few or no Vivaha Muhurat windows by traditional rules. The page reflects that.",
      },
      {
        q: "Can the Muhurat list change after I bookmark it?",
        a: "The fundamental rules don't change, but as the wedding date approaches we recommend re-checking, because the bride's and groom's individual Nakshatra-bala (strength) on a given date depends on the placements at that moment and is best confirmed close to the event.",
      },
      {
        q: "What is Lagna-bandhana and why is its time so specific?",
        a: "Lagna-bandhana (also called Mangalya Dharanam in South India) is the actual moment the groom ties the mangalsutra around the bride's neck — the exact instant of marriage. The Muhurat time given is for this moment, not for the start of the entire wedding ceremony. The other rituals (Kanyadaan, Saptapadi, Pheras) flow around this anchor point and need to be timed so that Lagna-bandhana falls within the chosen auspicious window.",
      },
      {
        q: "Are there auspicious dates outside of marriages on this page?",
        a: "Yes — the Muhurta tab also lists auspicious windows for Griha Pravesh (house-warming), vehicle purchase, business opening, naming ceremony (Namakaran), property registration and other major events. Each event type has its own preferred Tithis, Nakshatras and Lagnas, all of which the calculator factors in.",
      },
    ],
  },

  "hindu-festivals": {
    intro:
      "The Hindu festival calendar runs continuously through the year, with major festivals roughly once a month and Vrat days (Ekadashi, Pradosh, Sankashti, Amavasya, Purnima) every fortnight. Om Panchang lists every major Hindu festival for the year with its accurate local-timezone date and the underlying Tithi-Nakshatra-Vara reasoning.",
    sections: [
      {
        heading: "How festival dates are decided",
        paragraphs: [
          "Most Hindu festivals are determined by a combination of Tithi, Nakshatra and Vara. For example: Diwali is Kartik Amavasya (Tithi-based); Janmashtami is Bhadrapada Krishna Ashtami when Rohini Nakshatra is also present (Tithi + Nakshatra); Hanuman Jayanti varies — North India observes it on Chaitra Purnima while South India observes it on Margashirsha Krishna Chaturdashi.",
          "The festival is usually celebrated on the day when its defining Tithi or Nakshatra is in effect at the relevant pivotal time — sunrise for vrats, midnight for Janmashtami, evening for Diwali Lakshmi Puja. Because that pivotal time falls in different parts of different timezones, the same festival can fall on different Gregorian dates in India versus North America versus Europe — and Om Panchang shows the correct date for your selected city.",
        ],
      },
      {
        heading: "Categories of Hindu festivals",
        paragraphs: [
          "The festival calendar can be broadly grouped into:",
        ],
        bullets: [
          "Major pan-Hindu festivals — Diwali, Holi, Navratri, Dussehra, Janmashtami, Ganesh Chaturthi, Maha Shivratri, Ram Navami, Raksha Bandhan.",
          "Regional festivals — Pongal (Tamil Nadu), Onam (Kerala), Bihu (Assam), Ugadi (Andhra/Karnataka), Gudi Padwa (Maharashtra), Baisakhi (Punjab), Pohela Boishakh (Bengal).",
          "Vrat days — Ekadashi (twice monthly), Pradosh Vrat (twice monthly), Sankashti Chaturthi (monthly), Amavasya (monthly), Purnima (monthly).",
          "Solar festivals — Makar Sankranti, Karka Sankranti, Vishu, Mesha Sankranti — based on the Sun's entry into a new rashi.",
          "Devotional months — Shravan (Shiva), Karthik (Vishnu), Margashirsha (Krishna), Magha (Shiva again), Vaishakha (Akshaya Tritiya, Buddha Purnima).",
        ],
      },
      {
        heading: "Using the festival calendar",
        paragraphs: [
          "The festival list and calendar grid show every festival for the year with its local date and a short description. Click any festival to see its complete article — the legend behind it, the rituals, the prescribed mantras, fasting rules, and any region-specific variations.",
          "If you observe Vrat days, the dedicated tabs (Ekadashi, Amavasya, Purnima, Pradosh Vrat) list every occurrence in the year with start and end times in your local timezone, so you know exactly when to begin and when to break the fast.",
        ],
      },
    ],
    faqs: [
      {
        q: "Why do some festivals have two dates listed?",
        a: "Occasionally a festival's defining Tithi spans two Gregorian days even in your timezone. In such cases we list both dates and indicate which day the festival is traditionally observed (usually the day when the Tithi prevails at sunrise, except for festivals like Janmashtami which depend on midnight, and Diwali which depends on evening pradosh-kaal).",
        },
      {
        q: "Are regional festivals included?",
        a: "Yes. The festival list includes major regional festivals like Pongal, Onam, Bihu, Ugadi, Gudi Padwa, Baisakhi, Bonalu, Bathukamma and Karthika Pournami. The Telugu Calendar variant in particular highlights Telugu-region festivals.",
      },
      {
        q: "How are festival dates calculated for cities outside India?",
        a: "We compute the underlying astronomical events (sunrise, sunset, the start and end of each Tithi and Nakshatra) for the latitude, longitude and timezone of the city you select. The festival is then placed on the calendar day on which its defining condition (sunrise within a particular Tithi, midnight in a particular Nakshatra, etc.) is satisfied locally — which can shift the festival by ±1 day from a printed Indian almanac.",
      },
      {
        q: "Can I add festivals to my Google Calendar?",
        a: "Yes. Click the calendar icon next to any upcoming festival and the page will generate a Google Calendar event with the correct date and a brief description of the festival.",
      },
    ],
  },

  "ekadashi-dates": {
    intro:
      "Ekadashi — the 11th lunar day of each fortnight — is observed twice every month as a Vishnu vrat. There are 24 Ekadashis in a regular year (and 26 in a year with Adhik Maas), each with a specific name and significance. This page lists all Ekadashi dates for the year along with parana (fast-breaking) windows in your local timezone.",
    sections: [
      {
        heading: "Why Ekadashi is observed",
        paragraphs: [
          "Ekadashi is considered one of the most spiritually potent vrats in the Vaishnava tradition. The Padma Purana, Skanda Purana and Vishnu Purana all describe Ekadashi as personally beloved to Lord Vishnu, with each of the 24 named Ekadashis associated with a specific spiritual reward — Mokshada Ekadashi grants liberation, Vaikunta Ekadashi (Mukkoti Ekadashi) opens the gates of Vaikuntha, and Nirjala Ekadashi (the most austere, observed without water) is said to give the merit of all 24 Ekadashis combined.",
          "Beyond the religious aspect, Ekadashi is a 24-hour digestive rest with practical health benefits — it falls roughly fortnightly, gives the digestive system a complete reset, and aligns the body with the lunar cycle.",
        ],
      },
      {
        heading: "How Ekadashi vrat is observed",
        paragraphs: [
          "The vrat traditionally begins at sunrise on Ekadashi and ends at the parana time on Dwadashi morning. During the fast, observers avoid grains and pulses (rice, wheat, dal, beans) entirely. Most people consume only fruits, milk, water and approved fasting foods (sabudana, kuttu, singhare ka atta, makhana, potatoes, sendha namak); strict observers do nirjala (no water).",
          "Breaking the fast at the correct parana time is considered as important as keeping the fast. Parana must be done after sunrise on Dwadashi but before the Hari Vasara (the first quarter of Dwadashi). Each Ekadashi card on this site shows the precise local parana window so you don't miss it.",
        ],
      },
      {
        heading: "The 24 Ekadashis through the year",
        paragraphs: [
          "Each lunar month has a Shukla Paksha Ekadashi and a Krishna Paksha Ekadashi. The named Ekadashis from Chaitra through Phalguna are:",
        ],
        bullets: [
          "Chaitra: Kamada (Shukla), Papmochani (Krishna)",
          "Vaishakha: Mohini (Shukla), Varuthini (Krishna)",
          "Jyeshtha: Nirjala (Shukla), Apara (Krishna)",
          "Ashadha: Devshayani (Shukla), Yogini (Krishna)",
          "Shravana: Putrada / Pavitra (Shukla), Kamika (Krishna)",
          "Bhadrapada: Parsva (Shukla), Aja (Krishna)",
          "Ashwin: Papankusha (Shukla), Indira (Krishna)",
          "Kartik: Devuthani / Prabodhini (Shukla), Rama (Krishna)",
          "Margashirsha: Mokshada / Vaikunta (Shukla), Utpanna (Krishna)",
          "Pausha: Putrada (Shukla), Saphala (Krishna)",
          "Magha: Jaya / Bhaimi (Shukla), Shattila (Krishna)",
          "Phalguna: Amalaki (Shukla), Vijaya (Krishna)",
        ],
      },
    ],
    faqs: [
      {
        q: "What is Smarta vs Vaishnava Ekadashi?",
        a: "Smartas (followers of broader Hindu tradition) observe Ekadashi when the Tithi is present at sunrise. Vaishnavas (followers of strict Vishnu tradition like ISKCON) sometimes observe a Bhaishma / Vaishnava Ekadashi one day later when astronomical conditions push the observance. We show both dates when they differ.",
      },
      {
        q: "Can I drink water during Ekadashi?",
        a: "Most observers drink water and consume fruits and approved fasting foods. Only Nirjala Ekadashi (Jyeshtha Shukla) is the strict no-water observance — and even that is optional. Choose the level of austerity you can sustain comfortably.",
      },
      {
        q: "What is parana and why does it matter?",
        a: "Parana is the formal breaking of the Ekadashi fast on Dwadashi morning. Tradition holds that parana should happen after sunrise but before the end of the first quarter of Dwadashi (the Hari Vasara); breaking the fast outside this window is said to nullify the merit of the vrat. Each Ekadashi card on this page shows the precise local parana window so you don't miss it.",
      },
      {
        q: "Should I do anything special on the day before Ekadashi (Dasami)?",
        a: "Yes. Dasami is the preparation day. Traditional observers eat a single satvik meal in the daytime on Dasami, avoid grains in the evening, and refrain from arguments and stimulating activities. This sets the body and mind up for the next day's fast.",
      },
    ],
  },

  "amavasya-dates": {
    intro:
      "Amavasya is the new-moon day at the end of the Krishna Paksha. It occurs once every lunar month and is the most important day for Pitru Tarpan (offerings to ancestors) and many forms of Tantra and Devi worship. This page lists all Amavasya dates for the year with their special names and the local timing of the Amavasya tithi.",
    sections: [
      {
        heading: "Why Amavasya matters in the Hindu calendar",
        paragraphs: [
          "On Amavasya, the Sun and Moon share the same celestial longitude — the Moon is invisible in the night sky. In Hindu thought, this is the time when the veil between the living and the ancestors is thinnest, making it the prescribed day for Shraddha and Tarpan rituals to honour departed family members.",
          "Several Amavasyas have particular religious importance: Mahalaya Amavasya (Bhadrapada Krishna) is the climax of Pitru Paksha; Diwali Amavasya (Kartik Krishna) is the festival of lights; Mauni Amavasya (Magha Krishna) is observed in silence at Prayagraj during Kumbh Mela; and Somavati Amavasya (an Amavasya falling on a Monday) is considered especially auspicious for women's vrats.",
        ],
      },
      {
        heading: "Pitru Tarpan and Shraddha on Amavasya",
        paragraphs: [
          "Pitru Tarpan involves offering water mixed with sesame seeds (tila) to the ancestors, usually in a south-facing direction. The detailed Shraddha ritual additionally involves Pinda Daan (rice ball offerings) and feeding Brahmins or the needy in the ancestors' name.",
          "While Pitru Tarpan can be performed on any Amavasya, Mahalaya Amavasya is the day on which observers traditionally honour all known and unknown ancestors. The 15 days of Pitru Paksha (Bhadrapada Krishna Paksha) preceding it are dedicated to ancestor rites.",
        ],
      },
      {
        heading: "Using the Amavasya calendar",
        paragraphs: [
          "Each entry shows the Amavasya date in your local timezone along with the precise Tithi start and end times. If a Somavati Amavasya, Mahalaya Amavasya or Diwali Amavasya falls in the year, it is highlighted. The page also flags eclipses (Surya Grahana on a Solar Eclipse Amavasya) when applicable.",
        ],
      },
    ],
    faqs: [
      {
        q: "Why does the Amavasya date sometimes differ from a printed Indian calendar?",
        a: "Amavasya is observed on the day when the new moon prevails during a specific time window (sunrise for Shraddha, midday for Tarpan). Because that window falls in a different part of different timezones, the calendar date can shift by one day for cities far from India.",
      },
      {
        q: "Can I do Tarpan without a priest?",
        a: "Yes. Simple Pitru Tarpan can be performed at home with water, sesame seeds and a clear intention. For full Shraddha rituals, especially Mahalaya, many families prefer to engage a priest who can guide the mantras and procedure.",
      },
      {
        q: "Is it true that nothing new should be started on Amavasya?",
        a: "Most traditional Panchangs avoid Amavasya for new beginnings — opening a business, signing a major contract, starting a journey. The reasoning is that the absence of moonlight is considered an inauspicious astronomical condition for shubh karya. However, Amavasya is highly recommended for ancestor rituals, certain Devi sadhanas, and introspective practices.",
      },
      {
        q: "What is Somavati Amavasya?",
        a: "Somavati Amavasya is an Amavasya that falls on a Monday (Somavar). It is considered exceptionally auspicious for married women, who traditionally observe a vrat for the long life of their husbands and offer water to a peepal tree. Somavati Amavasya is rare — typically only one or two per year.",
      },
      {
        q: "Are eclipses always on Amavasya?",
        a: "Solar eclipses (Surya Grahana) only happen on Amavasya, when the Moon passes between the Sun and Earth. Lunar eclipses (Chandra Grahana) only happen on Purnima. Not every Amavasya has an eclipse — the lunar nodes (Rahu and Ketu) need to be aligned. The page flags eclipse Amavasyas when they occur.",
      },
    ],
  },

  "purnima-dates": {
    intro:
      "Purnima is the full-moon day at the end of the Shukla Paksha. It occurs once every lunar month and is one of the most spiritually charged days in the Hindu calendar — the moon is at its brightest and fullest, and many of the year's biggest festivals fall on Purnimas. This page lists all Purnima dates for the year with their named significance.",
    sections: [
      {
        heading: "The most significant Purnimas",
        paragraphs: [
          "While every Purnima carries spiritual weight, several stand out:",
        ],
        bullets: [
          "Chaitra Purnima — Hanuman Jayanti (in North Indian tradition).",
          "Vaishakha Purnima — Buddha Purnima, the birth, enlightenment and parinirvana of Lord Buddha.",
          "Jyeshtha Purnima — Vat Purnima, observed by married women for the long life of their husbands.",
          "Ashadha Purnima — Guru Purnima, the day to honour all gurus, especially Veda Vyasa.",
          "Shravana Purnima — Raksha Bandhan and Narali Purnima.",
          "Bhadrapada Purnima — start of Pitru Paksha.",
          "Ashwin Purnima — Sharad Purnima, the night Lord Krishna is said to have danced the Maha Raas.",
          "Kartik Purnima — Dev Diwali, Tulsi Vivah, Sikh Guru Nanak Jayanti.",
          "Margashirsha Purnima — Dattatreya Jayanti.",
          "Pausha Purnima — start of Magh Snan at Prayagraj.",
          "Magha Purnima — bathing in the Triveni Sangam is said to wash away sins.",
          "Phalguna Purnima — Holika Dahan, eve of Holi.",
        ],
      },
      {
        heading: "Why Purnima is observed",
        paragraphs: [
          "The full moon's gravitational and tidal influence on the Earth's water bodies is well documented; Hindu tradition holds that the same lunar pull also amplifies the mind and emotions of all beings. Spiritual observances on Purnima — fasting, temple visits, satyanarayan vrat, mantra japa — are believed to be magnified in their effect.",
          "The Satyanarayan Puja, performed in many North Indian and South Indian households on Purnimas, is considered universally accessible and is often done to mark important family milestones — house-warming, completion of a project, recovery from illness, or simply at regular monthly intervals.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the difference between Purnima and Pournami?",
        a: "They are the same day. Purnima is the Sanskrit / Hindi term and Pournami is the Tamil / Telugu term for the full moon day. Both refer to the 15th tithi of the Shukla Paksha.",
      },
      {
        q: "When is the Satyanarayan Puja best performed?",
        a: "Satyanarayan Puja is most commonly performed on Purnima, though Sankashti Chaturthi and Ekadashi are also acceptable. The puja can also be done on any auspicious day — Thursday is especially favoured.",
      },
      {
        q: "What is Sharad Purnima and why is it special?",
        a: "Sharad Purnima is the full moon of the lunar month Ashwin (September–October). The Moon is traditionally said to be at its brightest and closest to Earth on this night. Devotees prepare kheer (sweet milk-rice) and leave it under the moonlight overnight, believing the moonlight imbues it with healing properties. It is also the night Lord Krishna is said to have danced the Maha Raas with the gopis.",
      },
      {
        q: "Can I do Chandra darshan on every Purnima?",
        a: "Yes. Chandra darshan (gazing at the full moon) on Purnima is a simple, accessible spiritual practice associated with mental peace and emotional balance. Some traditions add specific mantras or offerings (white flowers, kheer, water with chandan); others keep it as quiet contemplation under the moonlight.",
      },
      {
        q: "Why does Purnima sometimes fall on a different date in different regions?",
        a: "Like all Tithi-based observances, Purnima is observed on the day when the full-moon Tithi prevails at the relevant time of day (sunrise for most rituals; pradosh-kaal for some pujas). Because that moment falls in different parts of different timezones, the Gregorian date can shift by ±1 day for cities outside India. This page always shows the locally correct date.",
      },
    ],
  },

  "pradosh-vrat": {
    intro:
      "Pradosh Vrat is observed on the 13th tithi (Trayodashi) of each fortnight, and is dedicated to Lord Shiva. The vrat is performed during the pradosh kaal — the 1.5-hour window straddling sunset, considered the most sacred time of the day for Shiva worship. This page lists every Pradosh Vrat in the year with the local pradosh kaal window.",
    sections: [
      {
        heading: "What makes Pradosh Vrat special",
        paragraphs: [
          "The Skanda Purana describes Pradosh as the time when Lord Shiva and Goddess Parvati are said to be in a particularly receptive mood, dancing the Tandava on Mount Kailash. Worship offered during pradosh kaal is believed to grant Shiva's grace many times over compared to other times.",
          "The day's weekday adds an additional dimension — Som Pradosh (Monday) is associated with mental peace and good progeny, Bhauma Pradosh (Tuesday) with wealth and removal of debts, Saumya Pradosh (Wednesday) with knowledge, Guru Pradosh (Thursday) with ancestral blessings, Bhrigu Pradosh (Friday) with marital happiness, Shani Pradosh (Saturday) with relief from Saturn's affliction, and Ravi Pradosh (Sunday) with good health and longevity.",
        ],
      },
      {
        heading: "How the vrat is observed",
        paragraphs: [
          "Observers traditionally fast through the day — most do a partial fast (one meal during the day, fruits and milk in between) rather than nirjala. The fast continues until the pradosh kaal puja, which is performed at the local Shiva temple or at a home altar with a Shiva Linga.",
          "The puja involves Abhishekam (ritual bathing of the Shiva Linga with water, milk, honey, ghee and panchamrit), Bilva Patra offering, lighting of a ghee lamp, and recitation of the Shiva Tandava Stotra or Mahamrityunjaya Mantra. The fast is broken after the pradosh kaal puja, traditionally with prasad from the temple.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I observe Pradosh without going to a temple?",
        a: "Yes. The vrat can be observed entirely at home with a Shiva Linga, photo or even a simple intention. The essential elements are the fast, the pradosh kaal puja and the recitation of Shiva mantras.",
      },
      {
        q: "Why does each Pradosh have a different name?",
        a: "Pradosh is named by the weekday on which it falls — Som Pradosh on Monday, Shani Pradosh on Saturday, etc. Each weekday is ruled by a different planet and hence the spiritual reward of the vrat takes on the colour of that planet's domain.",
      },
      {
        q: "How long is the pradosh kaal window?",
        a: "Pradosh kaal is traditionally defined as the period from 45 minutes before sunset to 45 minutes after sunset — roughly a 90-minute window. The exact start and end depends on your city's sunset time, which is why this site shows the local pradosh kaal for the city you've selected.",
      },
      {
        q: "What is Maha Pradosh?",
        a: "Maha Pradosh is a Pradosh Vrat that falls on a Saturday (Shani Pradosh) and additionally coincides with the lunar Krishna Trayodashi being prominent. It is considered especially powerful for relief from Saturn-related afflictions like Sade Sati and Shani Dhaiyya. Maha Pradosh is rare — typically only one or two per year.",
      },
      {
        q: "Can I observe Pradosh if I cannot fast?",
        a: "Yes. The vrat is not strictly about fasting — its essence is the pradosh-kaal Shiva worship. If a full fast is not feasible (for medical reasons, age, pregnancy or work demands), even a partial observance with a satvik diet, lamp lighting, and chanting at sunset is considered worthwhile.",
      },
    ],
  },

  "baby-names-nakshatra": {
    intro:
      "In Hindu tradition, a child's name is traditionally chosen based on the Janma Nakshatra (the lunar mansion the Moon was in at the moment of birth). Each of the 27 nakshatras is divided into 4 padas (quarters), and each pada is associated with a specific syllable. Names beginning with the syllable of the child's nakshatra-pada are considered to attune the child's identity with the cosmic vibrations present at birth.",
    sections: [
      {
        heading: "Why Nakshatra-based naming matters",
        paragraphs: [
          "The Namakaran (naming) ceremony is one of the 16 Sanskaras (sacraments) in Hindu life and traditionally happens 11 to 16 days after birth. The most enduring of the four names traditionally given is the Rashi Naam — the name aligned with the Janma Nakshatra and pada — because it carries the imprint of the child's astrological identity.",
          "Each of the 27 nakshatras has 4 padas of 3°20′ each. Each pada corresponds to one of the four syllables associated with the parent nakshatra. So a child born in the second pada of Rohini Nakshatra will receive a name beginning with \"Va\" — names like Vasudha, Vasanta or Varun.",
        ],
      },
      {
        heading: "How to use the baby name finder",
        paragraphs: [
          "Open the Baby Names tab and select the child's Janma Nakshatra and pada (or just the nakshatra if you don't know the precise pada). The tool returns Hindu baby names — both boy and girl — that begin with the appropriate syllable, along with the meaning of each name.",
          "If you don't know the child's Janma Nakshatra, use the Kundali calculator first with the birth date, time and place — the resulting chart will show the Janma Nakshatra and pada precisely. Then return to the Baby Names tab to find suitable names.",
        ],
      },
      {
        heading: "Beyond the syllable: meaning and family tradition",
        paragraphs: [
          "While the syllable is the traditional starting point, modern families often layer additional considerations on top — the meaning of the name, its sound and pronounceability across languages, family conventions (some families pass down a particular sound or root), and devotional dedication (names of deities, qualities or sacred concepts).",
          "Many parents shortlist 5 to 10 names with the correct syllable and then choose based on these additional factors. The list of names provided here is non-exhaustive — feel free to combine the suggested syllables with your own family preferences.",
        ],
      },
    ],
    faqs: [
      {
        q: "What if I don't know the exact birth time?",
        a: "If the time is approximate, the Janma Nakshatra usually remains correct (the Moon spends ~24 hours in a single nakshatra), but the pada may be uncertain. In that case, pick a name that fits any of the four syllables for your nakshatra.",
      },
      {
        q: "Can the same name work for boys and girls?",
        a: "Some names are gender-neutral or have masculine/feminine variants. The name finder lists names by gender so you can pick the version appropriate for your child.",
      },
      {
        q: "Is Namakaran on the 11th or 12th day after birth?",
        a: "It varies by family tradition and region. The most common days are the 11th and 12th day after birth (Niskramana / Namakaran), though some communities perform it on the 16th day or on a later auspicious Muhurat. The precise day is less important than choosing a Muhurat with a favourable Tithi and Nakshatra for the ceremony.",
      },
      {
        q: "Can I name my child outside the nakshatra syllable?",
        a: "Yes — many modern Hindu families do. The traditional approach uses the nakshatra-pada syllable for the Rashi Naam (the astrological name), and then chooses a separate everyday name based on personal preference. Both names are recorded in family records, and either can be used in daily life.",
      },
    ],
  },

  "panchang-today": {
    intro:
      "Panchang Today shows you the live Hindu almanac for the current date in your selected city. The five elements — Tithi, Nakshatra, Yoga, Karana and Vara — are computed from the actual astronomical positions of the Sun and Moon for your local timezone, along with sunrise, sunset, Rahu Kalam, Yamagandam, Gulika Kalam and the day's auspicious Muhurta windows.",
    sections: [
      {
        heading: "What today's Panchang tells you",
        paragraphs: [
          "Today's Panchang answers a simple, ancient question: \"What kind of day is today, religiously and astronomically?\" Different combinations of Tithi-Nakshatra-Yoga produce different recommendations — some days are auspicious for new beginnings, some for completion of work, some for spiritual practice, some for fasting, and some are best kept low-key. The Panchang gives you the underlying data; how to use it depends on the activity you have in mind.",
          "The Tithi tells you the moon-phase day (1st through 30th of the lunar month) and which paksha (Shukla or Krishna) we are in. The Nakshatra tells you which of the 27 lunar mansions the Moon is in — useful for personal events because each individual is born under a specific janma nakshatra. The Yoga is a single-word characterisation of the day's energy (Siddha, Shubha, Vishkambha, etc.). The Karana further refines the time-slot quality. And the Vara — the weekday — connects the day to its ruling planet.",
        ],
      },
      {
        heading: "How to read the inauspicious windows",
        paragraphs: [
          "Three time slots in each day are conventionally avoided for important new activities:",
        ],
        bullets: [
          "Rahu Kalam — a ~90 minute window that shifts each weekday. Avoid starting journeys, signing contracts or beginning new ventures.",
          "Yamagandam — another ~90 minute window, similar in effect to Rahu Kalam. Avoid major decisions and signing important papers.",
          "Gulika Kalam — a third ~90 minute window, considered the least severe of the three. Used to be paid extra attention for activities involving accumulation (storing grain, opening savings, etc.).",
        ],
      },
      {
        heading: "What to do during favourable windows",
        paragraphs: [
          "Conversely, several windows of the day are considered especially favourable. Brahma Muhurta — the 96-minute period before sunrise — is regarded as the best time for meditation, spiritual study and creative work. Abhijit Muhurta — the 48-minute window centred at solar noon — is one of the most powerful Muhurtas for new beginnings (excluded only on Wednesday). The Choghadiya breakdown further divides the day and night into 8 slots each, labelled Amrit, Shubh, Labh, Char, Udveg, Rog and Kaal — pick the green ones for important activities and avoid the red ones.",
        ],
      },
    ],
    faqs: [
      {
        q: "Why does today's Panchang show a different Tithi than my hometown's?",
        a: "Tithis change at specific times during the day, and that time falls in different positions of different timezones. If your hometown is 12 hours ahead of you, the Tithi the page is showing for \"today\" may already have changed in your hometown — both pages are correct for their respective locations.",
      },
      {
        q: "What if Rahu Kalam falls during my work hours? Is the whole day ruined?",
        a: "Not at all. Rahu Kalam is only relevant for *initiating* new activities. Continuing existing work, attending meetings already on your calendar, or doing routine tasks during Rahu Kalam is fine. The traditional advice is to avoid pressing the \"start\" button on something new during that window.",
      },
      {
        q: "Can I trust the sunrise time shown here for my city?",
        a: "Yes. Sunrise and sunset are computed from the Sun's actual altitude with standard atmospheric refraction correction (~34 arcminutes). Times match official sunrise/sunset tables to within ±2 minutes for any normal latitude.",
      },
    ],
  },

  "choghadiya-today": {
    intro:
      "The Choghadiya divides each day and each night into 8 time slots of roughly 90 minutes each. Each slot is named — Amrit, Shubh, Labh, Char, Udveg, Rog or Kaal — and labelled either auspicious (use it), neutral (proceed with care) or inauspicious (avoid it). It is one of the most practical, fine-grained Muhurta tools in the Hindu tradition, used widely across Gujarat, Maharashtra and Rajasthan.",
    sections: [
      {
        heading: "How Choghadiya is calculated",
        paragraphs: [
          "Each day from sunrise to sunset has 8 Choghadiya slots; each night from sunset to sunrise has another 8. Because day and night length change with the season, the slot length is not exactly 90 minutes — it is 1/8th of the daylight period for daytime slots and 1/8th of the nighttime period for nighttime slots.",
          "The cycle of 7 names (Udveg, Char, Labh, Amrit, Kaal, Shubh, Rog) repeats but is offset by the weekday. So Sunday's first daytime Choghadiya is always Udveg (ruled by the Sun), Monday's is Amrit (ruled by the Moon), Tuesday's is Rog, Wednesday's is Labh, Thursday's is Shubh, Friday's is Char, and Saturday's is Kaal.",
        ],
      },
      {
        heading: "What each Choghadiya means",
        paragraphs: [
          "The seven Choghadiya names correspond to seven planetary energies and seven kinds of activity:",
        ],
        bullets: [
          "Amrit (Moon) — auspicious. Best for any new beginning, especially involving emotional or family matters.",
          "Shubh (Jupiter) — auspicious. Excellent for marriage, religious activities, signing important documents.",
          "Labh (Mercury) — auspicious. Best for business, signing deals, financial activities, learning.",
          "Char (Venus) — neutral. Favourable for travel and movement; the name literally means \"movable\".",
          "Udveg (Sun) — inauspicious. Avoid for new starts. Government and authority work is sometimes considered acceptable here.",
          "Rog (Mars) — inauspicious. Avoid for any new venture; if war and conflict are unavoidable (rare!), this slot is paradoxically favoured.",
          "Kaal (Saturn) — inauspicious. The most cautioned slot; avoid all important new activities.",
        ],
      },
      {
        heading: "How to use Choghadiya practically",
        paragraphs: [
          "Open the Choghadiya tab and the page shows you the current slot at the top, along with the full day and night schedule below. Plan important calls, contract signings or new-venture launches during Amrit, Shubh or Labh slots. Use Char slots for travel. Avoid Kaal, Rog and Udveg if possible — and if you absolutely must do something during one, accept that the Choghadiya warning is just a hint, not a curse.",
          "For routine activities — eating, sleeping, exercising, watching a film — you don't need to consult the Choghadiya. It exists for the handful of decisions in the day where timing matters.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is Choghadiya more important than the daily Tithi or Nakshatra?",
        a: "They serve different purposes. The Tithi and Nakshatra describe the religious and astrological character of the whole day. Choghadiya gives you a fine-grained slot-level view within the day. For most activities you would consult both — first check that the day is acceptable (Tithi/Nakshatra), then pick a good Choghadiya within it.",
      },
      {
        q: "Why does the Choghadiya schedule differ from one Panchang to another?",
        a: "Variations are usually due to differences in sunrise calculation (which varies by city) and rounding of slot boundaries. The names and their order are universal across traditions.",
      },
      {
        q: "Can I use Choghadiya when travelling abroad?",
        a: "Yes — and you should. Choghadiya is anchored to local sunrise and sunset, so it always reflects your current city. Set the city at the top of the page to your travel destination and the schedule recomputes.",
      },
    ],
  },

  "nakshatra-today": {
    intro:
      "Today's Nakshatra is the lunar mansion the Moon is currently traversing. There are 27 nakshatras, each spanning 13°20′ of the zodiac, and the Moon spends roughly 22–25 hours in each one. Today's Nakshatra is one of the most consulted pieces of Hindu calendar information — it influences the auspiciousness of the day for personal events, names a child born today, and feeds into the day's Tara Bala (the strength of the day for each nakshatra-born person).",
    sections: [
      {
        heading: "Why today's nakshatra matters",
        paragraphs: [
          "Each nakshatra has a presiding deity, a ruling planet, a symbol, an animal and a guna (sattva, rajas or tamas). When the Moon transits a nakshatra, the qualities of that nakshatra colour the day's mood and influence which activities are favoured. Pushya Nakshatra, for example, is universally considered one of the most auspicious — it is the only nakshatra not subject to the usual restrictions for buying gold, starting new ventures or beginning education. Magha Nakshatra is associated with ancestors and Pitru worship. Ardra is sharp and emotionally intense. Rohini is gentle, fertile and creative.",
          "Knowing today's Nakshatra also lets you compute Tara Bala for any individual — the relative auspiciousness of today for a person born under a different nakshatra. There are 9 Taras (Janma, Sampat, Vipat, Kshema, Pratyari, Sadhaka, Vadha, Mitra, Ati Mitra), and they cycle through the 27 nakshatras in groups of 3.",
        ],
      },
      {
        heading: "The 27 nakshatras and their rulers",
        paragraphs: [
          "The 27 nakshatras and their planetary rulers are:",
        ],
        bullets: [
          "Ashwini (Ketu), Bharani (Venus), Krittika (Sun) — Aries to early Taurus.",
          "Rohini (Moon), Mrigashira (Mars), Ardra (Rahu) — mid Taurus to early Gemini.",
          "Punarvasu (Jupiter), Pushya (Saturn), Ashlesha (Mercury) — Gemini to Cancer.",
          "Magha (Ketu), Purva Phalguni (Venus), Uttara Phalguni (Sun) — Leo to early Virgo.",
          "Hasta (Moon), Chitra (Mars), Swati (Rahu) — Virgo to early Libra.",
          "Vishakha (Jupiter), Anuradha (Saturn), Jyeshtha (Mercury) — Libra to Scorpio.",
          "Mula (Ketu), Purva Ashadha (Venus), Uttara Ashadha (Sun) — Sagittarius.",
          "Shravana (Moon), Dhanishta (Mars), Shatabhisha (Rahu) — Capricorn to early Aquarius.",
          "Purva Bhadrapada (Jupiter), Uttara Bhadrapada (Saturn), Revati (Mercury) — Aquarius to Pisces.",
        ],
      },
      {
        heading: "Using today's nakshatra",
        paragraphs: [
          "If your janma nakshatra matches today's nakshatra, today is your Janma Tara — traditionally a day for personal restraint and reflection rather than aggressive new starts. If today's nakshatra is the 3rd, 5th or 7th from your janma nakshatra (Vipat, Pratyari, Vadha), it is considered a less favourable day; the 4th, 6th and 8th (Kshema, Sadhaka, Mitra) are favourable.",
          "For new ventures or important decisions today, look up which nakshatra rules today and check whether classical texts recommend it for your activity. The Panchang card on this page shows you the current nakshatra, its end time, and the next one starting.",
        ],
      },
    ],
    faqs: [
      {
        q: "What if today's nakshatra ends mid-day?",
        a: "The nakshatra in effect at sunrise is generally considered the day's nakshatra for most rituals. For an activity scheduled later in the day, however, you should use whichever nakshatra is in effect at that time — both are shown on the card.",
      },
      {
        q: "Can the same nakshatra recur in consecutive days?",
        a: "Yes. Because the Moon spends 22–25 hours in a nakshatra and a calendar day is 24 hours, the same nakshatra can be in effect at sunrise on two consecutive days. This phenomenon is called Vridhi (extension) and is generally considered favourable.",
      },
    ],
  },

  "rahu-kalam-today": {
    intro:
      "Rahu Kalam is the inauspicious time slot ruled by the shadow planet Rahu — about 90 minutes long, occurring at a different fixed time each weekday. Hindu tradition advises avoiding the start of new ventures, important journeys, contract signings and major decisions during Rahu Kalam. This page shows today's Rahu Kalam for your selected city, along with Yamagandam and Gulika Kalam.",
    sections: [
      {
        heading: "How Rahu Kalam is calculated",
        paragraphs: [
          "Rahu Kalam falls at a specific 1/8th-of-the-day slot that depends on the weekday. The rule of thumb most South Indians remember is the mnemonic \"Mother Saw Father Wearing The Turban Sunday\" — Monday: 7:30–9:00, Saturday: 9:00–10:30, Friday: 10:30–12:00, Wednesday: 12:00–13:30, Thursday: 13:30–15:00, Tuesday: 15:00–16:30, Sunday: 16:30–18:00. These are approximate times for a 6 AM sunrise and 6 PM sunset; the actual window shifts by your local sunrise/sunset.",
          "Because Rahu Kalam is computed as the 1/8th window of the daylight period (sunrise to sunset), its actual clock time slides through the seasons. In summer when daylight is longer, the Rahu Kalam window expands and its midpoint shifts; in winter the opposite. We compute it precisely from your local sunrise and sunset.",
        ],
      },
      {
        heading: "Why Rahu Kalam matters",
        paragraphs: [
          "Rahu in Vedic astrology is the lunar north node — a shadow planet associated with confusion, sudden disruption, illusion and misdirection. The classical view is that activities started during Rahu Kalam carry Rahu's energy and tend to encounter unexpected obstacles, miscommunication, or outcomes different from what was intended.",
          "Rahu Kalam is most strongly applied to new beginnings — opening a business, signing a marriage agreement, starting a journey, beginning a new course of study, launching a product. It is less restrictive on continuing or routine activities. Many people simply avoid the window for any avoidable major decision and proceed normally otherwise.",
        ],
      },
      {
        heading: "Yamagandam and Gulika Kalam",
        paragraphs: [
          "Two related inauspicious windows are also tracked alongside Rahu Kalam: Yamagandam (ruled by Yama, the lord of death) is similar in caution to Rahu Kalam and follows its own weekday cycle. Gulika Kalam is generally considered the mildest of the three but is paid extra attention for activities involving accumulation (storing grain, opening savings accounts) since Gulika is a son of Saturn and inherits Saturn's hoarding tendency.",
          "Together, the three windows account for roughly 4.5 hours of each day, leaving plenty of clock time for important activities. The tab here shows all three windows in your local timezone.",
        ],
      },
    ],
    faqs: [
      {
        q: "What if I have to start something during Rahu Kalam?",
        a: "If unavoidable, traditional remedies include reciting Hanuman Chalisa (Hanuman is said to keep Rahu in check), keeping a piece of black cloth or a Rudraksha on your person, and proceeding with extra care and patience. Many people report no ill effects from working through Rahu Kalam — it is a probabilistic warning, not a curse.",
      },
      {
        q: "Why does Rahu Kalam vary by city?",
        a: "Because it is computed from your city's actual sunrise and sunset times. Sunrise in Mumbai is several hours before sunrise in New York, so the Rahu Kalam window for Tuesday in Mumbai is also several hours before Tuesday in New York.",
      },
      {
        q: "Is Rahu Kalam observed at night too?",
        a: "Traditionally no — Rahu Kalam refers only to the daytime window between sunrise and sunset. The nighttime equivalent (Rahu Kalam Ratri) exists in some texts but is rarely consulted.",
      },
    ],
  },

  "hora-today": {
    intro:
      "Hora is the Vedic system of planetary hours — each hour of the day and night is ruled by one of the seven classical planets (Surya, Chandra, Mangala, Budha, Guru, Shukra, Shani), and choosing an hour ruled by a planet favourable to your activity is a powerful, fine-grained Muhurta tool. This page shows today's complete Hora schedule for your city.",
    sections: [
      {
        heading: "How the Hora cycle works",
        paragraphs: [
          "There are 24 horas in a day — 12 daytime horas from sunrise to sunset, and 12 nighttime horas from sunset to sunrise. The first hora of any day is always ruled by the planet of that weekday (Surya on Sunday, Chandra on Monday, Mangala on Tuesday, Budha on Wednesday, Guru on Thursday, Shukra on Friday, Shani on Saturday). After that, the horas cycle in the order: Sun → Venus → Mercury → Moon → Saturn → Jupiter → Mars → Sun (the \"Chaldean order\" of decreasing apparent speed of the planets in geocentric astronomy).",
          "Because daylight changes through the year, daytime horas are not exactly 60 minutes — they are 1/12th of the daytime period. Likewise nighttime horas are 1/12th of the nighttime period. In summer, daytime horas can stretch to 70+ minutes; in winter they shrink to 50 minutes or less.",
        ],
      },
      {
        heading: "What each planet's hora is good for",
        paragraphs: [
          "Each planet rules a domain of activities, and its hora is the ideal time to perform those activities:",
        ],
        bullets: [
          "Surya (Sun) hora — favourable for dealings with government, authority figures, leadership matters, and asserting yourself.",
          "Chandra (Moon) hora — favourable for travel by water, dealing with the public, mother-related matters, and emotional / nurturing activities.",
          "Mangala (Mars) hora — favourable for surgery, real estate, sports, dealing with siblings, and any high-energy or competitive activity.",
          "Budha (Mercury) hora — favourable for business, communication, education, writing, contracts and negotiation.",
          "Guru (Jupiter) hora — favourable for spiritual practices, marriage, religious ceremonies, dealing with teachers and elders, and starting any auspicious new venture.",
          "Shukra (Venus) hora — favourable for love, art, music, beauty, vehicles, comforts and creative work.",
          "Shani (Saturn) hora — favourable for hard physical labour, dealing with employees, real estate registration, and matters requiring patience and discipline.",
        ],
      },
      {
        heading: "Using Hora practically",
        paragraphs: [
          "The Hora tab shows the current hora at the top with the planet symbol and a one-line activity recommendation, followed by the full day and night schedule. For an important phone call you want to go well, pick a Mercury or Jupiter hora. For a job interview, Mercury, Jupiter or the planet ruling your career sector. For something romantic, Venus. For a serious legal or government matter, Sun or Saturn (depending on whether you want authority or patience).",
          "Hora is more granular than Choghadiya (1 hour vs 1.5 hours) and easier to align to specific clock times. Many practitioners use both — Choghadiya for the broad slot, Hora for the fine-tuned moment within it.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the difference between Hora and Choghadiya?",
        a: "Both divide the day into auspicious / inauspicious slots, but Choghadiya uses 8 slots of ~90 minutes each while Hora uses 24 slots of ~60 minutes each. Hora is also more activity-specific — each planet's hora favours specific types of activity — while Choghadiya is more general-purpose.",
      },
      {
        q: "Are Rahu Kalam and Hora compatible?",
        a: "Rahu Kalam is a separate inauspicious window that overlays the entire system. Even if a Hora is favourable for your activity, if it falls within Rahu Kalam, the Rahu Kalam caution generally overrides for new beginnings. Pick a hora that falls outside Rahu Kalam, Yamagandam and Gulika Kalam if possible.",
      },
      {
        q: "Can I use Hora at night?",
        a: "Yes. Nighttime horas are equally valid and follow the same planetary cycle. The first nighttime hora is ruled by the 5th planet from the day-ruler in Chaldean order (so Sunday's first nighttime hora is Jupiter, Monday's is Venus, etc.). The schedule shows both day and night horas.",
      },
    ],
  },

  "brahma-muhurta": {
    intro:
      "Brahma Muhurta — the \"Creator's hour\" — is the 96-minute window ending at sunrise. It is regarded in the Vedas, Ayurveda and Yoga as the single most spiritually and physically beneficial period of the entire 24-hour day, traditionally recommended for meditation, study of sacred texts, japa (mantra repetition) and creative work. This page shows today's exact Brahma Muhurta window for your city.",
    sections: [
      {
        heading: "What Brahma Muhurta is",
        paragraphs: [
          "By classical Hindu time reckoning, a muhurta is 48 minutes (1/30th of a day). Brahma Muhurta is the second-to-last muhurta of the night — the period from 96 minutes before sunrise to 48 minutes before sunrise. (Some traditions extend the period to all 96 minutes ending at sunrise; we show this fuller window on the page along with its midpoint.)",
          "The exact clock time of Brahma Muhurta therefore changes every day with sunrise. In summer when sunrise is around 5:30 AM, Brahma Muhurta is roughly 3:54–5:30 AM. In winter when sunrise is around 7:00 AM, it is roughly 5:24–7:00 AM. The page computes the precise window for your city's actual sunrise.",
        ],
      },
      {
        heading: "Why Brahma Muhurta is considered special",
        paragraphs: [
          "Several features make Brahma Muhurta unique. The ambient temperature is at its day's lowest — alert but not yet stressful. Atmospheric ozone and oxygen levels are reportedly at their daily peak. The mind is rested from sleep but not yet engaged with the day's demands, making it naturally settled and receptive. Traditional texts hold that the sattva guna (the quality of clarity, balance, lightness) is at its strongest during this window, while rajas (action) and tamas (inertia) are dormant.",
          "These conditions are why every major Hindu spiritual tradition — Yoga, Tantra, Vedanta, the various Bhakti schools — recommends Brahma Muhurta as the prime time for sadhana. It is also the time recommended in classical Sanskrit texts for memorising verses, learning new material, and creative composition.",
        ],
      },
      {
        heading: "Practical Brahma Muhurta routine",
        paragraphs: [
          "A typical Brahma Muhurta routine looks like: wake up at the start of the window, drink a glass of warm water, perform morning ablutions, then sit for 20–60 minutes of meditation, mantra japa, pranayama or scriptural study before sunrise. The window naturally ends around sunrise, after which the day's normal activities (Sandhya Vandana, exercise, work) begin.",
          "If a full 96-minute practice is not feasible, even waking 15–30 minutes earlier than usual to catch the tail end of Brahma Muhurta is worthwhile. The benefits accumulate over weeks — many practitioners report better mental clarity, emotional steadiness, and physical energy throughout the day after sustaining the routine for a month or more.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do I have to be religious to benefit from Brahma Muhurta?",
        a: "No. The atmospheric and physiological characteristics of the period — cool temperature, low noise, low electromagnetic activity, well-rested but receptive mind — are valuable for any kind of focused work. Modern professionals use the Brahma Muhurta window for deep work, writing, exercise and meditation, regardless of religious framing.",
      },
      {
        q: "What if my sleep schedule doesn't allow waking that early?",
        a: "The benefit of Brahma Muhurta depends on actually being well-rested when you wake. If you can't go to bed correspondingly early (around 9–10 PM), forcing a 4 AM wakeup will leave you sleep-deprived and the practice will not work. Build the habit gradually — push your bedtime back by 15 minutes a week and your wakeup correspondingly.",
      },
      {
        q: "Is Brahma Muhurta the same as Sandhya Vandana?",
        a: "They are related but distinct. Sandhya Vandana is the formal Vedic prayer-ritual performed at the three sandhyas (sunrise, noon and sunset). Brahma Muhurta is the time slot just before the morning Sandhya — many practitioners do their meditation and japa in Brahma Muhurta and then perform Sandhya Vandana at sunrise itself.",
      },
    ],
  },
};
