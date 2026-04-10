export interface VratEntry {
  date: string;       // YYYY-MM-DD
  name: string;
  type: "ekadashi" | "amavasya" | "purnima" | "pradosh" | "sankashti" | "other";
  paksha?: "shukla" | "krishna";
  month?: string;
  significance?: string;
  special?: boolean;
}

export const VRAT_DATA: VratEntry[] = [
  // ─── PURNIMA 2025 ───
  { date: "2025-01-13", name: "Paush Purnima", type: "purnima", month: "Paush", significance: "Sacred river bath, Magh Mela begins" },
  { date: "2025-02-12", name: "Magha Purnima", type: "purnima", month: "Magha", significance: "Holy dip in Sangam, Magh Mela peak" },
  { date: "2025-03-13", name: "Phalguna Purnima (Holika)", type: "purnima", month: "Phalguna", significance: "Holika Dahan, triumph of good over evil", special: true },
  { date: "2025-04-12", name: "Chaitra Purnima", type: "purnima", month: "Chaitra", significance: "Hanuman Jayanti, Chitra Pournami" },
  { date: "2025-05-12", name: "Vaishakha Purnima (Buddha Purnima)", type: "purnima", month: "Vaishakha", significance: "Birth of Lord Buddha", special: true },
  { date: "2025-06-11", name: "Jyeshtha Purnima (Vat Purnima)", type: "purnima", month: "Jyeshtha", significance: "Vat Savitri Vrat for married women" },
  { date: "2025-07-10", name: "Ashadha Purnima (Guru Purnima)", type: "purnima", month: "Ashadha", significance: "Guru Purnima — honour to teachers & gurus", special: true },
  { date: "2025-08-09", name: "Shravana Purnima (Raksha Bandhan)", type: "purnima", month: "Shravana", significance: "Raksha Bandhan, Hayagriva Jayanti", special: true },
  { date: "2025-09-07", name: "Bhadrapada Purnima", type: "purnima", month: "Bhadrapada", significance: "Sharad Purnima prep" },
  { date: "2025-10-06", name: "Ashwina Purnima (Sharad Purnima)", type: "purnima", month: "Ashwina", significance: "Sharad Purnima — moonlight believed to have healing properties", special: true },
  { date: "2025-11-05", name: "Kartika Purnima (Dev Diwali)", type: "purnima", month: "Kartika", significance: "Dev Diwali, Tripuri Purnima, Guru Nanak Jayanti", special: true },
  { date: "2025-12-04", name: "Margashirsha Purnima (Dattatreya Jayanti)", type: "purnima", month: "Margashirsha", significance: "Dattatreya Jayanti" },

  // ─── PURNIMA 2026 (13 — Adhika Maas year) ───
  { date: "2026-01-03", name: "Paush Purnima", type: "purnima", month: "Paush", significance: "Sacred river bath, Magh Mela begins" },
  { date: "2026-02-01", name: "Magha Purnima", type: "purnima", month: "Magha", significance: "Holy dip in Sangam, Magh Mela peak" },
  { date: "2026-03-03", name: "Phalguna Purnima (Holika)", type: "purnima", month: "Phalguna", significance: "Holika Dahan — bonfire of Prahlad's triumph", special: true },
  { date: "2026-04-02", name: "Chaitra Purnima", type: "purnima", month: "Chaitra", significance: "Hanuman Jayanti, Chitra Pournami", special: true },
  { date: "2026-05-01", name: "Vaishakha Purnima (Buddha Purnima)", type: "purnima", month: "Vaishakha", significance: "Birth of Lord Buddha", special: true },
  { date: "2026-05-31", name: "Adhika Jyeshtha Purnima (Purushottam)", type: "purnima", month: "Adhika Jyeshtha", significance: "Rare extra Purnima — Purushottam Maas, highly meritorious", special: true },
  { date: "2026-06-29", name: "Jyeshtha Purnima (Vat Purnima)", type: "purnima", month: "Jyeshtha", significance: "Vat Savitri Vrat for married women" },
  { date: "2026-07-29", name: "Ashadha Purnima (Guru Purnima)", type: "purnima", month: "Ashadha", significance: "Guru Purnima — honour to teachers & gurus", special: true },
  { date: "2026-08-28", name: "Shravana Purnima (Raksha Bandhan)", type: "purnima", month: "Shravana", significance: "Raksha Bandhan, Hayagriva Jayanti", special: true },
  { date: "2026-09-26", name: "Bhadrapada Purnima (Sharad Purnima)", type: "purnima", month: "Bhadrapada", significance: "Sharad Purnima — moonlight believed to have healing properties", special: true },
  { date: "2026-10-26", name: "Ashwina Purnima", type: "purnima", month: "Ashwina", significance: "Kartika Maas begins, deep daan (lamp offerings)" },
  { date: "2026-11-24", name: "Kartika Purnima (Dev Diwali)", type: "purnima", month: "Kartika", significance: "Dev Diwali, Tripuri Purnima, Guru Nanak Jayanti", special: true },
  { date: "2026-12-23", name: "Margashirsha Purnima (Dattatreya Jayanti)", type: "purnima", month: "Margashirsha", significance: "Dattatreya Jayanti" },

  // ─── AMAVASYA 2025 ───
  { date: "2025-01-29", name: "Paush Amavasya", type: "amavasya", month: "Paush", significance: "Pitru Tarpan, ancestor rituals" },
  { date: "2025-02-28", name: "Magha Amavasya", type: "amavasya", month: "Magha", significance: "Pitru Tarpan, Shiva worship" },
  { date: "2025-03-29", name: "Phalguna Amavasya", type: "amavasya", month: "Phalguna", significance: "New year eve Amavasya, ancestor offerings" },
  { date: "2025-04-27", name: "Chaitra Amavasya", type: "amavasya", month: "Chaitra", significance: "Pitru Tarpan, Vishnu Lakshmi worship" },
  { date: "2025-05-26", name: "Vaishakha Amavasya (Shani Jayanti)", type: "amavasya", month: "Vaishakha", significance: "Shani Jayanti — Saturn worship", special: true },
  { date: "2025-06-25", name: "Jyeshtha Amavasya (Vat Amavasya)", type: "amavasya", month: "Jyeshtha", significance: "Vat Savitri Vrat day (in some regions)" },
  { date: "2025-07-24", name: "Ashadha Amavasya", type: "amavasya", month: "Ashadha", significance: "Shravana month begins after this" },
  { date: "2025-08-23", name: "Shravana Amavasya", type: "amavasya", month: "Shravana", significance: "Pitru Tarpan during Shravana" },
  { date: "2025-09-21", name: "Bhadrapada Amavasya (Mahalaya)", type: "amavasya", month: "Bhadrapada", significance: "Pitru Paksha end — Sarva Pitru Amavasya", special: true },
  { date: "2025-10-21", name: "Ashwina Amavasya (Diwali)", type: "amavasya", month: "Ashwina", significance: "Diwali — Lakshmi Puja on this Amavasya", special: true },
  { date: "2025-11-20", name: "Kartika Amavasya", type: "amavasya", month: "Kartika", significance: "Pitru Tarpan, deep daan" },
  { date: "2025-12-20", name: "Margashirsha Amavasya", type: "amavasya", month: "Margashirsha", significance: "Ancestor rituals, Vishnu worship" },

  // ─── AMAVASYA 2026 ───
  { date: "2026-01-18", name: "Mauni Amavasya", type: "amavasya", month: "Paush", significance: "Silence vrat, holy dip in Ganga — most powerful Amavasya", special: true },
  { date: "2026-02-17", name: "Magha Amavasya", type: "amavasya", month: "Magha", significance: "Pitru Tarpan, Shiva-Parvati worship" },
  { date: "2026-03-19", name: "Phalguna Amavasya", type: "amavasya", month: "Phalguna", significance: "Eve of Hindu New Year (Ugadi/Gudi Padwa next day)", special: true },
  { date: "2026-04-17", name: "Chaitra Amavasya", type: "amavasya", month: "Chaitra", significance: "Pitru Tarpan, Vishnu Lakshmi worship" },
  { date: "2026-05-16", name: "Vaishakha Amavasya (Shani Jayanti)", type: "amavasya", month: "Vaishakha", significance: "Shani Jayanti — powerful for Saturn dosha relief", special: true },
  { date: "2026-06-15", name: "Adhika Jyeshtha Amavasya", type: "amavasya", month: "Adhika Jyeshtha", significance: "Rare extra-month Amavasya — highly auspicious for Pitru Tarpan", special: true },
  { date: "2026-07-14", name: "Jyeshtha Amavasya", type: "amavasya", month: "Jyeshtha", significance: "Chaturmas begins — Lord Vishnu worship" },
  { date: "2026-08-12", name: "Shravana Amavasya", type: "amavasya", month: "Shravana", significance: "Nag Devta & Shiva worship, Deep Daan" },
  { date: "2026-09-11", name: "Bhadrapada Amavasya (Mahalaya)", type: "amavasya", month: "Bhadrapada", significance: "Sarva Pitru Amavasya — Pitru Paksha ends, most important ancestor day", special: true },
  { date: "2026-10-10", name: "Ashwina Amavasya", type: "amavasya", month: "Ashwina", significance: "Navratri begins next day, Durga worship prep" },
  { date: "2026-11-08", name: "Kartika Amavasya (Diwali)", type: "amavasya", month: "Kartika", significance: "Diwali — Lakshmi Puja, the festival of lights", special: true },
  { date: "2026-12-07", name: "Margashirsha Amavasya", type: "amavasya", month: "Margashirsha", significance: "Ancestor rituals, Vishnu worship" },

  // ─── EKADASHI 2025 (selected key ones) ───
  { date: "2025-01-10", name: "Saphala Ekadashi", type: "ekadashi", paksha: "krishna", month: "Paush", significance: "Frees from past sins, fulfills wishes" },
  { date: "2025-01-25", name: "Paush Putrada Ekadashi", type: "ekadashi", paksha: "shukla", month: "Paush", significance: "Grants the boon of a virtuous son", special: true },
  { date: "2025-02-08", name: "Shattila Ekadashi", type: "ekadashi", paksha: "krishna", month: "Magha", significance: "Donation of sesame (til) removes sins" },
  { date: "2025-02-24", name: "Jaya Ekadashi", type: "ekadashi", paksha: "shukla", month: "Magha", significance: "Liberation from ghost and evil spirits" },
  { date: "2025-03-10", name: "Vijaya Ekadashi", type: "ekadashi", paksha: "krishna", month: "Phalguna", significance: "Grants victory in all endeavors" },
  { date: "2025-03-25", name: "Amalaki Ekadashi", type: "ekadashi", paksha: "shukla", month: "Phalguna", significance: "Worship of Amalaki (Amla) tree — Lord Vishnu's abode", special: true },
  { date: "2025-04-08", name: "Papmochani Ekadashi", type: "ekadashi", paksha: "krishna", month: "Chaitra", significance: "Removes all sins, grants liberation" },
  { date: "2025-04-24", name: "Kamada Ekadashi", type: "ekadashi", paksha: "shukla", month: "Chaitra", significance: "Fulfills all desires, cleanses sins" },
  { date: "2025-05-08", name: "Varuthini Ekadashi", type: "ekadashi", paksha: "krishna", month: "Vaishakha", significance: "Grants happiness & good fortune" },
  { date: "2025-05-23", name: "Mohini Ekadashi", type: "ekadashi", paksha: "shukla", month: "Vaishakha", significance: "Vishnu appeared as Mohini, removes illusion" },
  { date: "2025-06-06", name: "Apara Ekadashi", type: "ekadashi", paksha: "krishna", month: "Jyeshtha", significance: "Removes all sins of past lives" },
  { date: "2025-06-22", name: "Nirjala Ekadashi", type: "ekadashi", paksha: "shukla", month: "Jyeshtha", significance: "Waterless fast — most powerful Ekadashi of the year", special: true },
  { date: "2025-07-06", name: "Yogini Ekadashi", type: "ekadashi", paksha: "krishna", month: "Ashadha", significance: "Cures diseases, removes bad karma" },
  { date: "2025-07-21", name: "Devshayani Ekadashi", type: "ekadashi", paksha: "shukla", month: "Ashadha", significance: "Lord Vishnu begins his cosmic sleep (Chaturmas starts)", special: true },
  { date: "2025-08-05", name: "Kamika Ekadashi", type: "ekadashi", paksha: "krishna", month: "Shravana", significance: "Fulfills desires, removes sins" },
  { date: "2025-08-20", name: "Shravana Putrada Ekadashi", type: "ekadashi", paksha: "shukla", month: "Shravana", significance: "Grants the boon of a son" },
  { date: "2025-09-03", name: "Aja Ekadashi", type: "ekadashi", paksha: "krishna", month: "Bhadrapada", significance: "Removes all sins and grants moksha" },
  { date: "2025-09-19", name: "Parsva Ekadashi", type: "ekadashi", paksha: "shukla", month: "Bhadrapada", significance: "Vishnu turns over in cosmic sleep" },
  { date: "2025-10-03", name: "Indira Ekadashi", type: "ekadashi", paksha: "krishna", month: "Ashwina", significance: "Liberates ancestors from hell" },
  { date: "2025-10-18", name: "Papankusha Ekadashi", type: "ekadashi", paksha: "shukla", month: "Ashwina", significance: "Destroys great sins" },
  { date: "2025-11-01", name: "Rama Ekadashi", type: "ekadashi", paksha: "krishna", month: "Kartika", significance: "Grants prosperity and moksha" },
  { date: "2025-11-15", name: "Dev Uthani Ekadashi", type: "ekadashi", paksha: "shukla", month: "Kartika", significance: "Vishnu wakes from cosmic sleep — auspicious marriages begin", special: true },
  { date: "2025-11-30", name: "Utpanna Ekadashi", type: "ekadashi", paksha: "krishna", month: "Margashirsha", significance: "Birth of Ekadashi deity from Vishnu" },
  { date: "2025-12-15", name: "Mokshada Ekadashi", type: "ekadashi", paksha: "shukla", month: "Margashirsha", significance: "Grants liberation — Bhagavad Gita was revealed on this day", special: true },
  { date: "2025-12-30", name: "Saphala Ekadashi", type: "ekadashi", paksha: "krishna", month: "Paush", significance: "Frees from past sins, fulfills wishes" },

  // ─── EKADASHI 2026 (all 24) ───
  { date: "2026-01-14", name: "Shattila Ekadashi", type: "ekadashi", paksha: "krishna", month: "Paush", significance: "Donation of sesame (til) removes all sins" },
  { date: "2026-01-29", name: "Jaya Ekadashi", type: "ekadashi", paksha: "shukla", month: "Magha", significance: "Liberation from ghost and evil spirits" },
  { date: "2026-02-13", name: "Vijaya Ekadashi", type: "ekadashi", paksha: "krishna", month: "Magha", significance: "Grants victory in all endeavors" },
  { date: "2026-02-27", name: "Amalaki Ekadashi", type: "ekadashi", paksha: "shukla", month: "Phalguna", significance: "Worship of Amalaki (Amla) tree — Lord Vishnu's abode", special: true },
  { date: "2026-03-15", name: "Papmochani Ekadashi", type: "ekadashi", paksha: "krishna", month: "Phalguna", significance: "Removes all sins, grants liberation" },
  { date: "2026-03-30", name: "Kamada Ekadashi", type: "ekadashi", paksha: "shukla", month: "Chaitra", significance: "Fulfills all desires, cleanses sins — first Ekadashi after new year" },
  { date: "2026-04-13", name: "Varuthini Ekadashi", type: "ekadashi", paksha: "krishna", month: "Chaitra", significance: "Grants happiness and good fortune" },
  { date: "2026-04-27", name: "Mohini Ekadashi", type: "ekadashi", paksha: "shukla", month: "Vaishakha", significance: "Vishnu appeared as Mohini, removes illusion" },
  { date: "2026-05-13", name: "Apara Ekadashi", type: "ekadashi", paksha: "krishna", month: "Vaishakha", significance: "Removes all sins of past lives" },
  { date: "2026-05-27", name: "Padmini Ekadashi", type: "ekadashi", paksha: "shukla", month: "Adhika Jyeshtha", significance: "Rare Adhika Maas Ekadashi — equal merit to 1000 regular Ekadashis", special: true },
  { date: "2026-06-11", name: "Parama Ekadashi", type: "ekadashi", paksha: "krishna", month: "Adhika Jyeshtha", significance: "Extremely rare — removes all sins and grants liberation", special: true },
  { date: "2026-06-25", name: "Nirjala Ekadashi", type: "ekadashi", paksha: "shukla", month: "Jyeshtha", significance: "Waterless fast — most powerful Ekadashi of the year", special: true },
  { date: "2026-07-10", name: "Yogini Ekadashi", type: "ekadashi", paksha: "krishna", month: "Jyeshtha", significance: "Cures diseases, removes bad karma" },
  { date: "2026-07-24", name: "Devshayani Ekadashi", type: "ekadashi", paksha: "shukla", month: "Ashadha", significance: "Lord Vishnu begins cosmic sleep — Chaturmas starts, no auspicious events", special: true },
  { date: "2026-08-08", name: "Kamika Ekadashi", type: "ekadashi", paksha: "krishna", month: "Ashadha", significance: "Fulfills desires, removes sins" },
  { date: "2026-08-22", name: "Shravana Putrada Ekadashi", type: "ekadashi", paksha: "shukla", month: "Shravana", significance: "Grants the boon of a son" },
  { date: "2026-09-07", name: "Aja Ekadashi", type: "ekadashi", paksha: "krishna", month: "Shravana", significance: "Removes all sins and grants moksha" },
  { date: "2026-09-21", name: "Parsva Ekadashi", type: "ekadashi", paksha: "shukla", month: "Bhadrapada", significance: "Vishnu turns over in cosmic sleep — Chaturmas midpoint" },
  { date: "2026-10-06", name: "Indira Ekadashi", type: "ekadashi", paksha: "krishna", month: "Bhadrapada", significance: "Liberates ancestors from hell — observed during Pitru Paksha", special: true },
  { date: "2026-10-20", name: "Papankusha Ekadashi", type: "ekadashi", paksha: "shukla", month: "Ashwina", significance: "Destroys great sins" },
  { date: "2026-11-05", name: "Rama Ekadashi", type: "ekadashi", paksha: "krishna", month: "Kartika", significance: "Grants prosperity and moksha" },
  { date: "2026-11-22", name: "Dev Uthani Ekadashi", type: "ekadashi", paksha: "shukla", month: "Kartika", significance: "Vishnu wakes from cosmic sleep — auspicious marriages and ceremonies resume", special: true },
  { date: "2026-12-06", name: "Utpanna Ekadashi", type: "ekadashi", paksha: "krishna", month: "Margashirsha", significance: "Birth of Ekadashi deity from Vishnu" },
  { date: "2026-12-21", name: "Mokshada Ekadashi", type: "ekadashi", paksha: "shukla", month: "Margashirsha", significance: "Grants liberation — Bhagavad Gita was revealed on this day", special: true },

  // ─── PRADOSH VRAT 2026 (Shukla & Krishna Trayodashi) ───
  { date: "2026-01-16", name: "Pradosh Vrat (Shani Pradosh)", type: "pradosh", paksha: "krishna", month: "Paush", significance: "Shani Pradosh — especially powerful for Saturn relief" },
  { date: "2026-01-31", name: "Pradosh Vrat (Shukla)", type: "pradosh", paksha: "shukla", month: "Magha", significance: "Evening Shiva worship during Pradosh Kaal" },
  { date: "2026-02-15", name: "Pradosh Vrat (Krishna)", type: "pradosh", paksha: "krishna", month: "Magha", significance: "Evening Shiva worship during Pradosh Kaal" },
  { date: "2026-03-01", name: "Pradosh Vrat (Shukla)", type: "pradosh", paksha: "shukla", month: "Phalguna", significance: "Evening Shiva worship during Pradosh Kaal" },
  { date: "2026-03-17", name: "Pradosh Vrat (Krishna)", type: "pradosh", paksha: "krishna", month: "Phalguna", significance: "Evening Shiva worship during Pradosh Kaal" },
  { date: "2026-04-01", name: "Pradosh Vrat (Shukla)", type: "pradosh", paksha: "shukla", month: "Chaitra", significance: "Evening Shiva worship during Pradosh Kaal" },
  { date: "2026-04-15", name: "Pradosh Vrat (Bhauma Pradosh)", type: "pradosh", paksha: "krishna", month: "Chaitra", significance: "Bhauma Pradosh (Tuesday) — especially powerful", special: true },
  { date: "2026-04-30", name: "Pradosh Vrat (Shukla)", type: "pradosh", paksha: "shukla", month: "Vaishakha", significance: "Evening Shiva worship during Pradosh Kaal" },
  { date: "2026-05-14", name: "Pradosh Vrat (Guru Pradosh)", type: "pradosh", paksha: "krishna", month: "Vaishakha", significance: "Guru Pradosh (Thursday) — especially powerful", special: true },
  { date: "2026-05-29", name: "Pradosh Vrat (Shukla)", type: "pradosh", paksha: "shukla", month: "Adhika Jyeshtha", significance: "Pradosh in Adhika Maas — extra meritorious" },
  { date: "2026-06-13", name: "Pradosh Vrat (Krishna)", type: "pradosh", paksha: "krishna", month: "Adhika Jyeshtha", significance: "Pradosh in Adhika Maas" },
  { date: "2026-06-27", name: "Pradosh Vrat (Shukla)", type: "pradosh", paksha: "shukla", month: "Jyeshtha", significance: "Evening Shiva worship during Pradosh Kaal" },
  { date: "2026-07-12", name: "Pradosh Vrat (Krishna)", type: "pradosh", paksha: "krishna", month: "Jyeshtha", significance: "Evening Shiva worship during Pradosh Kaal" },
  { date: "2026-07-27", name: "Pradosh Vrat (Shukla)", type: "pradosh", paksha: "shukla", month: "Ashadha", significance: "Evening Shiva worship during Pradosh Kaal" },
  { date: "2026-08-10", name: "Pradosh Vrat (Krishna)", type: "pradosh", paksha: "krishna", month: "Ashadha", significance: "Evening Shiva worship during Pradosh Kaal" },
  { date: "2026-08-25", name: "Pradosh Vrat (Shukla)", type: "pradosh", paksha: "shukla", month: "Shravana", significance: "Evening Shiva worship during Pradosh Kaal" },
  { date: "2026-09-09", name: "Pradosh Vrat (Krishna)", type: "pradosh", paksha: "krishna", month: "Shravana", significance: "Evening Shiva worship during Pradosh Kaal" },
  { date: "2026-09-24", name: "Pradosh Vrat (Shukla)", type: "pradosh", paksha: "shukla", month: "Bhadrapada", significance: "Evening Shiva worship during Pradosh Kaal" },
  { date: "2026-10-08", name: "Pradosh Vrat (Guru Pradosh)", type: "pradosh", paksha: "krishna", month: "Bhadrapada", significance: "Guru Pradosh (Thursday) — especially powerful", special: true },
  { date: "2026-10-24", name: "Pradosh Vrat (Shukla)", type: "pradosh", paksha: "shukla", month: "Ashwina", significance: "Evening Shiva worship during Pradosh Kaal" },
  { date: "2026-11-06", name: "Pradosh Vrat (Shani Pradosh)", type: "pradosh", paksha: "krishna", month: "Kartika", significance: "Shani Pradosh (Saturday) — especially powerful for Saturn relief", special: true },
  { date: "2026-11-23", name: "Pradosh Vrat (Shukla)", type: "pradosh", paksha: "shukla", month: "Kartika", significance: "Evening Shiva worship during Pradosh Kaal" },
  { date: "2026-12-05", name: "Pradosh Vrat (Shani Pradosh)", type: "pradosh", paksha: "krishna", month: "Margashirsha", significance: "Shani Pradosh (Saturday)", special: true },
  { date: "2026-12-20", name: "Pradosh Vrat (Shukla)", type: "pradosh", paksha: "shukla", month: "Margashirsha", significance: "Evening Shiva worship during Pradosh Kaal" },

  // ─── SANKASHTI CHATURTHI 2026 (Krishna Chaturthi — Moon worship, Ganesha) ───
  { date: "2026-01-22", name: "Sankashti Chaturthi", type: "sankashti", paksha: "krishna", month: "Magha", significance: "Lord Ganesha worship, moon sighting at night" },
  { date: "2026-02-21", name: "Sankashti Chaturthi", type: "sankashti", paksha: "krishna", month: "Phalguna", significance: "Lord Ganesha worship, moon sighting at night" },
  { date: "2026-03-23", name: "Sankashti Chaturthi", type: "sankashti", paksha: "krishna", month: "Chaitra", significance: "Lord Ganesha worship, moon sighting at night" },
  { date: "2026-04-21", name: "Sankashti Chaturthi", type: "sankashti", paksha: "krishna", month: "Vaishakha", significance: "Lord Ganesha worship, moon sighting at night" },
  { date: "2026-05-20", name: "Sankashti Chaturthi", type: "sankashti", paksha: "krishna", month: "Jyeshtha", significance: "Lord Ganesha worship, moon sighting at night" },
  { date: "2026-06-18", name: "Sankashti Chaturthi", type: "sankashti", paksha: "krishna", month: "Ashadha", significance: "Lord Ganesha worship, moon sighting at night" },
  { date: "2026-07-18", name: "Sankashti Chaturthi", type: "sankashti", paksha: "krishna", month: "Shravana", significance: "Lord Ganesha worship, moon sighting at night" },
  { date: "2026-08-16", name: "Sankashti Chaturthi", type: "sankashti", paksha: "krishna", month: "Bhadrapada", significance: "Lord Ganesha worship, moon sighting at night" },
  { date: "2026-09-15", name: "Angaraki Sankashti Chaturthi", type: "sankashti", paksha: "krishna", month: "Ashwina", significance: "Angaraki (Tuesday) — most powerful Sankashti of the year", special: true },
  { date: "2026-10-14", name: "Sankashti Chaturthi", type: "sankashti", paksha: "krishna", month: "Kartika", significance: "Lord Ganesha worship, moon sighting at night" },
  { date: "2026-11-13", name: "Sankashti Chaturthi", type: "sankashti", paksha: "krishna", month: "Margashirsha", significance: "Lord Ganesha worship, moon sighting at night" },
  { date: "2026-12-12", name: "Sankashti Chaturthi", type: "sankashti", paksha: "krishna", month: "Margashirsha", significance: "Lord Ganesha worship, moon sighting at night" },
];

