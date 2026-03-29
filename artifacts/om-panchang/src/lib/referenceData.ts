export interface NakshatraInfo {
  index: number;
  name: string;
  symbol: string;
  deity: string;
  ruler: string;
  rashi: string;
  quality: string;
  gana: string;
  description: string;
  characteristics: string[];
  favorable: string[];
  unfavorable: string[];
  color: string;
}

export interface TithiInfo {
  index: number;
  name: string;
  paksha: "Shukla" | "Krishna" | "Both";
  deity: string;
  symbol: string;
  nature: string;
  description: string;
  favorable: string[];
  unfavorable: string[];
}

export interface YogaInfo {
  index: number;
  name: string;
  nature: "Auspicious" | "Inauspicious" | "Mixed";
  description: string;
}

export interface LunarMonth {
  index: number;
  name: string;
  englishName: string;
  deity: string;
  description: string;
}

export const LUNAR_MONTHS: LunarMonth[] = [
  { index: 1, name: "Chaitra", englishName: "March–April", deity: "Vishnu", description: "The first month of the Hindu lunar calendar, marking the beginning of Vasanta (Spring). New Year begins in Chaitra." },
  { index: 2, name: "Vaishakha", englishName: "April–May", deity: "Madhusudana", description: "Sacred month, home to Akshaya Tritiya. Bathing in holy rivers during this month grants merit." },
  { index: 3, name: "Jyeshtha", englishName: "May–June", deity: "Trivikrama", description: "Hot summer month. Ganga Dussehra and Nirjala Ekadashi fall in this month." },
  { index: 4, name: "Ashadha", englishName: "June–July", deity: "Vamana", description: "Chaturmas begins in Ashadha. Guru Purnima is celebrated this month." },
  { index: 5, name: "Shravana", englishName: "July–August", deity: "Shridhar", description: "Most sacred month, dedicated to Lord Shiva. Raksha Bandhan and Nag Panchami fall here." },
  { index: 6, name: "Bhadrapada", englishName: "August–September", deity: "Hrishikesha", description: "Ganesh Chaturthi and Krishna Janmashtami are celebrated this month." },
  { index: 7, name: "Ashwina", englishName: "September–October", deity: "Padmanabha", description: "Navratri and Dussehra fall in this month. Pitru Paksha (ancestor fortnight) also occurs here." },
  { index: 8, name: "Kartika", englishName: "October–November", deity: "Damodara", description: "Most auspicious month for Vishnu worship. Diwali and Tulsi Vivah are celebrated this month." },
  { index: 9, name: "Margashirsha", englishName: "November–December", deity: "Keshava", description: "In the Bhagavad Gita, Lord Krishna says 'Among months I am Margashirsha.' Considered most auspicious." },
  { index: 10, name: "Pausha", englishName: "December–January", deity: "Narayana", description: "Winter month. Makar Sankranti begins around this time. Sacred for sun worship." },
  { index: 11, name: "Magha", englishName: "January–February", deity: "Madhava", description: "Vasant Panchami and Maha Shivaratri occur in or around this month. Bathing in rivers is meritorious." },
  { index: 12, name: "Phalguna", englishName: "February–March", deity: "Govinda", description: "Holi is celebrated in Phalguna. The last month of the Hindu lunar year." },
];

