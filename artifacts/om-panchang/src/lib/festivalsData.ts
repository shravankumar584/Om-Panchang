export interface FestivalOccurrence {
  year: number;
  date: string;       // YYYY-MM-DD
  endDate?: string;   // for multi-day festivals
  muhurat?: { label: string; time: string }[];
  notes?: string;
}

export interface FestivalDetail {
  slug: string;
  name: string;
  sanskrit: string;
  alsoKnownAs?: string[];
  deity: string;
  deityImage?: string;
  category: "major" | "vrat" | "regional";
  shortDescription: string;
  occurrences: FestivalOccurrence[];
  significance: string;
  story: string;
  rituals: string[];
  fasting?: string;
  whatToOffer?: string[];
  mantras?: { sanskrit: string; meaning: string }[];
  doAndDont?: { do: string[]; dont: string[] };
  regionalNames?: { region: string; name: string }[];
  related: string[];      // slugs of related festivals
  metaDescription: string;
}

export const FESTIVALS: FestivalDetail[] = [
  {
    slug: "diwali",
    name: "Diwali",
    sanskrit: "दीपावली",
    alsoKnownAs: ["Deepavali", "Festival of Lights", "Lakshmi Puja"],
    deity: "Goddess Lakshmi",
    deityImage: "/deities/friday-lakshmi.png",
    category: "major",
    shortDescription: "Diwali is the five-day festival of lights celebrating the victory of light over darkness, knowledge over ignorance, and good over evil. The main day falls on the Amavasya (new moon) of Kartik month, when Goddess Lakshmi is worshipped for prosperity.",
    occurrences: [
      { year: 2026, date: "2026-11-08", muhurat: [
        { label: "Lakshmi Puja Muhurat", time: "6:42 PM – 8:36 PM" },
        { label: "Pradosh Kaal", time: "5:31 PM – 8:13 PM" },
        { label: "Vrishabha Kaal", time: "6:42 PM – 8:38 PM" },
      ]},
      { year: 2027, date: "2027-10-29", muhurat: [
        { label: "Lakshmi Puja Muhurat", time: "6:30 PM – 8:25 PM" },
      ]},
    ],
    significance: "Diwali commemorates Lord Rama's return to Ayodhya after 14 years of exile and his victory over Ravana. The people of Ayodhya lit oil lamps (diyas) to welcome him home, a tradition that continues to this day. It is also the day Goddess Lakshmi, consort of Lord Vishnu, is believed to visit clean, well-lit homes and bestow wealth and prosperity. For Jains, Diwali marks the spiritual awakening of Lord Mahavira. For Sikhs, it marks the release of Guru Hargobind from imprisonment.",
    story: "After defeating the demon king Ravana and rescuing Sita, Lord Rama returned to his kingdom of Ayodhya on this day. The citizens, overjoyed at the return of their beloved king, illuminated the entire city with millions of oil lamps. The night of the new moon was transformed into a night brighter than day. This tradition of lighting lamps to dispel darkness has continued for thousands of years, symbolizing the triumph of dharma (righteousness) over adharma (unrighteousness).",
    rituals: [
      "Clean and decorate the entire home days in advance",
      "Draw rangoli at the entrance with colored powders or flower petals",
      "Light diyas (oil lamps) in every room, especially near the front door",
      "Perform Lakshmi Puja during the Pradosh Kaal in the evening",
      "Offer kheer, sweets, fruits, and lotus flowers to Goddess Lakshmi",
      "Open all doors and windows during puja so Lakshmi can enter",
      "Burst firecrackers (where permitted) and exchange gifts with family",
      "Wear new clothes, preferably red or gold",
    ],
    whatToOffer: ["Kheer", "Sweets (laddu, peda, barfi)", "Lotus flowers", "Coins", "Rice", "Sindoor", "Whole turmeric"],
    mantras: [
      { sanskrit: "ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद ॐ श्रीं ह्रीं श्रीं महालक्ष्म्यै नमः", meaning: "Om Shreem Hreem Shreem Kamale Kamalalaye Praseeda Praseeda Om Shreem Hreem Shreem Mahalakshmyai Namaha" },
    ],
    doAndDont: {
      do: ["Keep the home brightly lit all night", "Donate to the needy", "Open doors during puja", "Wake up before sunrise"],
      dont: ["Do not gamble or drink", "Do not turn off lights at night", "Do not lend or borrow money", "Do not let the house remain dark"],
    },
    regionalNames: [
      { region: "Tamil Nadu", name: "Deepavali" },
      { region: "Karnataka", name: "Naraka Chaturdashi" },
      { region: "Bengal", name: "Kali Puja" },
      { region: "Gujarat", name: "Bestu Varas (next day)" },
    ],
    related: ["dhanteras", "bhai-dooj", "chhath-puja", "govardhan-puja"],
    metaDescription: "Diwali 2026 date is November 8. Get accurate Lakshmi Puja muhurat, rituals, mantras, and the complete 5-day Diwali calendar with city-wise timings on Om Panchang.",
  },

  {
    slug: "dhanteras",
    name: "Dhanteras",
    sanskrit: "धनतेरस",
    alsoKnownAs: ["Dhanvantari Trayodashi", "Yamadeepdaan"],
    deity: "Lord Dhanvantari & Goddess Lakshmi",
    deityImage: "/deities/friday-lakshmi.png",
    category: "major",
    shortDescription: "Dhanteras marks the first day of the five-day Diwali festival. It is dedicated to Lord Dhanvantari, the divine physician, and is considered the most auspicious day to buy gold, silver, or new utensils.",
    occurrences: [
      { year: 2026, date: "2026-11-06", muhurat: [
        { label: "Dhanteras Puja Muhurat", time: "6:35 PM – 8:14 PM" },
        { label: "Pradosh Kaal", time: "5:32 PM – 8:11 PM" },
        { label: "Yamadeepdaan", time: "After sunset" },
      ]},
      { year: 2027, date: "2027-10-27", muhurat: [{ label: "Dhanteras Puja Muhurat", time: "6:20 PM – 8:00 PM" }]},
    ],
    significance: "Dhanteras (Dhan = wealth, Teras = thirteenth) falls on the 13th day of Krishna Paksha in Kartik month. It is believed that on this day, Goddess Lakshmi and Lord Dhanvantari emerged from the ocean during Samudra Manthan (the churning of the cosmic ocean). Buying gold, silver, or new metal items on this day is believed to multiply wealth manifold throughout the year.",
    story: "During the Samudra Manthan, when devas and asuras churned the ocean of milk to obtain Amrita (nectar of immortality), Lord Dhanvantari emerged carrying the pot of Amrita. He is considered the father of Ayurveda and the divine physician of the gods. Goddess Lakshmi also emerged from the ocean on this same day. Hence the day is celebrated as the day of wealth and good health.",
    rituals: [
      "Buy gold, silver, copper, or new utensils for the home",
      "Light a diya outside the house facing south as Yamadeepdaan to ward off untimely death",
      "Worship Lord Dhanvantari for good health",
      "Worship Goddess Lakshmi and Lord Kubera for prosperity",
      "Place new purchases at the puja altar before using them",
      "Clean the home thoroughly in preparation for Diwali",
    ],
    whatToOffer: ["New silver coin", "Marigold flowers", "Sweets", "Sandalwood paste"],
    related: ["diwali", "naraka-chaturdashi", "bhai-dooj"],
    metaDescription: "Dhanteras 2026 falls on November 6. Get Dhanteras puja muhurat, gold-buying timings, Yamadeepdaan ritual, and significance on Om Panchang.",
  },

  {
    slug: "bhai-dooj",
    name: "Bhai Dooj",
    sanskrit: "भाई दूज",
    alsoKnownAs: ["Bhau Beej", "Bhai Phonta", "Yama Dwitiya"],
    deity: "Lord Yama & Yamuna",
    category: "major",
    shortDescription: "Bhai Dooj celebrates the bond between brothers and sisters. Sisters apply tilak on their brothers' foreheads and pray for their long life and prosperity. It is the fifth and final day of Diwali festivities.",
    occurrences: [
      { year: 2026, date: "2026-11-11", muhurat: [{ label: "Tilak Muhurat", time: "1:10 PM – 3:22 PM" }]},
      { year: 2027, date: "2027-10-31", muhurat: [{ label: "Tilak Muhurat", time: "1:00 PM – 3:15 PM" }]},
    ],
    significance: "Bhai Dooj falls on the second day (Dwitiya) of Shukla Paksha in Kartik month. It celebrates the loving bond between brothers and sisters, similar to Raksha Bandhan but with the roles reversed in significance. Sisters perform aarti for brothers, apply a tilak on their foreheads, and pray for their long lives.",
    story: "According to legend, Lord Yama (god of death) visited his sister Yamuna on this day. Yamuna welcomed him warmly, applied tilak, fed him a special meal, and showered her love. Pleased with her devotion, Yama declared that any brother who receives tilak from his sister on this day will be blessed with long life and protection from untimely death.",
    rituals: [
      "Sister applies tilak (vermilion) on brother's forehead",
      "Sister performs aarti and offers sweets to brother",
      "Brother gives gifts to sister as a token of love",
      "Family meal together — sister cooks brother's favorite dishes",
      "Pray to Yama for the brother's long life",
    ],
    related: ["diwali", "raksha-bandhan", "dhanteras"],
    metaDescription: "Bhai Dooj 2026 falls on November 11. Get Bhai Dooj tilak muhurat, rituals, story, and significance of this sister-brother festival on Om Panchang.",
  },

  {
    slug: "raksha-bandhan",
    name: "Raksha Bandhan",
    sanskrit: "रक्षा बन्धन",
    alsoKnownAs: ["Rakhi", "Rakhi Purnima", "Saluno"],
    deity: "Goddess Indrani (traditional)",
    category: "major",
    shortDescription: "Raksha Bandhan celebrates the sacred bond between brothers and sisters. Sisters tie a protective thread (rakhi) on their brothers' wrists, and brothers in return promise lifelong protection.",
    occurrences: [
      { year: 2026, date: "2026-08-28", muhurat: [
        { label: "Rakhi Tying Muhurat", time: "1:42 PM – 9:02 PM" },
        { label: "Aparahna Muhurat", time: "1:42 PM – 4:18 PM" },
        { label: "Bhadra End Time", time: "1:42 PM" },
      ]},
      { year: 2027, date: "2027-08-17", muhurat: [{ label: "Rakhi Tying Muhurat", time: "After Bhadra ends" }]},
    ],
    significance: "Raksha Bandhan (Raksha = protection, Bandhan = bond) falls on Shravana Purnima (full moon of Shravan month). The thread tied by the sister is not just a string — it represents her prayer for her brother's long life, while the brother's promise of protection is sacred and binding.",
    story: "Many legends are associated with Raksha Bandhan. One famous story is of Queen Karnavati of Chittor, who sent a rakhi to Mughal Emperor Humayun seeking protection from Bahadur Shah. Humayun, honoring the sacred thread, immediately marched his army to her aid. Another legend tells of Goddess Lakshmi tying a rakhi on King Bali to protect Lord Vishnu. The most ancient story is from the Mahabharata, where Draupadi tore her sari to bandage Krishna's bleeding finger, and Krishna promised to protect her in return — a promise he kept during the cheer-haran.",
    rituals: [
      "Avoid tying rakhi during Bhadra Kaal (inauspicious period)",
      "Sister prepares puja thali with rakhi, roli, akshat (rice), diya, and sweets",
      "Sister applies tilak, performs aarti, and ties rakhi on brother's right wrist",
      "Brother gives gifts and money as a token of love",
      "Family meal together",
      "Brothers and sisters who are far apart send rakhis by post or courier",
    ],
    doAndDont: {
      do: ["Tie rakhi only after Bhadra ends", "Use a clean, new rakhi", "Perform aarti before tying"],
      dont: ["Never tie rakhi during Bhadra Kaal — it is highly inauspicious", "Avoid black-colored rakhi"],
    },
    related: ["bhai-dooj", "janmashtami", "guru-purnima"],
    metaDescription: "Raksha Bandhan 2026 falls on August 28. Get accurate rakhi tying muhurat (avoiding Bhadra Kaal), rituals, story, and significance on Om Panchang.",
  },

  {
    slug: "janmashtami",
    name: "Krishna Janmashtami",
    sanskrit: "कृष्ण जन्माष्टमी",
    alsoKnownAs: ["Gokulashtami", "Krishnashtami", "Sri Jayanti"],
    deity: "Lord Krishna",
    deityImage: "/deities/thursday-vishnu.png",
    category: "major",
    shortDescription: "Krishna Janmashtami celebrates the birth of Lord Krishna, the eighth avatar of Vishnu. It is observed on the Ashtami (8th day) of Krishna Paksha in Bhadrapada month, with the actual birth celebrated at midnight (Nishita Kaal).",
    occurrences: [
      { year: 2026, date: "2026-09-04", muhurat: [
        { label: "Nishita Puja Time", time: "11:56 PM – 12:42 AM (Sep 5)" },
        { label: "Parana Time (next day)", time: "After 5:30 AM" },
        { label: "Ashtami Tithi Begins", time: "Sep 4, 7:38 PM" },
        { label: "Ashtami Tithi Ends", time: "Sep 5, 9:12 PM" },
      ]},
      { year: 2027, date: "2027-08-25", muhurat: [{ label: "Nishita Puja Time", time: "11:55 PM – 12:40 AM (Aug 26)" }]},
    ],
    significance: "Krishna Janmashtami marks the birth of Lord Krishna, who was born at midnight in a prison cell to Vasudeva and Devaki in Mathura around 5,000 years ago. He was born to slay his maternal uncle Kansa and restore dharma. Krishna's life is a divine play (Leela), and his teachings in the Bhagavad Gita form the foundation of Hindu philosophy.",
    story: "Kansa, the tyrannical king of Mathura, was warned that the eighth child of his sister Devaki would kill him. He imprisoned Devaki and her husband Vasudeva and killed their first six children. The seventh child (Balarama) was miraculously transferred to Rohini's womb. On the dark, stormy midnight of Ashtami, Krishna was born. Vasudeva, finding the prison guards asleep and chains broken, carried baby Krishna across the rising Yamuna river to Gokul, where he exchanged him with Yashoda's newborn daughter (an avatar of Yogamaya). Krishna grew up in Gokul as the beloved cowherd boy and later returned to slay Kansa.",
    rituals: [
      "Observe a strict fast (nirjala or phalahar) the entire day",
      "Decorate Krishna's idol in a cradle (jhula)",
      "Sing bhajans, especially related to baby Krishna and Radha",
      "Perform abhishek (bath) of Krishna's idol with milk, curd, honey, ghee, and sugar (Panchamrita)",
      "At midnight (Nishita Kaal), perform the actual birth ceremony with aarti",
      "Offer makhan (butter), mishri (sugar), and Panchamrita as bhog",
      "Break the fast next morning after sunrise (Parana)",
      "Visit Krishna temples — especially Mathura, Vrindavan, Dwarka",
    ],
    fasting: "Devotees observe fast from sunrise on Ashtami until midnight (when Krishna is born). Some continue the fast until next day's sunrise. Phalahar fast (fruits, milk, sabudana) is most common. Strict observers do nirjala (waterless) fast.",
    whatToOffer: ["Makhan (butter)", "Mishri (sugar crystals)", "Panchamrita", "Tulsi leaves", "Peacock feather", "Yellow flowers"],
    mantras: [
      { sanskrit: "ॐ नमो भगवते वासुदेवाय", meaning: "Om Namo Bhagavate Vasudevaya — salutations to Lord Krishna" },
      { sanskrit: "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे । हरे राम हरे राम राम राम हरे हरे ॥", meaning: "Hare Krishna Mahamantra" },
    ],
    regionalNames: [
      { region: "Maharashtra", name: "Dahi Handi (next day)" },
      { region: "Tamil Nadu", name: "Gokulashtami" },
      { region: "Odisha", name: "Sri Jayanti" },
    ],
    related: ["radhashtami", "diwali", "ram-navami"],
    metaDescription: "Krishna Janmashtami 2026 falls on September 4. Get Nishita puja muhurat at midnight, fasting rules, parana time, and rituals to celebrate Krishna's birth.",
  },

  {
    slug: "ganesh-chaturthi",
    name: "Ganesh Chaturthi",
    sanskrit: "गणेश चतुर्थी",
    alsoKnownAs: ["Vinayaka Chaturthi", "Ganeshotsav", "Chavath"],
    deity: "Lord Ganesha",
    deityImage: "/deities/wednesday-ganesha.png",
    category: "major",
    shortDescription: "Ganesh Chaturthi celebrates the birth of Lord Ganesha, the elephant-headed remover of obstacles. The 10-day festival begins on Shukla Chaturthi of Bhadrapada and ends with Ganesh Visarjan on Anant Chaturdashi.",
    occurrences: [
      { year: 2026, date: "2026-09-14", endDate: "2026-09-24", muhurat: [
        { label: "Madhyahna Ganesh Puja Muhurat", time: "11:14 AM – 1:42 PM" },
        { label: "Ganesh Visarjan", time: "September 24, 2026 (Anant Chaturdashi)" },
        { label: "Avoid Moon Sighting", time: "9:18 AM – 8:52 PM" },
      ]},
      { year: 2027, date: "2027-09-04", endDate: "2027-09-14", muhurat: [{ label: "Madhyahna Ganesh Puja Muhurat", time: "11:10 AM – 1:38 PM" }]},
    ],
    significance: "Ganesh Chaturthi falls on the Shukla Chaturthi of Bhadrapada month. Lord Ganesha is invoked at the start of any new venture as the remover of obstacles (Vighnaharta) and the lord of wisdom (Buddhipriya). The 10-day festival is celebrated with great fervor in Maharashtra, where it became a public festival under Lokmanya Tilak in 1893.",
    story: "Goddess Parvati created Ganesha from the sandalwood paste she used to bathe and gave him life. She instructed him to guard the door while she bathed. When Lord Shiva returned and was stopped by Ganesha, an angry Shiva beheaded the boy. Devastated Parvati demanded her son back. Shiva sent his ganas to bring the head of the first creature they encountered facing north — which was an elephant. He attached the elephant's head to the boy and revived him as Ganesha, declaring him the leader (Gana-Isha) of all his ganas, and the deity to be worshipped first before any other.",
    rituals: [
      "Install a clay Ganesha idol at home with Pranapratishtha (life-installation) ceremony",
      "Perform daily aarti morning and evening for the duration of the festival (1.5, 3, 5, 7, or 10 days)",
      "Offer 21 modaks (Ganesha's favorite sweet) and 21 durva grass blades",
      "Avoid looking at the moon on Chaturthi night to escape Mithya Dosha",
      "Sing Ganesha bhajans and recite Atharvashirsha",
      "On the final day, immerse the idol in water (visarjan) with chants of 'Ganpati Bappa Morya'",
    ],
    whatToOffer: ["Modak", "Durva grass (21 blades)", "Red hibiscus flowers", "Coconut", "Banana", "Jaggery"],
    mantras: [
      { sanskrit: "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥", meaning: "Vakratunda Mahakaya — O Lord with curved trunk and great body, brilliant as a million suns, please make my work free of obstacles always." },
    ],
    doAndDont: {
      do: ["Install idol with proper rituals", "Offer modak and durva", "Perform daily aarti", "Immerse the idol on the final day"],
      dont: ["Never look at the moon on Ganesh Chaturthi night", "Do not break the idol", "Do not skip daily aarti once installed"],
    },
    related: ["sankashti-chaturthi", "diwali", "navratri"],
    metaDescription: "Ganesh Chaturthi 2026 falls on September 14, with visarjan on September 24. Get Madhyahna puja muhurat, moon-avoidance time, modak offering, and 10-day festival guide.",
  },

  {
    slug: "navratri",
    name: "Sharad Navratri",
    sanskrit: "शरद नवरात्रि",
    alsoKnownAs: ["Maha Navratri", "Durga Puja", "Dasara"],
    deity: "Goddess Durga (9 forms)",
    category: "major",
    shortDescription: "Navratri (nine nights) celebrates the divine feminine in nine forms of Goddess Durga over nine days. It culminates with Vijayadashami (Dussehra), marking the goddess's victory over the demon Mahishasura and Lord Rama's victory over Ravana.",
    occurrences: [
      { year: 2026, date: "2026-10-11", endDate: "2026-10-19", muhurat: [
        { label: "Ghatasthapana Muhurat", time: "Oct 11, 6:14 AM – 7:42 AM" },
        { label: "Abhijit Muhurat", time: "Oct 11, 11:43 AM – 12:30 PM" },
        { label: "Vijayadashami (Dussehra)", time: "October 20, 2026" },
      ]},
      { year: 2027, date: "2027-09-30", endDate: "2027-10-08", muhurat: [{ label: "Ghatasthapana Muhurat", time: "Sep 30, 6:10 AM – 7:38 AM" }]},
    ],
    significance: "Navratri celebrates the nine forms of Goddess Durga (Nava Durga): Shailaputri, Brahmacharini, Chandraghanta, Kushmanda, Skandamata, Katyayani, Kalaratri, Mahagauri, and Siddhidatri. Each day is dedicated to one form, with a specific color, offering, and prayer. The festival represents the eternal battle between good and evil, with Goddess Durga ultimately defeating the buffalo demon Mahishasura.",
    story: "The demon Mahishasura had received a boon that no man or god could kill him. Drunk on power, he terrorized the three worlds. The combined energies of all the gods manifested as Goddess Durga, riding a lion and wielding all their weapons. After a fierce nine-day battle, on the tenth day (Vijayadashami), Durga slayed Mahishasura, restoring cosmic balance. The nine days of Navratri commemorate this nine-day battle.",
    rituals: [
      "Day 1: Ghatasthapana (installing the kalash) and worship of Maa Shailaputri (yellow)",
      "Day 2: Maa Brahmacharini (green)",
      "Day 3: Maa Chandraghanta (grey)",
      "Day 4: Maa Kushmanda (orange)",
      "Day 5: Maa Skandamata (white)",
      "Day 6: Maa Katyayani (red)",
      "Day 7: Maa Kalaratri (royal blue)",
      "Day 8: Maa Mahagauri — Ashtami (pink), Kanya Pujan",
      "Day 9: Maa Siddhidatri — Navami (purple), Kanya Pujan",
      "Day 10: Vijayadashami / Dussehra — burning of Ravana effigies",
      "Sow barley seeds in soil on Day 1, observe their growth as a divine sign",
      "Observe fasting (full or partial) for all nine days",
      "Garba and Dandiya Raas dance gatherings",
    ],
    fasting: "Devotees observe Navratri fast — abstaining from grains, onion, garlic, and non-vegetarian food for all 9 days. Permitted foods include kuttu (buckwheat) flour, samak rice, sabudana, fruits, milk products, and rock salt (sendha namak).",
    related: ["dussehra", "durga-puja", "diwali"],
    metaDescription: "Sharad Navratri 2026 begins October 11 and ends with Dussehra on October 20. Get Ghatasthapana muhurat, day-wise goddesses, colors, Kanya Pujan, and fasting rules.",
  },

  {
    slug: "dussehra",
    name: "Dussehra",
    sanskrit: "दशहरा",
    alsoKnownAs: ["Vijayadashami", "Dasara", "Ayudha Puja"],
    deity: "Goddess Durga & Lord Rama",
    category: "major",
    shortDescription: "Dussehra (Vijayadashami) marks the triumph of good over evil. It celebrates Lord Rama's victory over Ravana and Goddess Durga's victory over Mahishasura. Effigies of Ravana, Meghnad, and Kumbhakarna are burnt across India.",
    occurrences: [
      { year: 2026, date: "2026-10-20", muhurat: [
        { label: "Vijaya Muhurat", time: "1:50 PM – 2:36 PM" },
        { label: "Aparahna Puja Time", time: "1:04 PM – 3:22 PM" },
        { label: "Ravana Dahan", time: "After sunset" },
      ]},
      { year: 2027, date: "2027-10-09", muhurat: [{ label: "Vijaya Muhurat", time: "1:48 PM – 2:34 PM" }]},
    ],
    significance: "Dussehra (Dasha-hara, 'remover of ten') falls on the tenth day of Shukla Paksha in Ashwina month. It marks the day Lord Rama killed Ravana, the ten-headed demon king of Lanka, after a battle of 18 days. It also marks the tenth day of the Durga Puja, when Goddess Durga is bid farewell after defeating Mahishasura. The day is considered one of the most auspicious for starting any new venture.",
    story: "After Ravana abducted Sita, Lord Rama, with the help of Hanuman and the Vanara army, built a bridge to Lanka and waged war against Ravana. The battle lasted 18 days. On the tenth day of Shukla Paksha, Rama killed Ravana with a single arrow blessed by Brahma, freeing Sita and restoring dharma. The day is celebrated as Vijayadashami — the tenth day of victory.",
    rituals: [
      "Visit a temple in the morning and seek blessings",
      "Perform Ayudha Puja (worship of tools, vehicles, weapons) — especially in South India",
      "Perform Shami Puja and exchange Shami leaves as gold",
      "Witness the burning of Ravana, Meghnad, and Kumbhakarna effigies in the evening",
      "Watch Ramlila plays performed in the days leading up to Dussehra",
      "Start new ventures, sign contracts, begin new learning",
    ],
    related: ["navratri", "diwali", "ram-navami"],
    metaDescription: "Dussehra (Vijayadashami) 2026 falls on October 20. Get Vijaya muhurat, Aparahna puja time, Ravana Dahan timing, and significance of this victory festival.",
  },

  {
    slug: "karwa-chauth",
    name: "Karwa Chauth",
    sanskrit: "करवा चौथ",
    alsoKnownAs: ["Karva Chauth", "Karaka Chaturthi"],
    deity: "Lord Shiva, Parvati, Karthikeya & Ganesha",
    deityImage: "/deities/monday-shiva.png",
    category: "vrat",
    shortDescription: "Karwa Chauth is observed by married Hindu women who fast from sunrise to moonrise for the long life and well-being of their husbands. The fast is broken only after sighting the moon and seeing the husband's face through a sieve.",
    occurrences: [
      { year: 2026, date: "2026-10-30", muhurat: [
        { label: "Karwa Chauth Puja Muhurat", time: "5:32 PM – 6:48 PM" },
        { label: "Moonrise (Delhi)", time: "8:11 PM" },
        { label: "Moonrise (Mumbai)", time: "8:48 PM" },
        { label: "Moonrise (New York)", time: "9:24 PM EDT" },
        { label: "Chaturthi Tithi Begins", time: "Oct 30, 8:46 AM" },
        { label: "Chaturthi Tithi Ends", time: "Oct 31, 6:14 AM" },
      ]},
      { year: 2027, date: "2027-10-19", muhurat: [{ label: "Karwa Chauth Puja Muhurat", time: "5:30 PM – 6:46 PM" }]},
    ],
    significance: "Karwa Chauth (Karwa = earthen pot, Chauth = fourth) falls on the Krishna Paksha Chaturthi of Kartik month, four days after Diwali. The fast is one of the most significant for married Hindu women — they observe a complete waterless fast from sunrise until they sight the moon at night. The husband then offers them water and food, breaking the fast.",
    story: "There are several legends. The most famous is of Queen Veervati, the only sister of seven loving brothers. Unable to bear her hunger during her first Karwa Chauth, her brothers tricked her by creating a fake moon-like reflection in a tree, making her break her fast. As soon as she ate, she received news of her husband's death. A goddess appeared and told her to observe the fast properly the next year — which she did, and her husband was restored to life.",
    rituals: [
      "Wake up before sunrise and eat Sargi (pre-dawn meal sent by mother-in-law)",
      "Observe complete waterless fast (nirjala) all day",
      "Wear new clothes (preferably red), apply mehendi, wear bridal jewelry",
      "Listen to Karwa Chauth Vrat Katha in the evening",
      "Pass karwa (small clay pot) around in a circle 7 times during the puja",
      "After moonrise, view the moon through a sieve, then view husband's face",
      "Husband offers wife water and a sweet, breaking her fast",
    ],
    fasting: "Strictest form is nirjala (no food or water from sunrise until moonrise). Pregnant women and those with health conditions may opt for phalahar fast.",
    whatToOffer: ["Karwa (clay pot) with water", "Sweets", "Fruits", "Sindoor", "Bangles"],
    related: ["ahoi-ashtami", "diwali", "raksha-bandhan"],
    metaDescription: "Karwa Chauth 2026 falls on October 30. Get city-wise moonrise time, puja muhurat, sargi tradition, vrat katha, and complete ritual guide for married women.",
  },

  {
    slug: "chhath-puja",
    name: "Chhath Puja",
    sanskrit: "छठ पूजा",
    alsoKnownAs: ["Surya Shashti", "Chhathi Maiya Puja"],
    deity: "Lord Surya & Chhathi Maiya",
    deityImage: "/deities/sunday-surya.png",
    category: "major",
    shortDescription: "Chhath Puja is a four-day festival dedicated to Lord Surya (Sun God) and his sister Chhathi Maiya. Devotees offer arghya (water offering) to the setting sun on day 3 and rising sun on day 4, observing one of the toughest fasts in Hinduism.",
    occurrences: [
      { year: 2026, date: "2026-11-14", endDate: "2026-11-17", muhurat: [
        { label: "Day 1: Nahay Khay", time: "November 14, 2026" },
        { label: "Day 2: Kharna", time: "November 15, 2026" },
        { label: "Day 3: Sandhya Arghya (sunset)", time: "November 16, 2026" },
        { label: "Day 4: Usha Arghya (sunrise)", time: "November 17, 2026" },
      ]},
      { year: 2027, date: "2027-11-04", endDate: "2027-11-07" },
    ],
    significance: "Chhath Puja is one of the oldest Vedic festivals, primarily celebrated in Bihar, Jharkhand, eastern UP, and Nepal. It is dedicated to Surya Dev, the source of all life, and is performed to thank the sun for sustaining life on earth. Devotees believe the puja brings health, prosperity, and the well-being of family.",
    story: "Chhath has its roots in the Rig Veda, where hymns are dedicated to Surya. Legend says Draupadi observed Chhath to overcome the difficulties faced by the Pandavas in exile. Another story tells of King Priyavrat and his queen Malini, who were childless. Sage Kashyap performed a yajna and Chhathi Maiya appeared, blessing them with a son. Since then, Chhathi Maiya has been worshipped for the well-being of children.",
    rituals: [
      "Day 1 — Nahay Khay: Devotees take a holy bath and eat one satvik meal",
      "Day 2 — Kharna: Day-long fast, broken in the evening with kheer and roti",
      "Day 3 — Sandhya Arghya: Stand in waist-deep water and offer arghya to the setting sun",
      "Day 4 — Usha Arghya: Offer arghya to the rising sun, breaking the 36-hour fast",
      "Prepare thekua (jaggery sweet) and other prasad",
      "Sing traditional Chhath songs",
    ],
    fasting: "36-hour nirjala (waterless) fast from the evening of Kharna until the morning of Usha Arghya — one of the most difficult fasts in Hinduism.",
    whatToOffer: ["Thekua", "Sugarcane", "Coconut", "Banana", "Seasonal fruits", "Water in a brass vessel"],
    related: ["diwali", "makar-sankranti", "ratha-saptami"],
    metaDescription: "Chhath Puja 2026 dates: Nov 14-17. Get all 4-day rituals (Nahay Khay, Kharna, Sandhya Arghya, Usha Arghya), sunrise/sunset times for arghya, and significance.",
  },

  {
    slug: "guru-purnima",
    name: "Guru Purnima",
    sanskrit: "गुरु पूर्णिमा",
    alsoKnownAs: ["Vyasa Purnima", "Ashadha Purnima"],
    deity: "Sage Veda Vyasa & all Gurus",
    category: "major",
    shortDescription: "Guru Purnima is dedicated to honoring all spiritual and academic teachers (gurus). It falls on the full moon of Ashadha month and marks the birth of Sage Veda Vyasa, who composed the Mahabharata and divided the Vedas.",
    occurrences: [
      { year: 2026, date: "2026-07-29", muhurat: [
        { label: "Purnima Tithi Begins", time: "July 29, 4:54 AM" },
        { label: "Purnima Tithi Ends", time: "July 30, 5:16 AM" },
        { label: "Vyasa Puja Time", time: "July 29, full day" },
      ]},
      { year: 2027, date: "2027-07-18" },
    ],
    significance: "Guru Purnima is celebrated across Hindu, Buddhist, and Jain traditions. The word 'guru' means 'one who removes darkness' (gu = darkness, ru = remover). On this day, disciples express gratitude to their gurus — both spiritual and academic. It is also the day Lord Buddha gave his first sermon at Sarnath.",
    story: "Sage Veda Vyasa was born on this day to Sage Parashara and Satyavati. He is the author of the Mahabharata, the Brahma Sutras, and the compiler/divider of the Vedas into four parts (Rig, Yajur, Sama, Atharva). He is considered the Adi Guru (first guru) of the Hindu tradition, and Guru Purnima is celebrated to honor him.",
    rituals: [
      "Visit your guru (spiritual teacher) and seek blessings",
      "Offer flowers, fruits, and dakshina (gift) to your guru",
      "Recite Guru Stotra and Guru Gita",
      "Perform Vyasa Puja",
      "Observe a day of silence and self-reflection",
      "Read scriptures and spiritual texts",
    ],
    mantras: [
      { sanskrit: "गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः। गुरुः साक्षात् परब्रह्म तस्मै श्री गुरवे नमः॥", meaning: "Guru is Brahma, Guru is Vishnu, Guru is Maheshwara. Guru is verily the Supreme Brahman. Salutations to that revered Guru." },
    ],
    related: ["vyasa-purnima", "raksha-bandhan", "janmashtami"],
    metaDescription: "Guru Purnima 2026 falls on July 29. Get Purnima tithi timings, Vyasa Puja time, Guru Stotra, and rituals to honor your spiritual and academic teachers.",
  },

  {
    slug: "buddha-purnima",
    name: "Buddha Purnima",
    sanskrit: "बुद्ध पूर्णिमा",
    alsoKnownAs: ["Vesak", "Buddha Jayanti", "Vaishakha Purnima"],
    deity: "Lord Buddha (9th avatar of Vishnu in Hindu tradition)",
    deityImage: "/deities/thursday-vishnu.png",
    category: "major",
    shortDescription: "Buddha Purnima celebrates the birth, enlightenment (Nirvana), and Mahaparinirvana (death) of Lord Buddha — all of which occurred on the full moon of Vaishakh. It is sacred to both Hindus and Buddhists worldwide.",
    occurrences: [
      { year: 2026, date: "2026-05-01", muhurat: [
        { label: "Purnima Tithi Begins", time: "April 30, 8:18 PM" },
        { label: "Purnima Tithi Ends", time: "May 1, 9:42 PM" },
        { label: "Snan Daan Muhurat", time: "Brahma Muhurta to sunrise" },
      ]},
      { year: 2027, date: "2027-04-20" },
    ],
    significance: "Buddha Purnima is one of the most sacred days for Buddhists worldwide. In Hindu tradition, Lord Buddha is considered the ninth avatar of Lord Vishnu. The day commemorates three major events in Buddha's life — his birth in Lumbini (563 BCE), his enlightenment under the Bodhi tree at Bodh Gaya, and his Mahaparinirvana at Kushinagar — all on the full moon of Vaishakh.",
    story: "Prince Siddhartha Gautama was born to King Shuddhodana and Queen Maya in Lumbini. At age 29, disturbed by the suffering he saw in the world, he renounced his princely life and went in search of truth. After six years of austerities, he attained enlightenment under the Bodhi tree at Bodh Gaya at age 35 and became the Buddha (the awakened one). He preached the Four Noble Truths and the Eightfold Path for 45 years before attaining Mahaparinirvana at Kushinagar at age 80 — all events occurring on Vaishakh Purnima.",
    rituals: [
      "Take a holy bath in a sacred river before sunrise",
      "Visit a Buddhist temple or shrine",
      "Light incense, candles, and oil lamps",
      "Offer flowers and fruits at the altar",
      "Donate food, clothes, and money to the poor",
      "Wear white clothes and observe non-violence the entire day",
      "Read Buddhist scriptures or chant Buddha mantras",
      "Avoid non-vegetarian food and alcohol",
    ],
    mantras: [
      { sanskrit: "बुद्धं शरणं गच्छामि। धर्मं शरणं गच्छामि। संघं शरणं गच्छामि।", meaning: "I take refuge in the Buddha. I take refuge in the Dharma. I take refuge in the Sangha." },
    ],
    related: ["guru-purnima", "akshaya-tritiya", "ram-navami"],
    metaDescription: "Buddha Purnima 2026 falls on May 1. Celebrate the birth, enlightenment, and Mahaparinirvana of Lord Buddha with rituals, mantras, and significance on Om Panchang.",
  },

  {
    slug: "akshaya-tritiya",
    name: "Akshaya Tritiya",
    sanskrit: "अक्षय तृतीया",
    alsoKnownAs: ["Akha Teej", "Parashurama Jayanti"],
    deity: "Lord Vishnu, Goddess Lakshmi & Lord Kubera",
    deityImage: "/deities/thursday-vishnu.png",
    category: "major",
    shortDescription: "Akshaya Tritiya is one of the most auspicious days in the Hindu calendar — 'Akshaya' meaning 'never diminishing'. Any spiritual or material activity started on this day brings perpetual prosperity. It is the most popular day for buying gold.",
    occurrences: [
      { year: 2026, date: "2026-04-18", muhurat: [
        { label: "Akshaya Tritiya Puja Muhurat", time: "5:50 AM – 12:18 PM" },
        { label: "Tritiya Tithi Begins", time: "April 17, 11:48 PM" },
        { label: "Tritiya Tithi Ends", time: "April 18, 11:32 PM" },
      ]},
      { year: 2027, date: "2027-05-08", muhurat: [{ label: "Akshaya Tritiya Puja Muhurat", time: "5:42 AM – 12:14 PM" }]},
    ],
    significance: "Akshaya Tritiya falls on the third day (Tritiya) of Shukla Paksha in Vaishakh month. It is one of the four most auspicious days (Sade Teen Muhurat) in Hindu astrology when no muhurat consultation is required for any new venture. Buying gold, starting a business, getting married, or beginning any new endeavor on this day brings 'akshaya' (never-ending) prosperity.",
    story: "Many divine events are believed to have occurred on this day: the birth of Lord Parashurama (sixth avatar of Vishnu), the descent of Mother Ganga to Earth, the beginning of Treta Yuga, the day Sage Vyasa began composing the Mahabharata with Lord Ganesha as scribe, the day Sudama visited his childhood friend Krishna and was blessed with infinite wealth, and the day the Akshaya Patra (vessel of unlimited food) was given to Yudhishthira during the Pandavas' exile.",
    rituals: [
      "Worship Lord Vishnu and Goddess Lakshmi together",
      "Buy gold, silver, or new property",
      "Start a new business, sign important documents",
      "Donate food (especially water and sherbet) to the needy",
      "Perform Pitru Tarpan for ancestors",
      "Visit Vishnu temples — especially Badrinath (the temple opens on this day)",
      "Begin Ganga Snan (sacred river bath)",
    ],
    whatToOffer: ["Tulsi leaves", "Yellow flowers", "Sandalwood", "Yellow sweets", "Coconut", "Rice"],
    mantras: [
      { sanskrit: "ॐ नमो भगवते वासुदेवाय", meaning: "Om Namo Bhagavate Vasudevaya — salutations to Lord Vishnu" },
      { sanskrit: "ॐ श्रीं महालक्ष्म्यै नमः", meaning: "Om Shreem Mahalakshmyai Namaha" },
    ],
    related: ["diwali", "dhanteras", "ram-navami"],
    metaDescription: "Akshaya Tritiya 2026 falls on April 18. Get gold-buying muhurat, Vishnu-Lakshmi puja timings, and significance of this most auspicious day for new beginnings.",
  },

  {
    slug: "holi",
    name: "Holi",
    sanskrit: "होली",
    alsoKnownAs: ["Festival of Colors", "Phagwah", "Dol Jatra"],
    deity: "Lord Krishna & Radha",
    deityImage: "/deities/thursday-vishnu.png",
    category: "major",
    shortDescription: "Holi is the festival of colors celebrating the arrival of spring, the triumph of good over evil, and the divine love of Radha-Krishna. It is preceded by Holika Dahan (bonfire) on the previous evening.",
    occurrences: [
      { year: 2026, date: "2026-03-04", muhurat: [
        { label: "Holika Dahan", time: "March 3, 6:24 PM – 8:51 PM" },
        { label: "Holi (Rangwali)", time: "March 4, 2026" },
        { label: "Bhadra-Free Window", time: "Verify locally before Dahan" },
      ]},
      { year: 2027, date: "2027-03-23", muhurat: [{ label: "Holika Dahan", time: "March 22, 6:30 PM – 8:55 PM" }]},
    ],
    significance: "Holi is celebrated on the day after the full moon of Phalguna month (Phalguna Purnima). It marks the end of winter and arrival of spring. The previous evening, Holika Dahan symbolizes the burning of evil — based on the legend of Prahlad's escape from Holika's fire. The next day, Rangwali Holi, is a riot of colors, water, music, and feasting.",
    story: "King Hiranyakashipu was granted a boon making him nearly invincible. He demanded everyone worship him as god. But his own son, Prahlad, was a devoted devotee of Lord Vishnu. After many failed attempts to kill Prahlad, Hiranyakashipu enlisted his sister Holika, who had a boon to be immune to fire. Holika sat on a pyre with Prahlad on her lap, but Vishnu's grace reversed the boon — Holika was burnt to ashes while Prahlad emerged unharmed, chanting Vishnu's name. The bonfire of Holika Dahan commemorates this victory of devotion over evil.",
    rituals: [
      "Holika Dahan (evening before): Light a bonfire, walk around it 7 times, offer coconut, grains, jaggery",
      "Avoid the inauspicious Bhadra time when lighting Holika",
      "Apply gulal (colored powder) and sprinkle colored water on family and friends",
      "Visit friends and exchange sweets (especially gujiya)",
      "Sing and dance to Holi songs",
      "Drink thandai (traditional milk-based drink)",
    ],
    related: ["holika-dahan", "rang-panchami", "ram-navami"],
    metaDescription: "Holi 2026 falls on March 4 with Holika Dahan on March 3. Get accurate Dahan muhurat avoiding Bhadra, story of Holika and Prahlad, and rituals on Om Panchang.",
  },

  {
    slug: "maha-shivratri",
    name: "Maha Shivratri",
    sanskrit: "महा शिवरात्रि",
    alsoKnownAs: ["Shivratri", "Great Night of Shiva"],
    deity: "Lord Shiva",
    deityImage: "/deities/monday-shiva.png",
    category: "major",
    shortDescription: "Maha Shivratri is the most sacred night dedicated to Lord Shiva. Devotees observe a night-long vigil with fasting, abhishek, and chanting. It falls on the Krishna Paksha Chaturdashi of Phalguna month.",
    occurrences: [
      { year: 2026, date: "2026-02-16", muhurat: [
        { label: "Nishita Kaal Puja", time: "11:48 PM – 12:39 AM (Feb 17)" },
        { label: "First Prahar", time: "6:09 PM – 9:18 PM" },
        { label: "Second Prahar", time: "9:18 PM – 12:27 AM" },
        { label: "Third Prahar", time: "12:27 AM – 3:36 AM" },
        { label: "Fourth Prahar", time: "3:36 AM – 6:45 AM" },
        { label: "Parana Time", time: "6:45 AM – 3:14 PM (Feb 17)" },
      ]},
      { year: 2027, date: "2027-03-06", muhurat: [{ label: "Nishita Kaal Puja", time: "11:50 PM – 12:40 AM (Mar 7)" }]},
    ],
    significance: "Maha Shivratri (the great night of Shiva) is observed on the Krishna Paksha Chaturdashi of Phalguna (or Magha) month. It is one of the most important festivals for Shaivites. On this night, planetary positions are believed to create a powerful upward energy in the human system. Devotees keep awake all night, performing puja in all four prahar (quarters) of the night.",
    story: "Many legends explain Maha Shivratri. The most popular: this is the night when Lord Shiva performed the Tandava (cosmic dance of creation, preservation, and destruction). Another tradition holds it as the night Shiva married Goddess Parvati. A third belief is that on this night, Shiva manifested as a Lingam (the infinite pillar of light) — Brahma flew up to find its top and Vishnu dove down to find its base, but neither could find the limits of Shiva.",
    rituals: [
      "Observe complete fast (waterless or fruit-only)",
      "Visit a Shiva temple at dawn",
      "Perform Abhishek (bath) of Shivlinga with milk, curd, honey, ghee, sugar, water, and bilva leaves",
      "Offer bilva (bel) leaves, dhatura, white flowers, and bhasma (sacred ash)",
      "Stay awake all night, chanting 'Om Namah Shivaya'",
      "Perform puja in all four prahar of the night",
      "Recite Shiva Chalisa, Shiva Tandava Stotram, Rudram",
      "Break fast next day after sunrise (Parana)",
    ],
    fasting: "Strictest form is nirjala (no food or water) for the full day and night. Phalahar (fruits, milk) is also accepted.",
    whatToOffer: ["Bilva (bel) leaves", "Dhatura flowers and fruits", "White flowers", "Milk", "Curd", "Honey", "Ghee", "Bhasma"],
    mantras: [
      { sanskrit: "ॐ नमः शिवाय", meaning: "Om Namah Shivaya — the five-syllable mantra of Shiva" },
      { sanskrit: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥", meaning: "Mahamrityunjaya Mantra — for liberation from death and disease" },
    ],
    related: ["pradosh-vrat", "sawan-shivratri", "navratri"],
    metaDescription: "Maha Shivratri 2026 falls on February 16. Get all 4 prahar puja timings, Nishita Kaal muhurat, abhishek rituals, fasting rules, and Shiva mantras on Om Panchang.",
  },

  {
    slug: "ram-navami",
    name: "Ram Navami",
    sanskrit: "राम नवमी",
    alsoKnownAs: ["Sri Rama Navami", "Chaitra Navami"],
    deity: "Lord Rama",
    deityImage: "/deities/thursday-vishnu.png",
    category: "major",
    shortDescription: "Ram Navami celebrates the birth of Lord Rama, the seventh avatar of Vishnu. He was born at noon on the ninth day (Navami) of Chaitra Shukla Paksha in Ayodhya to King Dasharatha and Queen Kausalya.",
    occurrences: [
      { year: 2026, date: "2026-03-27", muhurat: [
        { label: "Ram Navami Madhyahna Muhurat", time: "11:14 AM – 1:43 PM" },
        { label: "Madhyahna Time (birth time)", time: "12:28 PM" },
        { label: "Navami Tithi Begins", time: "March 26, 7:42 PM" },
        { label: "Navami Tithi Ends", time: "March 27, 7:21 PM" },
      ]},
      { year: 2027, date: "2027-04-15", muhurat: [{ label: "Ram Navami Madhyahna Muhurat", time: "11:18 AM – 1:46 PM" }]},
    ],
    significance: "Ram Navami marks the birth of Lord Rama on the ninth day of Chaitra Shukla Paksha — the last day of Chaitra Navratri. Rama is the embodiment of dharma, the ideal son, husband, brother, and king (Maryada Purushottam). His life story, the Ramayana, has inspired countless generations.",
    story: "King Dasharatha of Ayodhya had three queens but no son. He performed the Putrakameshti Yajna under the guidance of Sage Rishyashringa. From the sacrificial fire emerged a divine being with a bowl of payasam (sweet pudding), which the three queens consumed. Soon all three were pregnant. Queen Kausalya gave birth to Rama at noon on Chaitra Navami, Queen Kaikeyi gave birth to Bharata, and Queen Sumitra gave birth to twins Lakshmana and Shatrughna. Lord Vishnu had taken birth as Rama to slay the demon king Ravana.",
    rituals: [
      "Observe a fast from sunrise to noon (or all day)",
      "Decorate the home with flowers and rangoli",
      "Read Ramayana, Sundara Kanda, or Ram Raksha Stotra",
      "Sing bhajans of Rama, especially Tulsidas's compositions",
      "Visit Ram temples (especially Ayodhya)",
      "Perform Ram puja at midday (Madhyahna), the time of Rama's birth",
      "Offer Panchamrita, fruits, and tulsi to the deity",
      "Distribute prasad — typically fruit-based",
    ],
    fasting: "Devotees observe phalahar (fruit-only) fast until noon, when Lord Rama was born. After Madhyahna puja, the fast is broken with Panchamrita and prasad.",
    mantras: [
      { sanskrit: "श्री राम जय राम जय जय राम", meaning: "Sri Ram Jai Ram Jai Jai Ram" },
      { sanskrit: "ॐ श्री रामाय नमः", meaning: "Om Sri Ramaya Namaha" },
    ],
    related: ["hanuman-jayanti", "diwali", "navratri"],
    metaDescription: "Ram Navami 2026 falls on March 27. Get Madhyahna puja muhurat (Rama's birth time), fasting rules, Ramayana recitation, and rituals to celebrate Lord Rama's birth.",
  },

  {
    slug: "hanuman-jayanti",
    name: "Hanuman Jayanti",
    sanskrit: "हनुमान जयन्ती",
    alsoKnownAs: ["Anjaneya Jayanti", "Hanuman Janmotsav"],
    deity: "Lord Hanuman",
    deityImage: "/deities/tuesday-hanuman.png",
    category: "major",
    shortDescription: "Hanuman Jayanti celebrates the birth of Lord Hanuman, the mighty devotee of Lord Rama. In North India, it is observed on Chaitra Purnima; in South India, on the day of the Margashirsha Amavasya or other regional dates.",
    occurrences: [
      { year: 2026, date: "2026-04-02", muhurat: [
        { label: "Sunrise Puja Muhurat", time: "5:38 AM – 7:08 AM" },
        { label: "Purnima Tithi Begins", time: "April 1, 5:34 PM" },
        { label: "Purnima Tithi Ends", time: "April 2, 5:18 PM" },
      ]},
      { year: 2027, date: "2027-04-21" },
    ],
    significance: "Hanuman Jayanti (in North India) is celebrated on the full moon of Chaitra month. Lord Hanuman is the son of Anjana and Vayu (the wind god) and an ardent devotee of Lord Rama. He is the symbol of strength, devotion, courage, and selfless service. He is also believed to be a Chiranjeevi (immortal) — still alive and present wherever Ramayana is recited.",
    story: "Anjana, an apsara cursed to be born as a vanara (monkey), prayed to Lord Shiva for a son. Pleased with her devotion, Vayu (the wind god) blessed her with a son who was a partial incarnation of Lord Shiva. As an infant, Hanuman mistook the rising sun for a fruit and tried to eat it. Indra struck him with a thunderbolt, breaking his jaw (hence 'Hanuman' — one with a broken jaw). The angered Vayu withdrew air from the world. To pacify him, all the gods blessed Hanuman with extraordinary powers — invincibility, super strength, ability to change size, and immortality. Hanuman dedicated his life to the service of Lord Rama.",
    rituals: [
      "Wake up before sunrise and take a holy bath",
      "Wear orange or red clothes",
      "Visit a Hanuman temple in the early morning",
      "Recite Hanuman Chalisa (especially 11, 21, or 108 times)",
      "Recite Sundara Kanda (the chapter on Hanuman in the Ramayana)",
      "Offer sindoor mixed with sesame oil to Hanuman's idol",
      "Offer laddu, jaggery, gram, and bananas",
      "Observe a fast — often phalahar (fruit-only)",
    ],
    whatToOffer: ["Sindoor (vermilion)", "Mustard or sesame oil", "Laddu", "Bananas", "Jaggery", "Red flowers"],
    mantras: [
      { sanskrit: "ॐ हं हनुमते नमः", meaning: "Om Hum Hanumate Namaha" },
      { sanskrit: "ॐ हनुमते रुद्रात्मकाय हुं फट्", meaning: "Om Hanumate Rudratmakaya Hum Phat — for protection from negative forces" },
    ],
    related: ["ram-navami", "shani-jayanti", "diwali"],
    metaDescription: "Hanuman Jayanti 2026 falls on April 2. Get sunrise puja muhurat, Hanuman Chalisa recitation, sindoor offering ritual, and significance of Bajrang Bali's birth.",
  },

  {
    slug: "ugadi",
    name: "Ugadi / Gudi Padwa",
    sanskrit: "उगादि / गुड़ी पाडवा",
    alsoKnownAs: ["Yugadi", "Samvatsaradi", "Chaitra Shukla Pratipada"],
    deity: "Lord Brahma",
    category: "major",
    shortDescription: "Ugadi (in Karnataka, Andhra, Telangana) and Gudi Padwa (in Maharashtra, Goa) mark the Hindu New Year — the first day of Chaitra Shukla Paksha. It is believed Lord Brahma created the universe on this day.",
    occurrences: [
      { year: 2026, date: "2026-03-19", muhurat: [
        { label: "Pratipada Tithi Begins", time: "March 18, 7:14 PM" },
        { label: "Pratipada Tithi Ends", time: "March 19, 6:52 PM" },
        { label: "Brahma Muhurta", time: "4:42 AM – 5:30 AM" },
      ]},
      { year: 2027, date: "2027-04-07" },
    ],
    significance: "Ugadi/Gudi Padwa marks the start of the Hindu Lunar New Year (Chaitra Shukla Pratipada). It is one of the most auspicious days — one of the four Sade Teen Muhurat days that need no further astrological consultation. The Vikram Samvat calendar advances by one year on this day. It is believed Lord Brahma began creation on this day.",
    story: "Lord Brahma is believed to have started the creation of the universe on this day. It is also the day Lord Rama was crowned king of Ayodhya after returning from exile and defeating Ravana. In Maharashtra, the Gudi (a bamboo pole with a brass pot, neem leaves, and a colorful cloth) is hoisted as a symbol of victory and prosperity, commemorating the victory of Chhatrapati Shivaji Maharaj.",
    rituals: [
      "Decorate the home entrance with mango leaves and rangoli",
      "In Maharashtra: hoist the Gudi outside the house",
      "Take an oil bath before sunrise",
      "Wear new clothes",
      "Prepare and eat Ugadi Pachadi — a unique dish with six tastes (sweet, sour, salty, bitter, spicy, astringent) representing all flavors of life",
      "Read the Panchanga Sravana (annual almanac reading)",
      "Visit temples and seek blessings",
      "Start new ventures, sign contracts",
    ],
    related: ["ram-navami", "akshaya-tritiya", "navratri"],
    metaDescription: "Ugadi / Gudi Padwa 2026 falls on March 19, marking the Hindu New Year. Get Pratipada tithi timings, Ugadi Pachadi recipe, Gudi hoisting ritual, and significance.",
  },
];

export function getFestivalBySlug(slug: string): FestivalDetail | undefined {
  return FESTIVALS.find(f => f.slug === slug);
}

export function getNextOccurrence(festival: FestivalDetail, fromDate: Date = new Date()): FestivalOccurrence | undefined {
  const today = new Date(fromDate);
  today.setHours(0, 0, 0, 0);
  const upcoming = festival.occurrences
    .map(o => ({ o, d: new Date(o.date + "T00:00:00") }))
    .filter(x => x.d >= today)
    .sort((a, b) => a.d.getTime() - b.d.getTime());
  return upcoming[0]?.o ?? festival.occurrences[festival.occurrences.length - 1];
}

export function getCurrentOrNextOccurrence(festival: FestivalDetail, fromDate: Date = new Date()): FestivalOccurrence | undefined {
  return getNextOccurrence(festival, fromDate);
}