export function getVratsForMonth(year: number, month: number): VratEntry[] {
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  return VRAT_DATA.filter(v => v.date.startsWith(prefix))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getUpcomingVrats(from: Date, count = 20, types?: VratEntry["type"][]): VratEntry[] {
  const fromStr = from.toISOString().slice(0, 10);
  return VRAT_DATA
    .filter(v => v.date >= fromStr && (!types || types.includes(v.type)))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, count);
}

export const VRAT_TYPE_LABELS: Record<VratEntry["type"], { label: string; icon: string; color: string; bg: string }> = {
  ekadashi:  { label: "Ekadashi",          icon: "🌙", color: "text-indigo-700",  bg: "bg-indigo-50 border-indigo-200" },
  amavasya:  { label: "Amavasya",          icon: "🌑", color: "text-slate-700",   bg: "bg-slate-50 border-slate-300" },
  purnima:   { label: "Purnima",           icon: "🌕", color: "text-amber-700",   bg: "bg-amber-50 border-amber-200" },
  pradosh:   { label: "Pradosh Vrat",      icon: "🕉️", color: "text-orange-700",  bg: "bg-orange-50 border-orange-200" },
  sankashti: { label: "Sankashti Chaturthi", icon: "🐘", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  other:     { label: "Other Vrat",        icon: "✨", color: "text-purple-700",  bg: "bg-purple-50 border-purple-200" },
};