export const NAKSHATRA_DATA: NakshatraInfo[] = [
  {
    index: 1, name: "Ashwini", symbol: "Horse's Head", deity: "Ashwini Kumaras", ruler: "Ketu",
    rashi: "Aries (Mesha)", quality: "Movable (Chara)", gana: "Deva (Divine)", color: "#dc2626",
    description: "Ashwini is the first nakshatra, symbolized by a horse's head. It represents speed, healing, and new beginnings. The Ashwini Kumaras — twin physicians of the gods — are its presiding deities, bestowing it with healing energy and vitality.",
    characteristics: ["Quick-witted and energetic", "Natural healers and doctors", "Love of speed and adventure", "Courageous and pioneering", "Enthusiastic but can be impulsive"],
    favorable: ["Starting new ventures", "Medical treatments", "Travel", "Sports and racing", "Learning new skills"],
    unfavorable: ["Long-term commitments", "Slow or detailed work", "Endings or conclusions"],
  },
  {
    index: 2, name: "Bharani", symbol: "Yoni (Womb)", deity: "Yama", ruler: "Venus",
    rashi: "Aries (Mesha)", quality: "Fixed (Sthira)", gana: "Manushya (Human)", color: "#7c3aed",
    description: "Bharani, ruled by Yama (god of death), represents the cycle of birth, death, and renewal. Its symbol is the yoni, representing the creative force and capacity to hold and nurture. It carries energy of transformation and truth.",
    characteristics: ["Strong sense of justice", "Intense and passionate", "Ability to handle extremes", "Creative and fertile", "Truthful but blunt"],
    favorable: ["Completing tasks", "Artistic work", "Deep study", "Purification rituals", "Birth and new life"],
    unfavorable: ["Beginning new projects", "Public events", "Auspicious ceremonies"],
  },
  {
    index: 3, name: "Krittika", symbol: "Razor / Flame", deity: "Agni (Fire God)", ruler: "Sun",
    rashi: "Aries/Taurus", quality: "Mixed", gana: "Rakshasa (Demonic)", color: "#ea580c",
    description: "Krittika is associated with Agni (Fire) and the Pleiades star cluster. It represents sharp intellect, purification through fire, and the nurturing aspect of a mother. Karthikeya (Murugan), the god of war, was raised by the six Krittikas.",
    characteristics: ["Sharp and critical minded", "Strong digestion and appetite", "Leadership qualities", "Ability to cut through illusion", "Nurturing yet fierce"],
    favorable: ["Fire rituals (Havan)", "Purification", "Sharp work like surgery", "Military activities", "Cooking and nourishment"],
    unfavorable: ["Financial dealings", "Partnerships", "Sensitive negotiations"],
  },
  {
    index: 4, name: "Rohini", symbol: "Cart / Chariot", deity: "Brahma (Creator)", ruler: "Moon",
    rashi: "Taurus (Vrishabha)", quality: "Fixed (Sthira)", gana: "Manushya (Human)", color: "#16a34a",
    description: "Rohini is the most beloved of the Moon's 27 wives, and the Moon dwells here longest. Symbolized by a cart, it represents abundance, beauty, and material prosperity. Lord Krishna was born under Rohini nakshatra.",
    characteristics: ["Magnetic and attractive personality", "Love of beauty and luxury", "Artistic and creative", "Stubborn but dependable", "Sensual and pleasure-loving"],
    favorable: ["Agriculture and planting", "Marriage and romance", "Business and trade", "Art and music", "Buying property"],
    unfavorable: ["Fasting", "Confrontation", "Spiritual austerities"],
  },
  {
    index: 5, name: "Mrigashira", symbol: "Deer's Head", deity: "Soma (Moon God)", ruler: "Mars",
    rashi: "Taurus/Gemini", quality: "Soft (Mridu)", gana: "Deva (Divine)", color: "#0891b2",
    description: "Mrigashira means 'deer's head' — gentle, curious, and always searching. Like a deer searching for water, this nakshatra represents the eternal seeker. It brings a gentle, searching, and sensitive nature.",
    characteristics: ["Curious and ever-searching", "Gentle and soft-spoken", "Love of travel and exploration", "Sensitive to surroundings", "Good communicators"],
    favorable: ["Learning and education", "Travel and exploration", "Romance", "Artistic pursuits", "Spiritual seeking"],
    unfavorable: ["Confrontation", "Fixed commitments", "Business decisions"],
  },
  {
    index: 6, name: "Ardra", symbol: "Teardrop / Diamond", deity: "Rudra (Storm God)", ruler: "Rahu",
    rashi: "Gemini (Mithuna)", quality: "Sharp (Tikshna)", gana: "Manushya (Human)", color: "#2563eb",
    description: "Ardra means 'the moist one' and is represented by a teardrop or diamond. Associated with Rudra (Shiva's fierce form), it brings storms, destruction, and renewal. It rules over the mind and is linked to Sirius, the brightest star.",
    characteristics: ["Intense and transformative", "Powerful intellect", "Emotional depth", "Can bring storms and upheaval", "Research and investigation abilities"],
    favorable: ["Research and investigation", "Transformation and change", "Technical work", "Gaining knowledge", "Cutting away the old"],
    unfavorable: ["Beginnings", "Auspicious events", "Marriage"],
  },
  {
    index: 7, name: "Punarvasu", symbol: "Bow and Quiver", deity: "Aditi (Mother of Gods)", ruler: "Jupiter",
    rashi: "Gemini/Cancer", quality: "Movable (Chara)", gana: "Deva (Divine)", color: "#ca8a04",
    description: "Punarvasu means 'return of the light' or 'good again.' Associated with Aditi (mother of all gods), it represents renewal, generosity, and the return of prosperity after hardship. Lord Rama was born under this nakshatra.",
    characteristics: ["Optimistic and resilient", "Generous and giving", "Love of home and family", "Philosophical mind", "Ability to bounce back from difficulties"],
    favorable: ["New beginnings after a setback", "Travel", "Education", "Religious activities", "Planting and agriculture"],
    unfavorable: ["Endings", "Confrontation", "Aggressive activities"],
  },
  {
    index: 8, name: "Pushya", symbol: "Flower / Circle", deity: "Brihaspati (Jupiter/Guru)", ruler: "Saturn",
    rashi: "Cancer (Karka)", quality: "Fixed (Sthira)", gana: "Deva (Divine)", color: "#f59e0b",
    description: "Pushya is considered the most auspicious of all nakshatras. Its name means 'to nourish.' Presided over by Brihaspati (the divine preceptor), it brings wisdom, nourishment, and spiritual growth. Guru Pushya Yoga is highly prized.",
    characteristics: ["Nurturing and caring", "Spiritually inclined", "Wise and disciplined", "Generous and charitable", "Conservative and traditional"],
    favorable: ["Any auspicious work", "Buying gold (Pushya Nakshatra)", "Marriage", "Starting studies", "Charity and donations"],
    unfavorable: ["Marriage for personal use (traditionally)", "Travel to the south"],
  },
  {
    index: 9, name: "Ashlesha", symbol: "Serpent / Coiled Snake", deity: "Sarpas (Serpent Deities)", ruler: "Mercury",
    rashi: "Cancer (Karka)", quality: "Sharp (Tikshna)", gana: "Rakshasa (Demonic)", color: "#166534",
    description: "Ashlesha means 'to embrace' or 'to entwine.' The serpent symbol represents kundalini energy, mystical wisdom, and the power of healing or venom. It bestows sharp perception, hypnotic attraction, and deep psychological insight.",
    characteristics: ["Penetrating and psychic", "Strategic and cunning", "Power to heal or harm", "Secretive nature", "Magnetic personality"],
    favorable: ["Research and investigation", "Medicine and healing", "Occult practices", "Political activities", "Uncovering hidden things"],
    unfavorable: ["Auspicious ceremonies", "New beginnings", "Marriage"],
  },
  {
    index: 10, name: "Magha", symbol: "Royal Throne / Palanquin", deity: "Pitrs (Ancestors)", ruler: "Ketu",
    rashi: "Leo (Simha)", quality: "Fixed (Sthira)", gana: "Rakshasa (Demonic)", color: "#b45309",
    description: "Magha means 'the mighty one.' Associated with the ancestors (Pitrs) and the royal throne, it bestows authority, pride, and connection to lineage. It is linked to Regulus, the heart of Leo. People of this nakshatra carry ancestral karma strongly.",
    characteristics: ["Natural leaders and rulers", "Strong sense of tradition and ancestry", "Generous and kingly", "Proud and dignified", "Deep respect for elders"],
    favorable: ["Honoring ancestors (Shraddha)", "Royal and governmental work", "Leadership roles", "Traditional rituals", "Receiving honors"],
    unfavorable: ["New creative ventures", "Humble service", "Travel"],
  },
  {
    index: 11, name: "Purva Phalguni", symbol: "Front Legs of Bed / Hammock", deity: "Bhaga (God of Fortune)", ruler: "Venus",
    rashi: "Leo (Simha)", quality: "Fixed (Sthira)", gana: "Manushya (Human)", color: "#db2777",
    description: "Purva Phalguni means 'the former reddish one.' Associated with Bhaga (the god of marital bliss and prosperity), it brings enjoyment, luxury, creativity, and the joy of rest. It governs relaxation, romance, and the arts.",
    characteristics: ["Pleasure-seeking and relaxed", "Creative and artistic", "Romantic and charming", "Generous and hospitable", "Can be indulgent"],
    favorable: ["Rest and relaxation", "Marriage and romance", "Arts and entertainment", "Social events", "Creative projects"],
    unfavorable: ["Work requiring discipline", "Austerities", "Travel"],
  },
  {
    index: 12, name: "Uttara Phalguni", symbol: "Back Legs of Bed / Hammock", deity: "Aryaman (God of Contracts)", ruler: "Sun",
    rashi: "Leo/Virgo", quality: "Fixed (Sthira)", gana: "Manushya (Human)", color: "#9333ea",
    description: "Uttara Phalguni means 'the latter reddish one.' Associated with Aryaman (god of patronage and contracts), it combines creativity with duty. It governs patronage, social contracts, marriage agreements, and the responsible side of love.",
    characteristics: ["Humanitarian and helpful", "Strong sense of duty", "Intelligent and learned", "Good in leadership and management", "Can be demanding of others"],
    favorable: ["Marriage (auspicious for wedding)", "Signing contracts", "Education", "Social service", "Leadership duties"],
    unfavorable: ["Aggressive activities", "Conflict", "Gambling"],
  },
  {
    index: 13, name: "Hasta", symbol: "Open Hand / Palm", deity: "Savitar (Sun God)", ruler: "Moon",
    rashi: "Virgo (Kanya)", quality: "Movable (Chara)", gana: "Deva (Divine)", color: "#0d9488",
    description: "Hasta means 'hand.' Associated with Savitar (the creative power of the Sun), this nakshatra bestows skill with the hands, craftsmanship, and dexterity. It governs healing through touch, artisanship, and detailed work.",
    characteristics: ["Skilled with hands", "Clever and witty", "Practical and resourceful", "Healing touch", "Can be humorous and playful"],
    favorable: ["Crafts and handicrafts", "Healing work", "Beginning journeys", "Trade and commerce", "Obtaining what you desire"],
    unfavorable: ["Agricultural work", "Heavy physical labor", "Night activities"],
  },
  {
    index: 14, name: "Chitra", symbol: "Bright Jewel / Pearl", deity: "Tvashtar / Vishwakarma (Divine Architect)", ruler: "Mars",
    rashi: "Virgo/Libra", quality: "Soft (Mridu)", gana: "Rakshasa (Demonic)", color: "#f43f5e",
    description: "Chitra means 'the bright one' or 'picture.' Associated with Vishwakarma (the divine architect), it governs architecture, art, illusion (maya), and the creation of beautiful things. The star Spica (Chitra) is one of the brightest in the sky.",
    characteristics: ["Artistic and visually talented", "Love of beauty and ornamentation", "Fond of bright colors and jewels", "Intelligent and creative", "Can be vain or self-focused"],
    favorable: ["Art and design", "Architecture and construction", "Fashion and jewelry", "Meeting new people", "Important conversations"],
    unfavorable: ["Routine work", "Financial decisions", "Legal matters"],
  },
  {
    index: 15, name: "Swati", symbol: "Young Shoot / Coral", deity: "Vayu (Wind God)", ruler: "Rahu",
    rashi: "Libra (Tula)", quality: "Movable (Chara)", gana: "Deva (Divine)", color: "#0284c7",
    description: "Swati means 'sword' or 'self-going.' Like a young shoot swaying in the wind, Swati governs flexibility, independence, and the trader's mind. Ruled by Vayu (Wind God), it brings adaptability and social grace.",
    characteristics: ["Independent and flexible", "Good business acumen", "Social and diplomatic", "Love of freedom", "Adaptable to circumstances"],
    favorable: ["Trade and commerce", "Social networking", "Learning new skills", "Travel", "Legal matters"],
    unfavorable: ["Confrontation", "Water-related activities during Swati", "Fixed commitments"],
  },
  {
    index: 16, name: "Vishakha", symbol: "Triumphal Arch / Potter's Wheel", deity: "Indra & Agni (King of Gods & Fire)", ruler: "Jupiter",
    rashi: "Libra/Scorpio", quality: "Mixed", gana: "Rakshasa (Demonic)", color: "#16a34a",
    description: "Vishakha means 'forked' or 'two-branched.' Governed by both Indra and Agni, it represents ambition, the desire for power, and the fire of achievement. The triumphal arch symbol shows victory after persistent effort.",
    characteristics: ["Ambitious and goal-oriented", "Persuasive speaker", "Competitive and determined", "Can be jealous or envious", "Excellent at achieving targets"],
    favorable: ["Setting goals", "Competition and sports", "Debates and arguments", "Political activities", "Trade and business"],
    unfavorable: ["Relaxation", "Auspicious social events", "Long journeys"],
  },
  {
    index: 17, name: "Anuradha", symbol: "Lotus / Staff", deity: "Mitra (God of Friendship)", ruler: "Saturn",
    rashi: "Scorpio (Vrischika)", quality: "Soft (Mridu)", gana: "Deva (Divine)", color: "#9333ea",
    description: "Anuradha means 'following Radha' or 'a small flash of lightning.' Governed by Mitra (god of friendship and alliances), it fosters devotion, friendship, and the ability to work in groups. It represents balanced discipline with a warm heart.",
    characteristics: ["Devoted and loyal", "Excellent team player", "Travel-loving", "Organized and disciplined", "Sensitive and compassionate"],
    favorable: ["Forming friendships and alliances", "Group activities", "Travel", "Organization", "Devotional practices"],
    unfavorable: ["Conflict with friends", "Solitary work", "Financial speculation"],
  },
  {
    index: 18, name: "Jyeshtha", symbol: "Circular Talisman / Umbrella", deity: "Indra (King of Gods)", ruler: "Mercury",
    rashi: "Scorpio (Vrischika)", quality: "Sharp (Tikshna)", gana: "Rakshasa (Demonic)", color: "#b91c1c",
    description: "Jyeshtha means 'the eldest' or 'the chief.' Ruled by Indra (king of the gods), it carries authority, seniority, and protective power. It is associated with the star Antares and represents the mature, powerful wisdom of experience.",
    characteristics: ["Natural authority and leadership", "Protective of those under their care", "Secretive and private", "Can be arrogant", "Strong and capable"],
    favorable: ["Assuming authority", "Protective activities", "Dealing with enemies", "Research", "Gaining power"],
    unfavorable: ["Auspicious beginnings", "Travel", "Partnerships"],
  },
  {
    index: 19, name: "Mula", symbol: "Tied Bundle of Roots", deity: "Nirriti (Goddess of Dissolution)", ruler: "Ketu",
    rashi: "Sagittarius (Dhanu)", quality: "Sharp (Tikshna)", gana: "Rakshasa (Demonic)", color: "#7c3aed",
    description: "Mula means 'root.' At the center of the galaxy, this nakshatra brings things to their roots — investigation, research, and uprooting the deep causes of things. Nirriti (dissolution) governs endings and transformation into new beginnings.",
    characteristics: ["Research-oriented and investigative", "Philosophical and truth-seeking", "Penetrating intellect", "Charismatic but intense", "Associated with extremes"],
    favorable: ["Research and investigation", "Philosophy and spiritual inquiry", "Digging up the past", "Agriculture and gardening", "Understanding root causes"],
    unfavorable: ["Auspicious ceremonies", "Marriage", "Beginnings of new projects"],
  },
  {
    index: 20, name: "Purva Ashadha", symbol: "Elephant Tusk / Fan / Winnowing Basket", deity: "Apas (Water Deity)", ruler: "Venus",
    rashi: "Sagittarius (Dhanu)", quality: "Fixed (Sthira)", gana: "Manushya (Human)", color: "#0891b2",
    description: "Purva Ashadha means 'the early victory.' Governed by Apas (the water deity), it brings purification, invincibility, and philosophical expansion. It carries the energy of early victory — perseverance that precedes triumph.",
    characteristics: ["Proud and independent", "Philosophical and idealistic", "Persuasive and inspiring", "Loyal and devoted", "Can be inflexible"],
    favorable: ["Starting arguments (confident of winning)", "Water-related activities", "Purification", "Philosophy and teaching", "Trade"],
    unfavorable: ["Haste", "Emotional decisions", "Looking for compromise"],
  },
  {
    index: 21, name: "Uttara Ashadha", symbol: "Elephant Tusk / Small Bed", deity: "Vishwadevas (Universal Gods)", ruler: "Sun",
    rashi: "Sagittarius/Capricorn", quality: "Fixed (Sthira)", gana: "Manushya (Human)", color: "#ca8a04",
    description: "Uttara Ashadha means 'the latter victory.' Governed by Vishwadevas (universal gods representing ten noble virtues), it brings final, lasting victory. Associated with responsibility, integrity, and the ethical fulfillment of one's dharma.",
    characteristics: ["Righteous and responsible", "Natural leaders", "Persistent in achieving goals", "Well-respected", "Strong moral compass"],
    favorable: ["Taking on responsibilities", "Leadership", "Military or law-related work", "Long-term projects", "Ethical decision-making"],
    unfavorable: ["Quick gains", "Deceit or manipulation", "Shortcuts"],
  },
  {
    index: 22, name: "Shravana", symbol: "Ear / Three Footprints of Vishnu", deity: "Vishnu (The Preserver)", ruler: "Moon",
    rashi: "Capricorn (Makara)", quality: "Movable (Chara)", gana: "Deva (Divine)", color: "#2563eb",
    description: "Shravana means 'to hear.' Associated with Vishnu (the preserver), this nakshatra governs learning through listening, connecting seemingly unrelated things, and spreading knowledge. The three footprints of Vishnu (Trivikrama) are its symbol.",
    characteristics: ["Excellent listeners", "Great learners and teachers", "Widely traveled", "Connectors of knowledge", "Gentle and virtuous"],
    favorable: ["Learning and education", "Listening and counseling", "Travel", "Religious activities", "Connecting with others"],
    unfavorable: ["Arguments", "Financial speculation", "Aggressive activities"],
  },
  {
    index: 23, name: "Dhanishtha", symbol: "Drum / Flute", deity: "Ashta Vasus (8 Gods of Abundance)", ruler: "Mars",
    rashi: "Capricorn/Aquarius", quality: "Movable (Chara)", gana: "Rakshasa (Demonic)", color: "#0f766e",
    description: "Dhanishtha means 'the most famous' or 'the wealthiest.' Governed by the eight Vasus (elemental gods of abundance), it brings musical talent, wealth, and the capacity for great generosity. The drum symbolizes rhythm, timing, and harmony.",
    characteristics: ["Musical and rhythmic", "Wealth-oriented", "Generous and philanthropic", "Courageous", "Can be overconfident"],
    favorable: ["Music and dance", "Building wealth", "Physical activity and sports", "Charity", "Beginning of Dhanishtha is good for some activities"],
    unfavorable: ["Marriage (traditionally)", "Partnerships", "Beginning new relationships"],
  },
  {
    index: 24, name: "Shatabhisha", symbol: "Empty Circle / Thousand Stars", deity: "Varuna (God of Cosmic Waters)", ruler: "Rahu",
    rashi: "Aquarius (Kumbha)", quality: "Movable (Chara)", gana: "Rakshasa (Demonic)", color: "#4f46e5",
    description: "Shatabhisha means 'a hundred physicians' or 'a hundred stars.' Governed by Varuna (god of cosmic order and healing waters), it bestows healing ability, hidden knowledge, and the capacity to unveil secrets. It is a nakshatra of mystery and healing.",
    characteristics: ["Reclusive and philosophical", "Natural healers", "Strong interest in hidden knowledge", "Individualistic", "Humanitarian at heart"],
    favorable: ["Medical treatment and healing", "Research and investigation", "Astrology and mystical studies", "Aquatic activities", "Meditation"],
    unfavorable: ["Social events", "Marriage", "Public activities"],
  },
  {
    index: 25, name: "Purva Bhadrapada", symbol: "Sword / Two-faced Man", deity: "Aja Ekapada (One-footed Goat)", ruler: "Jupiter",
    rashi: "Aquarius/Pisces", quality: "Fixed (Sthira)", gana: "Manushya (Human)", color: "#dc2626",
    description: "Purva Bhadrapada means 'the first of the auspicious feet.' Associated with Aja Ekapada (a form of Rudra/Shiva), it carries transformative fire energy. It rules over the passionate, ascetic, and revolutionary side of human nature.",
    characteristics: ["Idealistic and passionate", "Quick to anger but generous", "Drawn to the mystical", "Can sacrifice for a cause", "Dual nature (worldly yet spiritual)"],
    favorable: ["Spiritual practices", "Transformative work", "Fighting for a cause", "Research", "Philosophical study"],
    unfavorable: ["Auspicious beginnings", "Marriage ceremonies", "Financial dealings"],
  },
  {
    index: 26, name: "Uttara Bhadrapada", symbol: "Twins / Back Legs of a Bed / Snake in Water", deity: "Ahirbudhnya (Serpent of the Deep)", ruler: "Saturn",
    rashi: "Pisces (Meena)", quality: "Fixed (Sthira)", gana: "Manushya (Human)", color: "#0369a1",
    description: "Uttara Bhadrapada means 'the latter auspicious feet.' Governed by Ahirbudhnya (the serpent of the deep ocean), it brings depth, wisdom, and the capacity to hold the cosmic waters. It represents the culmination of spiritual wisdom before liberation.",
    characteristics: ["Deeply wise and philosophical", "Patient and enduring", "Compassionate and charitable", "Psychically gifted", "Can be stubborn"],
    favorable: ["Charitable activities", "Spiritual practice", "Healing", "Long-term plans", "Working for the collective"],
    unfavorable: ["Quick decisions", "Travel", "Beginning new ventures"],
  },
  {
    index: 27, name: "Revati", symbol: "Fish / Drum", deity: "Pushan (Nurturer and Protector of Flocks)", ruler: "Mercury",
    rashi: "Pisces (Meena)", quality: "Soft (Mridu)", gana: "Deva (Divine)", color: "#059669",
    description: "Revati is the last nakshatra, completing the full cycle. Associated with Pushan (the nourisher and guardian of safe travels), it brings completion, transition, and the gateway to a new cycle. It is gentle, compassionate, and spiritually sensitive.",
    characteristics: ["Compassionate and kind", "Love of animals and nature", "Artistic and creative", "Spiritual and gentle", "Good guides and counselors"],
    favorable: ["Completing tasks", "Travel and journeys", "Charitable acts", "Music and art", "Spiritual activities"],
    unfavorable: ["New beginnings (it's an ending nakshatra)", "Competitive activities", "Confrontation"],
  },
];

export const TITHI_DATA: TithiInfo[] = [
  {
    index: 1, name: "Pratipada", paksha: "Both", deity: "Brahma (Creator)", symbol: "🌒",
    nature: "Auspicious (Nanda)",
    description: "Pratipada (Pratipad) is the first lunar day of both Shukla and Krishna Paksha. It is the beginning — the day of new starts. Both the Shukla (bright) Pratipada and Krishna (dark) Pratipada are considered excellent for beginning new endeavors.",
    favorable: ["Starting new work", "Business ventures", "Wearing new clothes", "Entering a new home", "Marriages in Shukla Paksha"],
    unfavorable: ["Fasting", "Inauspicious rites"],
  },
  {
    index: 2, name: "Dvitiya", paksha: "Both", deity: "Vidhatr (The Arranger)", symbol: "🌒",
    nature: "Auspicious (Bhadra)",
    description: "Dvitiya (Dwitiya) is the second lunar day. It carries an energy of support, balance, and pairing. Associated with pairs and partnerships, it is considered generally auspicious for most activities.",
    favorable: ["Marriage and partnerships", "Cooperation and collaboration", "Making friends", "Musical activities", "Learning"],
    unfavorable: ["Solitary activities", "Beginning travels"],
  },
  {
    index: 3, name: "Tritiya", paksha: "Both", deity: "Gauri (Goddess Parvati)", symbol: "🌓",
    nature: "Auspicious (Jaya)",
    description: "Tritiya is the third lunar day, associated with Gauri (Parvati). Haritalika Teej and Akshaya Tritiya (the most auspicious third day of Vaishakha) fall on Tritiya. It is ruled by Gauri and brings victory and accomplishment.",
    favorable: ["Victory and success", "Purchasing jewelry and valuables", "Sowing seeds", "Travel", "Beginning education"],
    unfavorable: ["Cutting hair", "Shaving"],
  },
  {
    index: 4, name: "Chaturthi", paksha: "Both", deity: "Ganesha (Remover of Obstacles)", symbol: "🌓",
    nature: "Mixed (Rikta)",
    description: "Chaturthi is the fourth lunar day, sacred to Lord Ganesha. Ganesh Chaturthi falls on Shukla Chaturthi of Bhadrapada. Sankashti Chaturthi (Krishna Paksha) is a monthly fast for Ganesha. Both are significant in the Hindu calendar.",
    favorable: ["Ganesha worship", "Removing obstacles", "Auspicious beginnings with Ganesha's blessings", "Completion of pending work"],
    unfavorable: ["Travel", "Looking at the moon on Bhadra Shukla Chaturthi (traditionally avoided)"],
  },
  {
    index: 5, name: "Panchami", paksha: "Both", deity: "Naga (Serpent Deities)", symbol: "🌔",
    nature: "Auspicious (Nanda)",
    description: "Panchami is the fifth lunar day, sacred to the serpent deities (Nagas). Nag Panchami is observed on Shukla Panchami of Shravana. Vasant Panchami (Saraswati Puja) falls on Shukla Panchami of Magha. It brings auspiciousness and knowledge.",
    favorable: ["Worshipping serpents", "Starting education", "Travel (in Shukla Paksha)", "Medical treatments", "Marriage"],
    unfavorable: ["Beginning construction", "Major decisions in Krishna Paksha Panchami"],
  },
  {
    index: 6, name: "Shashthi", paksha: "Both", deity: "Skanda / Kartikeya (God of War)", symbol: "🌔",
    nature: "Mixed (Bhadra)",
    description: "Shashthi is the sixth lunar day, sacred to Skanda (Kartikeya, son of Shiva). Skanda Shashthi is observed for six days culminating on Shukla Shashthi. It brings energy of war, victory, and the protection of children.",
    favorable: ["Military and courage-related activities", "Medical treatments", "Agriculture", "Undertaking journeys"],
    unfavorable: ["Fasting for certain individuals", "New ventures in Krishna Shashthi"],
  },
  {
    index: 7, name: "Saptami", paksha: "Both", deity: "Surya (Sun God)", symbol: "🌔",
    nature: "Auspicious (Jaya)",
    description: "Saptami is the seventh lunar day, sacred to Surya (the Sun God). Ratha Saptami (Shukla Saptami of Magha) is when the Sun turns his chariot northward. It brings solar energy, vitality, health, and success.",
    favorable: ["Sun worship", "Health-related activities", "Travel", "Agriculture", "Beginning projects"],
    unfavorable: ["Austerities requiring darkness"],
  },
  {
    index: 8, name: "Ashtami", paksha: "Both", deity: "Rudra (Fierce form of Shiva)", symbol: "🌔",
    nature: "Mixed (Rikta)",
    description: "Ashtami is the eighth lunar day, associated with Rudra (Shiva's fierce form). Krishna Janmashtami falls on Krishna Ashtami of Bhadrapada. Durga Ashtami is observed during Navratri. Both are highly significant.",
    favorable: ["Shiva and Shakti worship", "Spiritual practices", "Battle and conflict resolution", "Durgashtami celebrations"],
    unfavorable: ["Beginnings of auspicious events", "Marriage"],
  },
  {
    index: 9, name: "Navami", paksha: "Both", deity: "Durga (Divine Mother)", symbol: "🌕",
    nature: "Auspicious (Nanda)",
    description: "Navami is the ninth lunar day. Ram Navami (Shukla Navami of Chaitra) marks the birth of Lord Rama. Maha Navami is the ninth day of Navratri, with Ayudha Puja. It carries the energy of divine feminine power and righteousness.",
    favorable: ["Worship of Durga and Devi", "Military activities", "Destroying enemies", "Purification rites", "Beginning auspicious work"],
    unfavorable: ["Travel (in some traditions)"],
  },
  {
    index: 10, name: "Dashami", paksha: "Both", deity: "Yama / Dharma (God of Justice)", symbol: "🌕",
    nature: "Mixed (Bhadra)",
    description: "Dashami is the tenth lunar day. Vijaya Dashami (Dussehra) falls on Shukla Dashami of Ashwina — celebrating Rama's victory over Ravana. It brings the energy of law, justice, completion, and final victory.",
    favorable: ["Victory celebrations", "Justice and legal matters", "Completing pending work", "Governmental activities", "Religious observances"],
    unfavorable: ["Starting new ventures (in Krishna Paksha)"],
  },
  {
    index: 11, name: "Ekadashi", paksha: "Both", deity: "Vishnu (The Preserver)", symbol: "🌕",
    nature: "Auspicious (Jaya)",
    description: "Ekadashi is the eleventh lunar day, most sacred to Vishnu. Both Shukla and Krishna Ekadashis are major fasting days. There are 24 Ekadashis in a year, each with a special name and significance (e.g., Nirjala, Dev Uthani, Vaikunta).",
    favorable: ["Fasting", "Vishnu worship", "Reading scriptures", "Meditation", "Charitable acts"],
    unfavorable: ["Eating grains", "Non-vegetarian food", "Starting new work (traditionally a day of penance)"],
  },
  {
    index: 12, name: "Dvadashi", paksha: "Both", deity: "Vishnu (The Preserver)", symbol: "🌕",
    nature: "Auspicious (Nanda)",
    description: "Dvadashi (Dwadashi) is the twelfth lunar day. It follows Ekadashi fasting — devotees break their fast on Dvadashi. It is considered auspicious for gifting, charity, and acts of service to Vishnu devotees.",
    favorable: ["Breaking the Ekadashi fast", "Charity and donation", "Worshipping Vishnu", "Service to devotees", "Most activities"],
    unfavorable: ["Austerities begun on this day (the fast should have begun on Ekadashi)"],
  },
  {
    index: 13, name: "Trayodashi", paksha: "Both", deity: "Kama (God of Love)", symbol: "🌖",
    nature: "Auspicious (Jaya)",
    description: "Trayodashi (Teras) is the thirteenth lunar day. Maha Shivaratri falls on Krishna Trayodashi/Chaturdashi of Magha/Phalguna. Pradosh Vrat is observed on Trayodashi for Lord Shiva. It carries energy of love, prosperity, and Shiva's grace.",
    favorable: ["Pradosh Vrat (Shiva worship)", "Music and arts", "Romance and marriage", "Health and longevity", "Beginning journeys"],
    unfavorable: ["Heavy work", "Confrontations"],
  },
  {
    index: 14, name: "Chaturdashi", paksha: "Both", deity: "Shiva (The Destroyer)", symbol: "🌘",
    nature: "Mixed (Rikta)",
    description: "Chaturdashi is the fourteenth lunar day. Maha Shivaratri occurs on Krishna Chaturdashi. Naraka Chaturdashi (Chhoti Diwali) falls on Krishna Chaturdashi of Ashwina. It is powerful for Shiva worship, exorcism, and dealing with dark forces.",
    favorable: ["Shiva worship", "Tāntric practices", "Dealing with enemies", "Overcoming fear", "Spiritual cleansing"],
    unfavorable: ["Auspicious beginnings", "Marriage", "New business"],
  },
  {
    index: 15, name: "Purnima / Amavasya", paksha: "Both", deity: "Soma (Moon) / Pitrs (Ancestors)", symbol: "🌕🌑",
    nature: "Highly Auspicious / Sacred",
    description: "Purnima (Full Moon) and Amavasya (New Moon) are the fifteenth tithis of their respective pakshas. Purnima is celebrated with major festivals (Holi, Guru Purnima, Kartik Purnima). Amavasya is sacred for ancestral rites (Shraddha, Pitru Tarpana).",
    favorable: ["Purnima: All auspicious work, worship, fasting", "Amavasya: Ancestor worship, Shraddha, Pitru Tarpana", "Both: Meditation and spiritual practice"],
    unfavorable: ["Amavasya: Starting new work, marriage, travel (traditionally)"],
  },
];

export const YOGA_DATA: YogaInfo[] = [
  { index: 1, name: "Vishkambha", nature: "Inauspicious", description: "Vishkambha means 'obstructed' or 'blocked.' Activities initiated during this yoga frequently meet resistance, delays, and frustrating obstacles. It is best to avoid beginning important work, travel, or auspicious ceremonies. Use this time for reflection, planning, and completing existing tasks rather than starting new ones." },
  { index: 2, name: "Priti", nature: "Auspicious", description: "Priti means 'love,' 'delight,' or 'fondness.' This is a beautiful yoga that generates warmth, affection, and harmonious relationships. Excellent for romantic activities, forming new friendships, celebrating with loved ones, and all activities where goodwill and positive feelings are desired." },
  { index: 3, name: "Ayushman", nature: "Auspicious", description: "Ayushman means 'long-lived' or 'blessed with long life.' This yoga bestows vitality, health, and longevity. Particularly favorable for medical treatments, health practices, starting wellness routines, and any activity where longevity and endurance are needed. Those born under this yoga often enjoy robust health." },
  { index: 4, name: "Saubhagya", nature: "Auspicious", description: "Saubhagya means 'good fortune' or 'great luck.' One of the most auspicious yogas, it attracts blessings from all directions. Excellent for marriage, business launches, financial investments, and any undertaking where prosperity and fortunate outcomes are desired. The universe supports ventures begun now." },
  { index: 5, name: "Shobhana", nature: "Auspicious", description: "Shobhana means 'brilliant,' 'splendid,' or 'beautiful.' This yoga brings radiance, auspiciousness, and impressive results. Excellent for creative and artistic work, public appearances, ceremonies, and any activity where beauty and positive impressions are important. It adds a quality of distinction to all undertakings." },
  { index: 6, name: "Atiganda", nature: "Inauspicious", description: "Atiganda means 'excessive obstacles' or 'great danger.' This is a seriously inauspicious yoga that can bring unexpected complications, accidents, and setbacks. Avoid surgery, travel, signing important documents, starting businesses, or any consequential activity. Rest, routine work, and spiritual practices are safest during this period." },
  { index: 7, name: "Sukarma", nature: "Auspicious", description: "Sukarma means 'virtuous action' or 'excellent deed.' This yoga supports righteous, ethical, and beneficial activities. Excellent for charitable work, religious ceremonies, acts of service, educational pursuits, and any activity aimed at generating good karma. What you do for others during this time returns multiplied." },
  { index: 8, name: "Dhriti", nature: "Auspicious", description: "Dhriti means 'steadfastness,' 'patience,' or 'determination.' This yoga imparts stability, persistence, and the capacity to see things through to completion. Excellent for long-term projects, establishing routines, real estate dealings, and any activity requiring sustained effort over time. Foundations laid now tend to be strong and lasting." },
  { index: 9, name: "Shula", nature: "Inauspicious", description: "Shula means 'spear' or 'pain.' This yoga can bring suffering, sharp problems, and piercing difficulties. Medical procedures, especially invasive ones, are particularly unfavorable. Avoid confrontational situations, taking on enemies, and new important ventures. Gentle activities, prayer, and introspection are recommended." },
  { index: 10, name: "Ganda", nature: "Inauspicious", description: "Ganda means 'knot,' 'danger,' or 'complications.' This yoga creates knotted, complicated situations that are hard to untangle. Avoid auspicious ceremonies, new commitments, contracts, and travel. Important matters may become unnecessarily complicated or tied up. Use this time to simplify and disentangle existing problems." },
  { index: 11, name: "Vriddhi", nature: "Auspicious", description: "Vriddhi means 'growth,' 'increase,' or 'prosperity.' This yoga accelerates expansion and multiplication in all areas. Excellent for agricultural activities, business growth, financial investments, starting new ventures, and any activity where you want to see things grow and multiply. Seeds planted now germinate quickly and abundantly." },
  { index: 12, name: "Dhruva", nature: "Auspicious", description: "Dhruva means 'fixed,' 'constant,' or 'the pole star.' Like the steadfast Pole Star, this yoga provides stability and permanence to all undertakings. Excellent for construction, signing long-term agreements, establishing institutions, and any activity where lasting foundations are needed. What is created now tends to endure." },
  { index: 13, name: "Vyaghata", nature: "Inauspicious", description: "Vyaghata means 'beating,' 'striking down,' or 'tiger's blow.' This yoga can bring sudden, unexpected setbacks like a tiger striking from nowhere. Avoid travel (especially by land), surgery, confrontational situations, and important new ventures. Stay alert and cautious; this is not a time for bold moves." },
  { index: 14, name: "Harshana", nature: "Auspicious", description: "Harshana means 'thrilling,' 'causing delight,' or 'joyous.' This yoga uplifts the spirits and brings enthusiasm, laughter, and celebratory energy. Excellent for entertainment, celebrations, creative pursuits, learning, and social events. The energy of this yoga makes people feel alive and excited about life." },
  { index: 15, name: "Vajra", nature: "Mixed", description: "Vajra means 'thunderbolt' or 'diamond.' Like the thunderbolt of Indra, this yoga has a dual nature — it can strike down enemies but can also harm the unprepared. Mixed results for most activities. While it can bring power and decisiveness, it can also bring sudden disruptions. Proceed with awareness and caution." },
  { index: 16, name: "Siddhi", nature: "Auspicious", description: "Siddhi means 'accomplishment,' 'perfection,' or 'supernatural power.' One of the most powerful auspicious yogas, Siddhi brings the fulfillment of all desires and the successful completion of all undertakings. Highly favorable for all auspicious activities. Mantras chanted, intentions set, and actions taken during Siddhi yoga have a much greater chance of manifesting." },
  { index: 17, name: "Vyatipata", nature: "Inauspicious", description: "Vyatipata means 'great calamity,' 'misfortune,' or 'going the wrong way.' This is one of the most inauspicious yogas and is treated as a serious negative influence in the Panchang. Avoid all important activities — travel, business decisions, medical procedures, weddings, and major financial decisions. It is a good day for prayer, meditation, and waiting." },
  { index: 18, name: "Variyana", nature: "Auspicious", description: "Variyana (Variyan) means 'ease,' 'comfort,' or 'superior.' This yoga brings comfortable, pleasant conditions and makes difficult things easier. Excellent for activities involving luxury, relaxation, pleasure, and comfort. Good for creative work, social activities, and any event where a relaxed, enjoyable atmosphere is important." },
  { index: 19, name: "Parigha", nature: "Inauspicious", description: "Parigha means 'iron bar' or 'gate obstacle.' Like an iron bar blocking a gate, this yoga creates barriers, obstructions, and problems accessing what you need. Avoid starting new ventures, travel, and important beginnings. Existing projects may also face roadblocks. A time for patience, prayer, and working through existing issues." },
  { index: 20, name: "Shiva", nature: "Auspicious", description: "Shiva yoga carries the blessings and transformative power of Lord Shiva himself. This is an extremely auspicious yoga, particularly for spiritual practices, Shiva worship, and deep transformative work. Excellent for all auspicious activities, but especially meditation, mantra recitation, and activities aimed at spiritual growth and liberation." },
  { index: 21, name: "Siddha", nature: "Auspicious", description: "Siddha means 'accomplished' or 'one who has attained perfection.' Similar to Siddhi, this yoga brings success and the accomplishment of goals. Those born in Siddha yoga often become masters of their chosen field. Excellent for learning skills, starting important projects, completing advanced studies, and all activities requiring mastery." },
  { index: 22, name: "Sadhya", nature: "Auspicious", description: "Sadhya means 'achievable,' 'that which can be accomplished,' or 'workable.' This yoga makes challenging goals attainable and difficult situations manageable. Excellent for taking on ambitious targets, tackling longstanding problems, negotiating difficult situations, and pursuing goals that seemed out of reach. With Sadhya's support, what seemed impossible becomes possible." },
  { index: 23, name: "Shubha", nature: "Auspicious", description: "Shubha means 'auspicious,' 'lucky,' or 'fortunate.' This yoga is inherently favorable and adds a quality of auspiciousness to whatever is undertaken. Excellent for all ceremonies, important beginnings, marriage, business launches, and activities requiring divine blessing. Everything begun under Shubha yoga carries a quality of goodness." },
  { index: 24, name: "Shukla", nature: "Auspicious", description: "Shukla means 'white,' 'pure,' or 'bright.' This yoga brings purity, clarity of thought, and positive outcomes to all activities. Excellent for purification rituals, starting fresh after difficulties, spiritual practices, and activities requiring clear thinking. It removes the dross and brings out the best qualities in all situations." },
  { index: 25, name: "Brahma", nature: "Auspicious", description: "Brahma yoga carries the creative power of Brahma, the Creator of the universe. Highly auspicious for creative work, intellectual pursuits, education, writing, teaching, and any activity requiring the creative intelligence. Those born under Brahma yoga often become respected scholars, creators, or wisdom-keepers. An excellent day for beginning artistic or intellectual projects." },
  { index: 26, name: "Indra", nature: "Auspicious", description: "Indra yoga carries the authority and power of Indra, the king of the gods. Excellent for leadership activities, political endeavors, taking positions of authority, asserting one's rights, and activities requiring confidence and power. Those born under Indra yoga often rise to positions of leadership and command natural respect from others." },
  { index: 27, name: "Vaidhriti", nature: "Inauspicious", description: "Vaidhriti means 'bad support' or 'unsupported.' This yoga creates conditions of instability and lack of support from the universe. Avoid making important decisions, starting new ventures, signing agreements, or travel. Like Vyatipata, it is treated as one of the more serious inauspicious yogas. Spiritual practice, charity, and humble service are recommended." },
];
