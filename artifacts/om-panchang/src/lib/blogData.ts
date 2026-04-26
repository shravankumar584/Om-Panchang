// Long-form blog / knowledge hub articles for Om Panchang.
// Each article is original, evergreen content written for SEO and reader value.
// Content avoids thin/duplicate text and links back to relevant tool pages.

export interface BlogSection {
  heading: string;
  paragraphs: string[];
}

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogRelatedLink {
  label: string;
  href: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  /** Short headline shown on cards (≤ 70 chars). */
  cardTitle: string;
  /** Hero meta description (150-160 chars). */
  metaDescription: string;
  /** Card teaser shown on the index page. */
  excerpt: string;
  category:
    | "Deities"
    | "Panchang Concepts"
    | "Vrat & Fasting"
    | "Life Ceremonies"
    | "Hindu Culture";
  /** Emoji shown as the visual on cards / hero. */
  emoji: string;
  /** Tailwind gradient classes for the hero (`from-X via-Y to-Z`). */
  gradient: string;
  /** ISO date when the article was published / last meaningfully updated. */
  publishDate: string; // YYYY-MM-DD
  /** Approximate read time in minutes. */
  readTime: number;
  /** Lead paragraph shown directly under the hero, before the sections. */
  intro: string;
  sections: BlogSection[];
  faqs: BlogFaq[];
  /** Internal links shown in the sidebar / "useful tools" box. */
  relatedLinks: BlogRelatedLink[];
  /** Slugs of related articles shown at the bottom (max 3). */
  relatedSlugs: string[];
}

export const BLOG_ARTICLES: BlogArticle[] = [
  // ────────────────────────────────────────────────────────────────────────
  // DEITIES (8)
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "lord-krishna",
    title: "Lord Krishna – Life, Leelas & Teachings",
    cardTitle: "Lord Krishna – Life & Teachings",
    metaDescription:
      "Discover Lord Krishna — the eighth avatar of Vishnu. Birth in Mathura, childhood leelas in Vrindavan, the Bhagavad Gita, and his timeless teachings explained.",
    excerpt:
      "From the playful cowherd of Vrindavan to the divine charioteer of Arjuna, Lord Krishna's life weaves devotion, philosophy, and dharma into one story.",
    category: "Deities",
    emoji: "🪈",
    gradient: "from-blue-700 via-indigo-700 to-purple-700",
    publishDate: "2026-04-26",
    readTime: 9,
    intro:
      "Lord Krishna is the eighth avatar of Lord Vishnu and one of the most beloved deities in the Hindu pantheon. Worshipped as the divine cowherd, the ideal friend, the perfect statesman, and the eternal teacher of the Bhagavad Gita, Krishna's life spans an extraordinary range — from playful childhood pranks in Vrindavan to the moral counsel he gave Arjuna on the battlefield of Kurukshetra.",
    sections: [
      {
        heading: "Birth in Mathura",
        paragraphs: [
          "Krishna was born on the eighth day (Ashtami) of the dark fortnight of Bhadrapada month — a day celebrated annually as Janmashtami. His parents, Devaki and Vasudeva, were imprisoned by Devaki's tyrant brother Kamsa, who had been told by a celestial voice that her eighth child would be his end.",
          "On the night of Krishna's birth, the prison locks fell open, the guards were put into deep sleep, and Vasudeva carried the infant across the swollen Yamuna river to Gokul, exchanging him with the newborn daughter of his cousin Nanda and his wife Yashoda. Krishna was thus raised as a cowherd boy, hiding in plain sight from Kamsa.",
        ],
      },
      {
        heading: "The Vrindavan Years",
        paragraphs: [
          "Krishna's childhood in Vrindavan is the source of countless leelas (divine plays). He stole butter, played his flute under the kadamba trees, danced the Raasa-Lila with the gopis, and lifted Govardhan Hill on his little finger to shelter the villagers from Indra's storm.",
          "These stories are not mere folklore — saints like Mirabai, Surdas and Chaitanya Mahaprabhu drew their entire spiritual paths from Krishna's Vrindavan leelas. Each tale carries a deep teaching: the gopis represent yearning souls, the butter represents a pure heart, and Govardhan represents God protecting devotees who take refuge in Him.",
        ],
      },
      {
        heading: "Krishna in the Mahabharata",
        paragraphs: [
          "As an adult, Krishna became the king of Dwarka and a central figure in the Mahabharata war. He chose not to fight himself, instead serving as Arjuna's charioteer. On the eve of battle, when Arjuna lost his nerve at the sight of his cousins and teachers in the opposing army, Krishna delivered the 700 verses of the Bhagavad Gita.",
          "The Gita compresses the entire Hindu philosophical tradition into a single conversation: Karma Yoga (the path of action), Bhakti Yoga (the path of devotion), and Jnana Yoga (the path of knowledge). Its message — perform your duty without attachment to results — remains one of the most quoted spiritual teachings in the world.",
        ],
      },
      {
        heading: "Teachings That Still Guide Hindus",
        paragraphs: [
          "Three teachings of Krishna shape daily Hindu practice. First, dharma must be defended even when it is uncomfortable. Second, devotion (bhakti) is open to everyone — the cowherd women of Vrindavan reached the divine through love, without scriptures or rituals. Third, the soul is eternal and unaffected by birth or death; this knowledge frees us from fear.",
          "Krishna's most famous promise — \"Whenever there is a decline of dharma, I shall manifest myself\" (Gita 4.7) — is the cornerstone of the avatar doctrine in Hinduism.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why is Krishna shown blue?",
        answer:
          "Blue represents the infinite — the colour of the sky and the ocean. It signifies that Krishna, like the cosmos, is limitless. Some scriptures also mention his complexion as dark like a rain cloud (megha-shyama).",
      },
      {
        question: "What is the difference between Krishna and Vishnu?",
        answer:
          "Vishnu is the preserver god of the Trimurti. Krishna is the eighth avatar (incarnation) of Vishnu, who took human form to restore dharma during the Dwapara Yuga.",
      },
      {
        question: "When is Krishna Janmashtami celebrated?",
        answer:
          "On the Ashtami (8th day) of the Krishna Paksha (waning fortnight) of the Bhadrapada month, which falls in August or September. The exact date varies each year by the lunar calendar.",
      },
    ],
    relatedLinks: [
      { label: "Krishna Janmashtami Date & Muhurat", href: "/janmashtami" },
      { label: "Today's Panchang", href: "/panchang-today" },
      { label: "All Hindu Festivals", href: "/hindu-festivals" },
    ],
    relatedSlugs: ["lord-vishnu", "lord-shiva", "significance-of-om"],
  },

  {
    slug: "lord-shiva",
    title: "Lord Shiva – The Destroyer, Yogi, and Cosmic Dancer",
    cardTitle: "Lord Shiva – Destroyer & Yogi",
    metaDescription:
      "Understand Lord Shiva — the third deity of the Hindu Trimurti, the meditating yogi of Kailash, the cosmic dancer Nataraja, his symbols, and his major festivals.",
    excerpt:
      "Shiva is the great paradox of Hinduism — the destroyer who is also the most loving, the wild ascetic who is also the perfect householder.",
    category: "Deities",
    emoji: "🕉️",
    gradient: "from-slate-800 via-indigo-900 to-blue-900",
    publishDate: "2026-04-26",
    readTime: 8,
    intro:
      "Lord Shiva, the third deity of the Hindu Trimurti, is at once the wild ascetic on Mount Kailash, the loving husband of Parvati, the cosmic dancer Nataraja, and the destroyer who clears the way for renewal. No other Hindu deity holds together so many seeming contradictions — and that is precisely the point.",
    sections: [
      {
        heading: "The Many Faces of Shiva",
        paragraphs: [
          "Shiva appears in four primary forms in Hindu worship. As Adiyogi, he is the original yogi, the source of all spiritual practice. As Nataraja, the cosmic dancer, his Tandava governs the rhythm of creation and dissolution. As Bholenath, the innocent one, he is famously easy to please — a single bilva leaf and a bowl of water are enough to win his blessing. And as Mahadeva, he is the supreme god of gods.",
          "He is also worshipped in his abstract form as the Shiva Linga — a vertical pillar representing the formless, beginningless, endless nature of consciousness itself.",
        ],
      },
      {
        heading: "Symbols and Their Meaning",
        paragraphs: [
          "Every element of Shiva's iconography carries meaning. The crescent moon on his head represents the cyclical nature of time. The Ganga river flowing from his matted hair shows that his being can absorb the entire river of grace and channel it gently to humans. The third eye signifies the wisdom that burns away ignorance. The trishul (trident) represents the three gunas — sattva, rajas, tamas — under his command.",
          "The serpent Vasuki coiled around his neck shows his mastery over fear and desire. His blue throat (Neelkanth) is a reminder of how he drank the cosmic poison Halahala to save the universe during the churning of the ocean.",
        ],
      },
      {
        heading: "Shiva and the Householder Path",
        paragraphs: [
          "Although Shiva is the original ascetic, he is also a model householder. His marriage to Parvati and their sons Ganesha and Kartikeya represent the integration of the spiritual and the worldly. Hindu households often worship Shiva-Parvati as the ideal divine couple, with prayers for marital harmony, healthy children, and prosperity.",
          "Vrats like Pradosh Vrat (twice a month) and Maha Shivratri (once a year) are dedicated to him, and Mondays (Somvar) are considered his weekly day of worship.",
        ],
      },
      {
        heading: "The Twelve Jyotirlingas",
        paragraphs: [
          "Across India, twelve great Shiva temples are revered as Jyotirlingas — sites where Shiva manifested as a column of light. They include Somnath in Gujarat, Mahakaleshwar in Ujjain, Kashi Vishwanath in Varanasi, Rameshwaram in Tamil Nadu, and Kedarnath in the Himalayas.",
          "A pilgrimage to all twelve Jyotirlingas is considered one of the most sacred journeys a Shaiva devotee can undertake.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why is Shiva called the destroyer?",
        answer:
          "In Hindu cosmology, destruction is not annihilation but transformation. Shiva clears away the old to make space for the new — without dissolution, there can be no creation.",
      },
      {
        question: "What is the meaning of Om Namah Shivaya?",
        answer:
          "It means \"I bow to Shiva\" — the five syllables (na-mah-shi-va-ya) represent the five elements (earth, water, fire, air, ether) of which the universe is made. It is Hinduism's most chanted mantra.",
      },
      {
        question: "Why do devotees pour milk on the Shiva Linga?",
        answer:
          "Milk symbolises purity and the cooling of fierce energy. The ritual is called Abhishekam and is believed to bring peace, health, and removal of obstacles.",
      },
    ],
    relatedLinks: [
      { label: "Maha Shivratri Date & Vrat", href: "/maha-shivratri" },
      { label: "Pradosh Vrat Dates", href: "/pradosh-vrat" },
      { label: "Today's Panchang", href: "/panchang-today" },
    ],
    relatedSlugs: ["lord-vishnu", "goddess-durga", "significance-of-om"],
  },

  {
    slug: "lord-vishnu",
    title: "Lord Vishnu – The Preserver and the Ten Avatars",
    cardTitle: "Lord Vishnu & the 10 Avatars",
    metaDescription:
      "Learn about Lord Vishnu, the preserver god of the Hindu Trimurti, his consort Lakshmi, the Dashavatara (ten incarnations), his symbols and worship traditions.",
    excerpt:
      "Vishnu sustains the universe — and whenever dharma collapses, he descends in a new avatar. Here is the full story of the Dashavatara.",
    category: "Deities",
    emoji: "🌀",
    gradient: "from-amber-400 via-yellow-500 to-orange-600",
    publishDate: "2026-04-26",
    readTime: 8,
    intro:
      "Lord Vishnu is the preserver and protector of the universe in the Hindu Trimurti. While Brahma creates and Shiva dissolves, it is Vishnu who maintains balance — and whenever evil grows powerful enough to threaten dharma, he descends to earth in a specific avatar to set things right.",
    sections: [
      {
        heading: "Vishnu and Lakshmi",
        paragraphs: [
          "Vishnu is depicted with four arms holding the conch (shankha), discus (sudarshana chakra), mace (gada), and lotus (padma). He reclines on the cosmic serpent Ananta-Shesha in the milky ocean (Kshira Sagara), with his consort Goddess Lakshmi at his feet.",
          "Together, Vishnu and Lakshmi represent the inseparable union of consciousness and prosperity, of the divine principle and the material universe it sustains.",
        ],
      },
      {
        heading: "The Dashavatara — Ten Incarnations",
        paragraphs: [
          "The ten avatars (Dashavatara) are: Matsya (the fish who saved the Vedas from the great flood), Kurma (the tortoise who supported Mount Mandara during the churning of the ocean), Varaha (the boar who lifted the earth from the cosmic ocean), Narasimha (the half-man, half-lion who killed the demon Hiranyakashipu), and Vamana (the dwarf who reclaimed the three worlds from King Bali).",
          "The remaining five are: Parashurama (the warrior-sage), Lord Rama (the ideal king of Ayodhya), Lord Krishna (the divine teacher of the Bhagavad Gita), Buddha (the enlightened one), and Kalki (the future avatar yet to appear at the end of Kali Yuga).",
        ],
      },
      {
        heading: "The Significance of Avatars",
        paragraphs: [
          "Each avatar appeared in a specific yuga to address a specific kind of crisis. Matsya saved knowledge during a cosmic flood. Narasimha protected the devotee Prahlad from his tyrannical father. Rama demonstrated the ideal of a king and a son. Krishna revealed the Bhagavad Gita.",
          "The avatar doctrine is one of Hinduism's most important contributions to world religion — it teaches that the divine is not distant, but actively involved in the world whenever it is needed.",
        ],
      },
      {
        heading: "Worship of Vishnu",
        paragraphs: [
          "Vishnu is worshipped as Narayana, Hari, Vasudeva, and many other names. Vaishnavism is one of the four major denominations of Hinduism, and includes traditions like Sri Vaishnavism (Ramanuja), Gaudiya Vaishnavism (Chaitanya), and Madhva Vaishnavism.",
          "Ekadashi vrat — the fast observed on the 11th day of every fortnight — is dedicated to Lord Vishnu and is the most widely practised devotional fast in Hindu tradition.",
        ],
      },
    ],
    faqs: [
      {
        question: "Who are the wives of Vishnu?",
        answer:
          "Vishnu's primary consort is Goddess Lakshmi. In southern traditions, he is also said to have Bhudevi (Earth) and Niladevi as consorts, who are aspects of the same Shakti.",
      },
      {
        question: "What is the meaning of Vishnu's discus (Sudarshana Chakra)?",
        answer:
          "The Sudarshana Chakra represents the wheel of time and the destroyer of ignorance. It is Vishnu's primary weapon for restoring cosmic order.",
      },
      {
        question: "Are there only ten avatars of Vishnu?",
        answer:
          "The Dashavatara is the most famous list, but the Bhagavata Purana mentions 24 avatars. Hindu tradition holds that Vishnu can take any form whenever dharma needs protection.",
      },
    ],
    relatedLinks: [
      { label: "Ekadashi Dates – All 24 Fasting Days", href: "/ekadashi-dates" },
      { label: "Goddess Lakshmi", href: "/blog/goddess-lakshmi" },
      { label: "Lord Krishna", href: "/blog/lord-krishna" },
    ],
    relatedSlugs: ["lord-krishna", "goddess-lakshmi", "lord-shiva"],
  },

  {
    slug: "goddess-lakshmi",
    title: "Goddess Lakshmi – Wealth, Fortune, and the Eight Forms",
    cardTitle: "Goddess Lakshmi – Eight Forms",
    metaDescription:
      "Goddess Lakshmi is the Hindu deity of wealth, fortune, and prosperity. Learn her Ashta Lakshmi (eight forms), iconography, Diwali worship, and Friday vrat.",
    excerpt:
      "Lakshmi is much more than the goddess of money — she presides over eight different kinds of abundance, from health to courage to knowledge.",
    category: "Deities",
    emoji: "🪷",
    gradient: "from-pink-500 via-rose-500 to-amber-500",
    publishDate: "2026-04-26",
    readTime: 7,
    intro:
      "Goddess Lakshmi is the Hindu goddess of wealth, fortune, beauty, and prosperity. As the consort of Lord Vishnu, she represents the active, abundant grace that sustains every household and every kingdom. But Lakshmi is not just material wealth — she is, in truth, every form of well-being.",
    sections: [
      {
        heading: "Iconography of Lakshmi",
        paragraphs: [
          "Lakshmi is depicted as a beautiful four-armed goddess seated or standing on a fully bloomed lotus. Two of her hands hold lotuses, one showers gold coins, and one is raised in the abhaya mudra (the gesture of fearlessness). She wears red and gold — the colours of fortune — and is often flanked by two elephants pouring water from golden pots.",
          "The lotus on which she rests teaches a profound lesson — even though it grows in muddy water, it remains untouched by the mud. True wealth, Lakshmi reminds us, must rest on the foundation of dharma.",
        ],
      },
      {
        heading: "Ashta Lakshmi — Eight Forms",
        paragraphs: [
          "Lakshmi is worshipped in eight primary forms (Ashta Lakshmi), each governing a different aspect of abundance. They are: Adi Lakshmi (the primordial), Dhana Lakshmi (monetary wealth), Dhanya Lakshmi (food and harvest), Gaja Lakshmi (royalty and power), Santana Lakshmi (children and progeny), Veera Lakshmi (courage and valour), Vijaya Lakshmi (victory), and Vidya Lakshmi (knowledge and education).",
          "This eightfold understanding is unique to Hindu thought — it teaches that prosperity is not one thing but many, and that a complete life requires all eight blessings.",
        ],
      },
      {
        heading: "Diwali and Lakshmi Puja",
        paragraphs: [
          "The annual worship of Lakshmi reaches its peak on Diwali night, when families clean and decorate their homes, light oil lamps, and perform Lakshmi Puja. The belief is that Lakshmi visits every clean and well-lit home on the night of Amavasya in Kartik month, blessing the household with prosperity for the coming year.",
          "Friday is the weekly day dedicated to Lakshmi, and the month of Kartik (October–November) is particularly auspicious for her worship.",
        ],
      },
      {
        heading: "The Story of the Churning",
        paragraphs: [
          "Lakshmi's most famous origin story comes from the Samudra Manthan — the cosmic churning of the ocean of milk. When the devas and asuras together churned the ocean using Mount Mandara as the rod and Vasuki as the rope, fourteen treasures emerged. Lakshmi was one of them — she rose from the ocean on a lotus and chose Vishnu as her eternal consort.",
          "This story is the source of the Hindu belief that Lakshmi is fickle but rewards effort — wealth comes only when one churns through difficulty without giving up.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why are coins given on Diwali?",
        answer:
          "Coins represent Dhana Lakshmi — the form of the goddess that presides over monetary wealth. Gifting coins on Diwali invites her blessing into the recipient's home.",
      },
      {
        question: "Why does Lakshmi sit on a lotus?",
        answer:
          "The lotus grows in muddy water yet stays pure. Lakshmi on a lotus teaches that true wealth must remain detached from greed and stay rooted in dharma.",
      },
      {
        question: "Which day of the week is best for Lakshmi worship?",
        answer:
          "Friday (Shukravara) is dedicated to Lakshmi. Many devotees observe Vaibhav Lakshmi Vrat on Fridays for prosperity and family well-being.",
      },
    ],
    relatedLinks: [
      { label: "Diwali Date & Lakshmi Puja Muhurat", href: "/diwali" },
      { label: "Dhanteras", href: "/dhanteras" },
      { label: "Marriage Muhurat", href: "/marriage-muhurat" },
    ],
    relatedSlugs: ["lord-vishnu", "lord-ganesha", "goddess-durga"],
  },

  {
    slug: "lord-ganesha",
    title: "Lord Ganesha – Remover of Obstacles and Lord of Beginnings",
    cardTitle: "Lord Ganesha – Remover of Obstacles",
    metaDescription:
      "Lord Ganesha is the Hindu deity of new beginnings, wisdom, and obstacle removal. Learn his birth story, symbols, mantras, and why he is worshipped first.",
    excerpt:
      "Before any puja, before any new venture, Hindus invoke Ganesha. Why? Because he stands at the threshold between failure and success.",
    category: "Deities",
    emoji: "🐘",
    gradient: "from-orange-500 via-red-500 to-pink-500",
    publishDate: "2026-04-26",
    readTime: 7,
    intro:
      "Lord Ganesha — the elephant-headed son of Shiva and Parvati — is invoked before every Hindu ritual, every new home, every wedding, and every new business. He is Vighnaharta (the remover of obstacles) and Vinayaka (the supreme leader). No other deity occupies such a unique place in Hindu daily life.",
    sections: [
      {
        heading: "The Birth of Ganesha",
        paragraphs: [
          "The most popular birth story of Ganesha comes from the Shiva Purana. Goddess Parvati created a boy from the turmeric paste she used during her bath and asked him to guard the door while she bathed. When Lord Shiva returned and was stopped by this unknown boy, a fierce battle followed and Shiva, in his anger, severed the child's head.",
          "When Parvati discovered what had happened, she was inconsolable. To restore the child, Shiva asked his ganas to bring the head of the first creature they found facing north. They returned with the head of an elephant, which was joined to the boy's body. He was given the name Ganesha — lord of the ganas — and granted the boon that he would always be worshipped first.",
        ],
      },
      {
        heading: "Symbolism of His Form",
        paragraphs: [
          "Every part of Ganesha's appearance carries deep meaning. His large head represents wisdom and the power to think big. His large ears teach us to listen more than we speak. His small eyes represent focus and concentration. His broken tusk symbolises the willingness to sacrifice for a higher purpose.",
          "His large belly represents the ability to digest both the joys and sorrows of life. His mount, the mouse, represents the restless mind that he keeps under perfect control. The modak (sweet) in his hand represents the sweetness of self-realisation that comes to all who follow his path.",
        ],
      },
      {
        heading: "Ganesh Chaturthi",
        paragraphs: [
          "Ganesh Chaturthi, celebrated on the fourth day of the bright fortnight in Bhadrapada month, is the largest Ganesha festival. Clay murtis of Ganesha are installed in homes and public pandals, worshipped for one to ten days, and then immersed in water (visarjan) — symbolising that even the gods we love must return to their source.",
          "The festival is observed with the greatest enthusiasm in Maharashtra, Karnataka, Andhra Pradesh, and the Hindu diaspora. Lord Bal Gangadhar Tilak transformed it into a public celebration during the freedom movement to unite Indians.",
        ],
      },
      {
        heading: "Names and Mantras",
        paragraphs: [
          "Ganesha has 108 names — the most famous of which include Ganapati, Vinayaka, Vighnaharta, Ekadanta, Lambodara, Gajanana, and Siddhi-Vinayaka. The most chanted Ganesha mantra is \"Om Gam Ganapataye Namah\", which is believed to remove obstacles and grant wisdom.",
          "Wednesday (Budhvara) is associated with Ganesha, and the chaturthi (4th day) of every lunar fortnight is observed as Sankashti Chaturthi or Vinayak Chaturthi by his devotees.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why is Ganesha worshipped first?",
        answer:
          "Lord Shiva granted Ganesha the boon that he would be worshipped before any other deity in any ritual. This is why every Hindu puja begins with \"Om Shri Ganeshaya Namah\".",
      },
      {
        question: "Why does Ganesha have a broken tusk?",
        answer:
          "Several stories explain this. The most famous says he broke his own tusk to use as a pen while writing down the Mahabharata as Sage Vyasa dictated it. It teaches us to sacrifice the small for the great.",
      },
      {
        question: "What is the favourite food of Ganesha?",
        answer:
          "Modak — a sweet rice-flour dumpling filled with jaggery and coconut. It represents the inner sweetness that spiritual practice brings.",
      },
    ],
    relatedLinks: [
      { label: "Ganesh Chaturthi Date & Muhurat", href: "/ganesh-chaturthi" },
      { label: "Today's Panchang", href: "/panchang-today" },
      { label: "Marriage Muhurat", href: "/marriage-muhurat" },
    ],
    relatedSlugs: ["lord-shiva", "goddess-durga", "namakaran-ceremony"],
  },

  {
    slug: "goddess-durga",
    title: "Goddess Durga – The Divine Feminine and Her Nine Forms",
    cardTitle: "Goddess Durga – Nine Forms (Navadurga)",
    metaDescription:
      "Goddess Durga is the warrior form of the Divine Mother in Hinduism. Learn about Navadurga (her nine forms worshipped during Navratri) and her symbolism.",
    excerpt:
      "Durga rides a lion, carries weapons in her ten arms, and slays the buffalo demon — yet she is also the mother who protects every devotee.",
    category: "Deities",
    emoji: "🗡️",
    gradient: "from-red-600 via-rose-600 to-purple-700",
    publishDate: "2026-04-26",
    readTime: 8,
    intro:
      "Goddess Durga is the warrior form of the Hindu Divine Mother — the supreme Shakti who took form to defeat the demon Mahishasura when even the gods could not. She is fierce, beautiful, and infinitely loving — and is worshipped with the greatest devotion during the nine nights of Navratri.",
    sections: [
      {
        heading: "The Slaying of Mahishasura",
        paragraphs: [
          "The Devi Mahatmyam (Chandi Path) tells how the buffalo demon Mahishasura had defeated all the gods and conquered the heavens. Unable to stop him, the gods combined their energies (tejas) into a single radiant form — and from this divine combination, Goddess Durga emerged.",
          "She was given weapons by all the gods — Shiva's trident, Vishnu's discus, Indra's thunderbolt, Varuna's conch — and rode into battle on a lion. After a fierce nine-day fight, she slayed Mahishasura on the tenth day. This day is celebrated as Vijaya Dashami or Dussehra — the victory of dharma over adharma.",
        ],
      },
      {
        heading: "The Nine Forms — Navadurga",
        paragraphs: [
          "During the nine nights of Navratri, Hindus worship nine different forms of Durga, one each night. They are: Shailaputri (daughter of the mountain), Brahmacharini (the celibate ascetic), Chandraghanta (the one with the half-moon bell), Kushmanda (creator of the cosmic egg), Skandamata (mother of Kartikeya), Katyayani (the warrior born to sage Katyayana), Kalaratri (the dark night), Mahagauri (the radiant white), and Siddhidatri (the granter of perfections).",
          "Each form represents a different stage of spiritual development — from raw devotion to enlightened wisdom. Worshipping all nine in sequence is believed to bring complete inner transformation.",
        ],
      },
      {
        heading: "Iconography of the Mother",
        paragraphs: [
          "Durga is typically shown with eight or ten arms, each holding a different weapon — a sword, trident, discus, conch, bow and arrow, mace, lotus, and thunderbolt. Her vahana (mount) is the lion, representing courage and the conquered ego. Her serene face contrasts with her fierce battle posture, conveying the truth that the divine remains calm even while removing evil.",
          "She is often called Mahishasuramardini (the slayer of Mahishasura), Sherawali (the lion-rider), Amba, Bhavani, and Adi Shakti.",
        ],
      },
      {
        heading: "Durga Worship Across India",
        paragraphs: [
          "Bengal celebrates Durga Puja as its grandest festival, with elaborate pandals depicting her with her four children — Lakshmi, Saraswati, Ganesha, and Kartikeya. Gujarat celebrates Navratri with the famous Garba and Dandiya dances. North India observes Durga Ashtami and Ram Navami within the same Navratri period. South India celebrates Bommai Golu with display arrangements of dolls.",
          "Across all regions, the message is the same — the Divine Mother always answers when sincerely called.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are Durga, Kali and Parvati the same?",
        answer:
          "Yes — they are different forms of the same Adi Shakti. Parvati is the gentle householder form, Durga is the warrior form, and Kali is the fierce destroyer of ego and evil.",
      },
      {
        question: "Why does Durga ride a lion?",
        answer:
          "The lion represents the controlled animal nature within us. Durga riding a lion teaches that the divine has mastered all wild instincts and rides them with grace.",
      },
      {
        question: "How many days of Navratri are there?",
        answer:
          "Nine days. Each day is dedicated to one of the Navadurga forms. The tenth day is Vijaya Dashami (Dussehra), the celebration of her victory.",
      },
    ],
    relatedLinks: [
      { label: "Navratri Dates & Pujas", href: "/navratri" },
      { label: "Dussehra (Vijaya Dashami)", href: "/dussehra" },
      { label: "Today's Panchang", href: "/panchang-today" },
    ],
    relatedSlugs: ["lord-shiva", "goddess-lakshmi", "goddess-saraswati"],
  },

  {
    slug: "lord-hanuman",
    title: "Lord Hanuman – The Embodiment of Devotion and Strength",
    cardTitle: "Lord Hanuman – Devotion & Strength",
    metaDescription:
      "Lord Hanuman is the Hindu deity of devotion, strength, and selfless service. Learn his birth story, role in the Ramayana, and the power of Hanuman Chalisa.",
    excerpt:
      "From leaping across the ocean to carrying a mountain back, Hanuman shows what is possible when devotion is total and the ego is absent.",
    category: "Deities",
    emoji: "🪯",
    gradient: "from-orange-600 via-red-600 to-rose-700",
    publishDate: "2026-04-26",
    readTime: 7,
    intro:
      "Lord Hanuman, the vanara (monkey) devotee of Lord Rama, is one of the most beloved deities in Hinduism. He is the perfect embodiment of bhakti (devotion), strength, courage, and selfless service. Worshipping Hanuman is said to instantly remove fear and grant the strength to face any challenge.",
    sections: [
      {
        heading: "Birth and Childhood",
        paragraphs: [
          "Hanuman was born to Anjana, a celestial nymph, and Kesari, a vanara king. His divine father was Lord Vayu (the wind god), which is why Hanuman is also called Pavanaputra and Vayuputra. He was born on the full moon day of Chaitra month — celebrated as Hanuman Jayanti.",
          "As a child, Hanuman once tried to swallow the Sun, mistaking it for a fruit. Indra struck him with his thunderbolt, breaking his jaw — which is how Hanuman got his name (\"hanu\" means jaw). Furious at his son's injury, Vayu withdrew air from the world. To pacify him, the gods blessed the child with extraordinary boons — strength greater than any creature, the ability to change size and shape, and immortality.",
        ],
      },
      {
        heading: "The Ramayana",
        paragraphs: [
          "Hanuman's role in the Ramayana is so central that without him, the story cannot be told. He met Lord Rama in the Kishkindha forest while Rama was searching for Sita, and from that moment became the most loyal devotee in all of Hindu tradition.",
          "He leaped across the ocean to Lanka, found Sita in the Ashoka Vatika, burned down Lanka, brought back her message, carried the Sanjivani mountain to save Lakshmana, and fought countless rakshasas in the great war. Through all of it, his only motivation was service to Rama.",
        ],
      },
      {
        heading: "Hanuman as Chiranjeevi",
        paragraphs: [
          "Hanuman is one of the eight Chiranjeevis — beings believed to live on through all four yugas. Hindu tradition holds that Hanuman is still present in the world today, appearing wherever the Ramayana is sincerely recited or where devotees call him with pure heart.",
          "This is why so many Hanuman temples have a continuous chanting tradition — and why devotees believe their prayers to him are answered with extraordinary speed.",
        ],
      },
      {
        heading: "The Hanuman Chalisa",
        paragraphs: [
          "Composed by the saint-poet Tulsidas, the Hanuman Chalisa is a 40-verse hymn praising Hanuman. Reciting it daily — especially on Tuesdays and Saturdays, the days associated with Hanuman — is believed to remove fear, grant strength, and protect against negative influences.",
          "The Chalisa is one of the most widely recited prayers in the Hindu world. Many devotees commit it to memory and recite it during difficult times.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why is Hanuman shown holding a mountain?",
        answer:
          "It refers to the Ramayana episode where Hanuman flew to the Himalayas to find the Sanjivani herb to save Lakshmana. Unable to identify the specific herb, he carried the entire mountain back to Lanka.",
      },
      {
        question: "Which day of the week is dedicated to Hanuman?",
        answer:
          "Tuesday (Mangalvara) and Saturday (Shanivara) are both considered auspicious for Hanuman worship. Many devotees observe partial fasts on these days.",
      },
      {
        question: "What is the meaning of orange (sindoor) on Hanuman's body?",
        answer:
          "When Hanuman saw Sita applying sindoor (vermilion) and learned it was for Rama's long life, he covered his entire body with sindoor — believing more sindoor would mean even longer life for Rama. This is why his murtis are coloured orange-red.",
      },
    ],
    relatedLinks: [
      { label: "Hanuman Jayanti Date", href: "/hanuman-jayanti" },
      { label: "Ram Navami Date & Puja", href: "/ram-navami" },
      { label: "Today's Panchang", href: "/panchang-today" },
    ],
    relatedSlugs: ["lord-vishnu", "lord-shiva", "significance-of-om"],
  },

  {
    slug: "goddess-saraswati",
    title: "Goddess Saraswati – Deity of Knowledge & Arts",
    cardTitle: "Goddess Saraswati – Knowledge & Arts",
    metaDescription:
      "Goddess Saraswati is the Hindu deity of knowledge, music, and the arts. Learn her iconography, her role as Brahma's consort, and the Vasant Panchami festival.",
    excerpt:
      "Saraswati is the only Hindu deity whose worship is universal across all schools — because all paths require knowledge to begin.",
    category: "Deities",
    emoji: "📚",
    gradient: "from-yellow-300 via-amber-400 to-orange-500",
    publishDate: "2026-04-26",
    readTime: 6,
    intro:
      "Goddess Saraswati is the Hindu deity of knowledge, music, art, language, and learning. As the consort of Brahma the creator, she represents the wisdom that any creator must have. She is worshipped by students, teachers, musicians, writers, and seekers of every kind.",
    sections: [
      {
        heading: "Iconography",
        paragraphs: [
          "Saraswati is depicted as a serene, four-armed goddess dressed in spotless white — the colour of purity and unstained knowledge. She holds a veena (a stringed musical instrument) in two hands, a book of the Vedas in one, and a string of japa beads in another.",
          "Her vahana is the swan (hamsa) — a bird traditionally said to be able to separate milk from water, representing the ability of true knowledge to discern truth from illusion. She is sometimes depicted seated on a white lotus or beside a river, signifying flowing wisdom.",
        ],
      },
      {
        heading: "The Saraswati River",
        paragraphs: [
          "Saraswati was originally a river goddess of the Vedic period. The Rigveda speaks of the Saraswati river as one of the seven sacred rivers of the Aryan civilisation, alongside the Ganga and the Yamuna. Modern satellite studies have identified the dried-up bed of an ancient river in Rajasthan and Haryana that may correspond to the Vedic Saraswati.",
          "Over time, the river goddess became identified with wisdom and learning — water being the natural symbol for the flowing of knowledge.",
        ],
      },
      {
        heading: "Vasant Panchami",
        paragraphs: [
          "Saraswati's main festival is Vasant Panchami, celebrated on the fifth day (Panchami) of the bright fortnight of Magha month — usually in late January or early February. It marks the arrival of spring and is considered the most auspicious day to begin a child's education (Vidyarambham), to begin learning music or dance, or to start a new book.",
          "On this day, devotees wear yellow (the colour of mustard flowers and spring), worship books and musical instruments, and feed the poor. Schools and music academies across India hold special Saraswati pujas.",
        ],
      },
    ],
    faqs: [
      {
        question: "Who is the husband of Saraswati?",
        answer:
          "Goddess Saraswati is the consort of Lord Brahma — the creator god of the Trimurti. The Vedas describe her as the source of his creative wisdom.",
      },
      {
        question: "Why is Saraswati always shown in white?",
        answer:
          "White represents purity, clarity, and the unstained nature of true knowledge. It also signifies that wisdom is impartial — it does not favour one person over another.",
      },
      {
        question: "When is Saraswati Puja performed?",
        answer:
          "On Vasant Panchami (5th day of bright fortnight in Magha month, usually late January–early February). She is also widely worshipped on the last three days of Navratri (Saraswati Avahan, Puja, and Visarjan) in many South Indian traditions, when books and instruments are placed before her for blessing.",
      },
    ],
    relatedLinks: [
      { label: "Today's Panchang", href: "/panchang-today" },
      { label: "All Hindu Festivals", href: "/hindu-festivals" },
      { label: "Baby Names by Nakshatra", href: "/baby-names-by-nakshatra" },
    ],
    relatedSlugs: ["goddess-durga", "goddess-lakshmi", "lord-ganesha"],
  },

  // ────────────────────────────────────────────────────────────────────────
  // PANCHANG CONCEPTS (4)
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "what-is-tithi",
    title: "What is Tithi? The 30 Lunar Days of Hindu Calendar",
    cardTitle: "What is Tithi? Lunar Days Explained",
    metaDescription:
      "Tithi is the lunar day in the Hindu calendar — based on the 12° angle between Sun and Moon. Learn the 30 tithis, the paksha system, and why tithi length varies.",
    excerpt:
      "Most Hindus check the tithi before any auspicious work — but what exactly is a tithi, and why does it sometimes skip a day?",
    category: "Panchang Concepts",
    emoji: "🌗",
    gradient: "from-indigo-700 via-purple-700 to-violet-800",
    publishDate: "2026-04-26",
    readTime: 6,
    intro:
      "Tithi is the most important of the five elements of the Panchang (Hindu almanac). It is the lunar day, calculated from the angular distance between the Sun and the Moon. Understanding tithi is the foundation for understanding every Hindu festival, vrat, and auspicious timing.",
    sections: [
      {
        heading: "How Tithi is Calculated",
        paragraphs: [
          "Each tithi is the time taken for the Moon to gain 12° of distance from the Sun. Since there are 360° in a circle, there are 30 tithis in a complete lunar month — 15 in the bright fortnight (Shukla Paksha, when the Moon is waxing) and 15 in the dark fortnight (Krishna Paksha, when the Moon is waning).",
          "The 15 tithis in each paksha are: Pratipada (1st), Dwitiya (2nd), Tritiya, Chaturthi, Panchami, Shashthi, Saptami, Ashtami, Navami, Dashami, Ekadashi, Dwadashi, Trayodashi, Chaturdashi, and Purnima (full moon, 15th day of Shukla) or Amavasya (new moon, 15th day of Krishna).",
        ],
      },
      {
        heading: "Why Tithi Length Varies",
        paragraphs: [
          "Unlike a solar day, which is exactly 24 hours, a tithi can be anywhere between roughly 19 and 26 hours long. This is because the Moon does not move at a constant speed around the Earth — it moves faster when closer (perigee) and slower when farther (apogee).",
          "This variability gives rise to two interesting situations. When a tithi is shorter than 24 hours, it can begin and end entirely between two sunrises — never \"touching\" a sunrise — and is therefore considered skipped (called \"tithi kshaya\"). When a tithi is longer than 24 hours, it spans two consecutive sunrises and so is counted on two solar dates (called \"tithi vriddhi\"). This is why your phone calendar sometimes seems to skip or repeat a tithi.",
        ],
      },
      {
        heading: "Why Tithi Matters",
        paragraphs: [
          "Almost every Hindu festival is determined by tithi, not by date. Diwali is on Kartik Amavasya, Janmashtami on Bhadrapada Krishna Ashtami, Ram Navami on Chaitra Shukla Navami, and Ekadashi vrat on every 11th tithi of both pakshas. Knowing the tithi tells you the festival.",
          "Tithi also governs the choice of muhurta. Some tithis (like Nanda — Pratipada, Shashthi, Ekadashi) are auspicious for new beginnings. Others (like Rikta — Chaturthi, Navami, Chaturdashi) are avoided for weddings and major ventures.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the difference between tithi and date?",
        answer:
          "A date is a solar concept — 24 hours from midnight to midnight. A tithi is a lunar concept — the 12° gap between Sun and Moon, which varies in duration. A single date can have one or two tithis depending on lunar speed.",
      },
      {
        question: "What is paksha?",
        answer:
          "A paksha is a fortnight of 15 tithis. Shukla Paksha (bright) starts after Amavasya and ends on Purnima. Krishna Paksha (dark) starts after Purnima and ends on Amavasya.",
      },
      {
        question: "Which tithi is the most auspicious?",
        answer:
          "It depends on the activity. Ekadashi is best for spiritual work, Trayodashi (Pradosh) for Shiva worship, Purnima for full-moon rituals, and Pratipada for new beginnings.",
      },
    ],
    relatedLinks: [
      { label: "Today's Panchang (with Tithi)", href: "/panchang-today" },
      { label: "Ekadashi Dates", href: "/ekadashi-dates" },
      { label: "Amavasya Dates", href: "/amavasya-dates" },
    ],
    relatedSlugs: ["the-27-nakshatras", "ekadashi-vrat-explained", "rahu-kalam-explained"],
  },

  {
    slug: "the-27-nakshatras",
    title: "The 27 Nakshatras – Lunar Mansions of Vedic Astrology",
    cardTitle: "The 27 Nakshatras Explained",
    metaDescription:
      "The 27 Nakshatras are lunar mansions used in Vedic astrology to mark the Moon's path. Learn the names, ruling deities, and how to find your janma nakshatra.",
    excerpt:
      "Long before the Greeks gave us 12 zodiac signs, India divided the sky into 27 nakshatras — each one a personal star.",
    category: "Panchang Concepts",
    emoji: "✨",
    gradient: "from-violet-700 via-purple-700 to-fuchsia-700",
    publishDate: "2026-04-26",
    readTime: 7,
    intro:
      "The 27 Nakshatras are the lunar mansions of Vedic astrology — the 27 segments of the sky through which the Moon passes during one lunar month. They are far older than the 12-sign zodiac of Western astrology and form the foundation of Hindu naming traditions, marriage matching, and daily auspicious timings.",
    sections: [
      {
        heading: "What is a Nakshatra?",
        paragraphs: [
          "The Moon takes about 27.32 days to complete one revolution around the Earth, passing through 360° of the zodiac. Vedic astronomers divided this circle into 27 equal segments of 13°20' each — and called each segment a Nakshatra. The Moon \"stays\" in each nakshatra for roughly one day.",
          "Each nakshatra is named after a real visible star or asterism. For example, Rohini is the bright star Aldebaran, Pushya is in the constellation Cancer, and Chitra is the star Spica in Virgo.",
        ],
      },
      {
        heading: "The 27 Nakshatras in Order",
        paragraphs: [
          "Beginning at 0° Aries: Ashwini, Bharani, Krittika, Rohini, Mrigashira, Ardra, Punarvasu, Pushya, Ashlesha, Magha, Purva Phalguni, Uttara Phalguni, Hasta, Chitra, Swati, Vishakha, Anuradha, Jyeshtha, Mula, Purva Ashadha, Uttara Ashadha, Shravana, Dhanishta, Shatabhisha, Purva Bhadrapada, Uttara Bhadrapada, and Revati.",
          "Each nakshatra is ruled by a deity (e.g., Ashwini by the Ashwini Kumaras, Rohini by Brahma, Pushya by Brihaspati) and a planetary lord (used in Vimshottari Dasha calculations). Each is also associated with a specific syllable used for naming children born in it.",
        ],
      },
      {
        heading: "Janma Nakshatra and Its Importance",
        paragraphs: [
          "Your Janma Nakshatra is the nakshatra in which the Moon was placed at the moment of your birth. In Hindu tradition, this is considered far more personal than your Sun sign — it shapes your basic temperament, your favourable directions, your auspicious days, and even your marriage compatibility.",
          "The Janma Nakshatra also gives the auspicious starting syllable (Naamakshar) for the child's name. This is why traditional Hindu naming ceremonies (Namakaran) consult the Panchang to determine the name's first sound.",
        ],
      },
      {
        heading: "Nakshatras in Marriage Matching",
        paragraphs: [
          "In Vedic marriage matching (Kundali Milan / Ashtakoot), eight kootas are calculated and most of them depend on the nakshatras of the boy and girl. Specifically, Tara Koota, Yoni Koota, Graha Maitri, Gana Koota, Nadi Koota, and others are all derived from the nakshatra positions.",
          "A high compatibility score (typically 18 or more out of 36) is considered necessary for marriage in traditional Hindu families, although astrologers always advise that the full chart should be considered, not just the score.",
        ],
      },
    ],
    faqs: [
      {
        question: "How do I find my Janma Nakshatra?",
        answer:
          "Use a Kundali calculator with your birth date, exact time, and place. The Moon's nakshatra at the moment of your birth is your Janma Nakshatra. Try our free Kundali Calculator for instant results.",
      },
      {
        question: "How many padas are in a nakshatra?",
        answer:
          "Each nakshatra is divided into 4 padas (quarters), giving 108 padas in total. This is why the sacred number 108 appears so often in Hindu tradition (108 mantra repetitions, 108 beads in a japa mala, etc.).",
      },
      {
        question: "Are nakshatras the same as zodiac signs?",
        answer:
          "No. There are 27 nakshatras and 12 zodiac signs, both covering the same 360°. Nakshatras divide the sky into smaller, more personal segments. Vedic astrology uses both — the rashi for personality and the nakshatra for fine detail.",
      },
    ],
    relatedLinks: [
      { label: "Free Kundali Calculator", href: "/kundali" },
      { label: "Baby Names by Nakshatra", href: "/baby-names-by-nakshatra" },
      { label: "Kundali Milan", href: "/kundali-milan" },
    ],
    relatedSlugs: ["what-is-tithi", "namakaran-ceremony", "marriage-muhurat-explained"],
  },

  {
    slug: "brahma-muhurta",
    title: "Brahma Muhurta – The Most Sacred 96 Minutes of the Day",
    cardTitle: "Brahma Muhurta – Sacred Hour of Dawn",
    metaDescription:
      "Brahma Muhurta is the 96-minute window before sunrise considered most sacred in Hindu and Ayurvedic tradition. Learn its timing, science, and benefits.",
    excerpt:
      "The Vedas, Ayurveda and Yoga all agree on one thing: the 96 minutes before sunrise are unlike any other time of day.",
    category: "Panchang Concepts",
    emoji: "🌅",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    publishDate: "2026-04-26",
    readTime: 5,
    intro:
      "Brahma Muhurta — literally \"the time of Brahma\" or \"the time of the divine\" — is the 96-minute window just before sunrise. The Vedas, Ayurveda, and Yoga traditions are unanimous: this is the single most spiritually beneficial period of the entire 24-hour cycle.",
    sections: [
      {
        heading: "When is Brahma Muhurta?",
        paragraphs: [
          "Brahma Muhurta begins 96 minutes before sunrise and lasts for 48 minutes (one muhurta of 48 minutes is the unit). For example, if sunrise is at 6:00 AM, Brahma Muhurta runs from approximately 4:24 AM to 5:12 AM.",
          "Because it depends on local sunrise, the time is different for every city and changes daily through the year. A panchang for your specific city is the only reliable way to know your exact Brahma Muhurta timing.",
        ],
      },
      {
        heading: "Why is it Sacred?",
        paragraphs: [
          "According to the Yoga and Tantra traditions, the atmosphere during Brahma Muhurta has a particular quality — the air is filled with high concentrations of negative ions, the noise of the world has not yet begun, and the mind is naturally most still. The Bhagavata Purana, Vishnu Smriti, and many Upanishads all recommend rising during this period for meditation, study, and self-reflection.",
          "Modern sleep science partially confirms this: REM sleep (and the dreams that come with it) ends roughly 90 minutes before natural waking, leaving the mind in a uniquely receptive state if one rises early enough.",
        ],
      },
      {
        heading: "What to Do During Brahma Muhurta",
        paragraphs: [
          "Traditional practices include: silent meditation (dhyana), japa (mantra repetition), pranayama (breath work), reading scripture, and personal prayer. Ayurveda also recommends light yogic asana, sipping warm water, and oil pulling (gandusha) during this time.",
          "What to avoid: heavy food, news consumption, screens, loud music. The point of Brahma Muhurta is to give your mind a window of clarity before the noise of the day begins.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is Brahma Muhurta the same every day?",
        answer:
          "No. Because it is calculated relative to sunrise — and sunrise time changes daily and by location — Brahma Muhurta is different for every city and every day.",
      },
      {
        question: "Can I skip Brahma Muhurta and still benefit spiritually?",
        answer:
          "Yes. Hindu tradition does not insist on it for everyone. But those who do consistently rise during this window report deeper meditation, better focus, and a calmer mind throughout the day.",
      },
      {
        question: "Should I eat anything during Brahma Muhurta?",
        answer:
          "Traditionally, only warm water (or warm water with lemon/ginger). Heavy food blunts the meditative quality of this period. A proper breakfast can come 30–60 minutes after sunrise.",
      },
    ],
    relatedLinks: [
      { label: "Today's Brahma Muhurta Time", href: "/brahma-muhurta" },
      { label: "Today's Panchang", href: "/panchang-today" },
      { label: "Rahu Kalam Today", href: "/rahu-kalam-today" },
    ],
    relatedSlugs: ["rahu-kalam-explained", "what-is-tithi", "significance-of-om"],
  },

  {
    slug: "rahu-kalam-explained",
    title: "Rahu Kalam – Why Hindus Avoid This Period Every Day",
    cardTitle: "Rahu Kalam – The Inauspicious Hour",
    metaDescription:
      "Rahu Kalam is a 90-minute inauspicious daily window in Hindu tradition. Learn how it is calculated, the day-by-day chart, and what to avoid during it.",
    excerpt:
      "If you've ever been told \"don't start anything new now, it's Rahu Kalam\" — here's the full explanation behind that warning.",
    category: "Panchang Concepts",
    emoji: "🌑",
    gradient: "from-slate-700 via-slate-800 to-zinc-900",
    publishDate: "2026-04-26",
    readTime: 5,
    intro:
      "Rahu Kalam (also spelled Rahu Kaalam) is a roughly 90-minute period each day during which Hindus traditionally avoid starting any important activity. It is one of the most widely observed muhurta concepts in Hindu daily life, especially across South India.",
    sections: [
      {
        heading: "How Rahu Kalam is Calculated",
        paragraphs: [
          "The time between local sunrise and sunset is divided into 8 equal parts. Each weekday assigns one of these parts to Rahu: Sunday → 8th part, Monday → 2nd, Tuesday → 7th, Wednesday → 5th, Thursday → 6th, Friday → 4th, and Saturday → 3rd. (The 1st part of the day is never Rahu Kalam, on any weekday.)",
          "For a 12-hour day, each part is 90 minutes. For longer summer days or shorter winter days, the duration varies. This is why Rahu Kalam is different in Mumbai vs. New York and changes day by day.",
        ],
      },
      {
        heading: "Quick Day-by-Day Reference",
        paragraphs: [
          "On a roughly 12-hour day with sunrise at 6 AM, Rahu Kalam falls approximately as follows: Monday 7:30–9:00 AM, Tuesday 3:00–4:30 PM, Wednesday 12:00–1:30 PM, Thursday 1:30–3:00 PM, Friday 10:30 AM–12:00 PM, Saturday 9:00–10:30 AM, Sunday 4:30–6:00 PM.",
          "Use a city-specific Panchang for exact timing on any date. Two related inauspicious periods — Yamagandam and Gulika Kalam — are calculated using the same 8-part division.",
        ],
      },
      {
        heading: "What to Avoid During Rahu Kalam",
        paragraphs: [
          "Traditional advice: do not start a new business, do not begin a journey, do not sign important contracts, do not perform marriage ceremonies, and do not begin any activity meant to last (housewarming, naming ceremony, school admission, etc.).",
          "What is allowed: continuing an ongoing task, performing daily routines, attending to emergencies, and some traditions allow Rahu-specific rituals (like Rahu shanti pooja) which are actually believed to be more effective during this window.",
        ],
      },
      {
        heading: "Should You Take It Seriously?",
        paragraphs: [
          "This is up to your faith and family tradition. Rationally, the practice has the side effect of forcing you to plan your day rather than start things impulsively — there is wisdom in that. Devotionally, Hindus believe that beginning under Rahu's shadow brings obstacles to even simple ventures.",
          "Many modern Hindus follow it loosely — they avoid major decisions during Rahu Kalam but don't pause everything. The original purpose was never to paralyse the day; it was to remind us that not every moment is equally suitable for every action.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is Rahu Kalam different every day?",
        answer:
          "Yes. The duration depends on the length of the day (which varies through the year) and the part of the day depends on the day of the week.",
      },
      {
        question: "What is the difference between Rahu Kalam, Yamagandam and Gulika Kalam?",
        answer:
          "All three are calculated using the same 8-part division of the day. Rahu, Yamaganda, and Gulika each get one part on each day of the week — they are different inauspicious windows ruled by different shadow planets.",
      },
      {
        question: "Can I travel during Rahu Kalam?",
        answer:
          "Traditionally, no — especially not for the start of a long journey. For routine commutes, most families don't observe it strictly. Use your judgement and family tradition.",
      },
    ],
    relatedLinks: [
      { label: "Today's Rahu Kalam Time", href: "/rahu-kalam-today" },
      { label: "Choghadiya Today", href: "/choghadiya-today" },
      { label: "Today's Panchang", href: "/panchang-today" },
    ],
    relatedSlugs: ["brahma-muhurta", "what-is-tithi", "marriage-muhurat-explained"],
  },

  // ────────────────────────────────────────────────────────────────────────
  // VRAT & FASTING (3)
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "ekadashi-vrat-explained",
    title: "Ekadashi Vrat – Why Hindus Fast Twice Every Month",
    cardTitle: "Ekadashi Vrat – The Twice-Monthly Fast",
    metaDescription:
      "Ekadashi is observed on the 11th tithi of every fortnight — 24 fasts a year. Learn the spiritual reason, allowed foods, parana timing, and major Ekadashis.",
    excerpt:
      "Ekadashi is the most widely observed fast in Hinduism. Here is what makes the 11th tithi so special — and how to observe it correctly.",
    category: "Vrat & Fasting",
    emoji: "🌙",
    gradient: "from-indigo-600 via-blue-700 to-cyan-700",
    publishDate: "2026-04-26",
    readTime: 6,
    intro:
      "Ekadashi — the 11th tithi of every lunar fortnight — is the most widely observed fasting day in Hinduism. With two ekadashis every month (one in Shukla Paksha and one in Krishna Paksha), there are 24 ekadashi vrats in a year. Each one is dedicated to Lord Vishnu, and each one carries its own name and story.",
    sections: [
      {
        heading: "Why the 11th Tithi?",
        paragraphs: [
          "According to the Padma Purana, Ekadashi is a personification — the goddess Ekadashi was created from the body of Lord Vishnu to defeat the demon Mura. In gratitude, Vishnu declared that anyone who fasts on Ekadashi will be freed from sins and granted his grace.",
          "From a more practical viewpoint, fasting twice a month gives the digestive system a regular reset. Modern intermittent fasting research backs up what Hindu tradition has practised for thousands of years.",
        ],
      },
      {
        heading: "How to Observe Ekadashi Vrat",
        paragraphs: [
          "The strictest form (Nirjala Ekadashi) involves no food and no water for 24 hours. The most common form (Phalahar Vrat) allows fruits, milk, and root vegetables but avoids grains and pulses. A milder form simply avoids non-vegetarian food, alcohol, and tamasic foods like onion and garlic.",
          "The fast begins at sunrise on Ekadashi and ends with parana — a small, prescribed meal taken the next morning (Dwadashi) within a specific window. Breaking the fast during the wrong window is believed to cancel the merit of the vrat.",
        ],
      },
      {
        heading: "The Most Important Ekadashis",
        paragraphs: [
          "Several Ekadashis are considered especially important. Devshayani Ekadashi (Ashadha Shukla) marks the start of Vishnu's four-month sleep. Devuthani Ekadashi (Kartik Shukla) marks his awakening and the start of Hindu wedding season. Mokshada Ekadashi (Margashirsha Shukla) is when the Bhagavad Gita was first spoken — also celebrated as Gita Jayanti.",
          "Vaikuntha Ekadashi (Margashirsha Shukla in South India) is when the gates of Vaikuntha are said to open. Nirjala Ekadashi (Jyeshtha Shukla) is the strictest fast and supposedly grants the merit of all 24 ekadashis to anyone who observes it.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can children observe Ekadashi fast?",
        answer:
          "Children, pregnant women, the elderly, and the sick are all exempt from strict fasting. They can simply avoid grains and observe the spirit of the day through prayer.",
      },
      {
        question: "What is parana?",
        answer:
          "Parana is the prescribed meal that ends the Ekadashi fast. It must be eaten on the next day (Dwadashi) within a specific muhurta window — typically after sunrise but before the Dwadashi tithi ends.",
      },
      {
        question: "Can I drink water during Ekadashi?",
        answer:
          "Yes, except in the strictest Nirjala Ekadashi. Most people drink water freely and only avoid grains and pulses on regular Ekadashis.",
      },
    ],
    relatedLinks: [
      { label: "All 24 Ekadashi Dates", href: "/ekadashi-dates" },
      { label: "Pradosh Vrat Dates", href: "/pradosh-vrat" },
      { label: "Today's Panchang", href: "/panchang-today" },
    ],
    relatedSlugs: ["pradosh-vrat-guide", "what-is-tithi", "lord-vishnu"],
  },

  {
    slug: "pradosh-vrat-guide",
    title: "Pradosh Vrat – The Bi-Monthly Fast for Lord Shiva",
    cardTitle: "Pradosh Vrat – Shiva's Sacred Fast",
    metaDescription:
      "Pradosh Vrat is a Hindu fast for Lord Shiva observed on the 13th tithi of every fortnight, during the Pradosh kala (sunset window). Learn types and benefits.",
    excerpt:
      "Pradosh Vrat is observed at sunset on the 13th tithi of each fortnight — when Lord Shiva is said to perform his cosmic dance.",
    category: "Vrat & Fasting",
    emoji: "🔱",
    gradient: "from-purple-700 via-indigo-800 to-blue-900",
    publishDate: "2026-04-26",
    readTime: 5,
    intro:
      "Pradosh Vrat is a bi-monthly Hindu fast dedicated to Lord Shiva. It is observed on the Trayodashi tithi (13th day) of every fortnight, with the main puja performed during the Pradosh Kala — the 90-minute window straddling sunset, considered Shiva's most active hour.",
    sections: [
      {
        heading: "When is Pradosh Kala?",
        paragraphs: [
          "Pradosh Kala is the period from 45 minutes before sunset to 45 minutes after sunset — about 90 minutes in total. According to the Skanda Purana, Lord Shiva performs his cosmic dance (Tandava) on Mount Kailash during this window, accompanied by all the gods. Worship offered during Pradosh is believed to be especially powerful.",
          "Because Pradosh Kala depends on local sunset, the timing changes daily and varies by city. A panchang specific to your location is the best reference.",
        ],
      },
      {
        heading: "Types of Pradosh by Day",
        paragraphs: [
          "The day of the week on which Pradosh falls gives it a special name and benefit. Soma Pradosh (Monday) is for marital harmony. Bhauma Pradosh (Tuesday) protects against debts and health issues. Saumya Pradosh (Wednesday) brings education and prosperity. Guruvara Pradosh (Thursday) blesses children and ancestors. Bhrigu Pradosh (Friday) brings happiness and luxury. Shani Pradosh (Saturday) is for sons and removal of Saturn's troubles. Bhanu Pradosh (Sunday) brings long life and good health.",
        ],
      },
      {
        heading: "How to Observe Pradosh Vrat",
        paragraphs: [
          "Wake up early, take a bath, and observe a fast through the day (most people allow fruits and milk; some observe a full nirjala fast). In the evening, take a second bath and visit a Shiva temple — or perform abhishekam at home with milk, water, honey, and curd on a Shiva linga.",
          "Recite the Mahamrityunjaya Mantra or the Shiva Tandava Stotram, light a diya, offer bilva leaves, and read the Pradosh Vrat Katha. The fast is broken after sunset puja.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can women observe Pradosh Vrat?",
        answer:
          "Yes, Pradosh Vrat is open to anyone. It is especially recommended for unmarried women seeking a good husband and for married women seeking marital harmony.",
      },
      {
        question: "How is Pradosh different from Maha Shivratri?",
        answer:
          "Pradosh is observed twice a month at sunset on the 13th tithi. Maha Shivratri is the great annual night of Shiva — celebrated all night long on the 14th tithi of Krishna Paksha in Phalguna month.",
      },
      {
        question: "What should I avoid on Pradosh day?",
        answer:
          "Avoid non-vegetarian food, alcohol, onion and garlic, and any negative actions. Maintain a calm, devotional mindset throughout the day.",
      },
    ],
    relatedLinks: [
      { label: "Pradosh Vrat Dates", href: "/pradosh-vrat" },
      { label: "Maha Shivratri", href: "/maha-shivratri" },
      { label: "Today's Panchang", href: "/panchang-today" },
    ],
    relatedSlugs: ["lord-shiva", "ekadashi-vrat-explained", "what-is-tithi"],
  },

  {
    slug: "karva-chauth-tradition",
    title: "Karwa Chauth – The Wife's Vow for Her Husband's Long Life",
    cardTitle: "Karwa Chauth – The Vow of Love",
    metaDescription:
      "Karwa Chauth is the North Indian fast where wives observe a nirjala vrat from sunrise to moonrise for their husband's long life. Ritual, story, and timings.",
    excerpt:
      "Karwa Chauth is one of the most beautifully observed Hindu vrats — a single day when love, devotion, and a 14-hour fast come together.",
    category: "Vrat & Fasting",
    emoji: "🌝",
    gradient: "from-rose-500 via-red-600 to-orange-600",
    publishDate: "2026-04-26",
    readTime: 6,
    intro:
      "Karwa Chauth (also spelled Karva Chauth) is a one-day Hindu festival observed by married women — primarily across North India — for the long life and well-being of their husbands. The vrat is famous for being a complete nirjala (waterless) fast that lasts from sunrise to moonrise — typically 13 to 14 hours.",
    sections: [
      {
        heading: "When is Karwa Chauth?",
        paragraphs: [
          "Karwa Chauth falls on the Chaturthi (4th tithi) of the Krishna Paksha (waning fortnight) of the Kartika month — usually in October or early November. The festival comes nine days before Diwali and is widely observed in Punjab, Haryana, Rajasthan, Uttar Pradesh, and across the North Indian diaspora.",
        ],
      },
      {
        heading: "The Ritual",
        paragraphs: [
          "Women rise before sunrise and eat sargi — a special pre-dawn meal traditionally prepared by the mother-in-law containing dry fruits, sweets, fresh fruits, and parathas. After sunrise, no food or water is taken until the moon rises in the evening.",
          "Through the day, women dress in their wedding finery — red or maroon clothes, gold jewellery, henna on their hands, and full bridal makeup. In the evening, they gather to listen to the Karwa Chauth Katha, perform the puja with a thali (plate) containing a diya, water, sweets, and the karwa (an earthen pot).",
          "When the moon rises, the woman views it through a sieve, then looks at her husband through the same sieve. Her husband then offers her the first sip of water and the first bite of food, breaking the fast.",
        ],
      },
      {
        heading: "The Story Behind the Fast",
        paragraphs: [
          "The most popular katha is of Queen Veervati — the only sister of seven loving brothers. Married into a wealthy family, she observed her first Karwa Chauth at her parents' home. Unable to bear seeing her hungry, her brothers tricked her by holding a lamp behind a tree, making her believe the moon had risen. She broke her fast — and immediately received news that her husband had died.",
          "Devastated, she prayed to Goddess Parvati, who taught her to observe Karwa Chauth correctly. Through her renewed devotion, her husband was restored to life. The story underscores the importance of completing the vrat properly — and the deep faith Hindu tradition places in the bond between husband and wife.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can unmarried women observe Karwa Chauth?",
        answer:
          "Traditionally, Karwa Chauth is for married women. However, in recent decades, many engaged or unmarried women observe it for their fiancé or partner — modern practice has become flexible.",
      },
      {
        question: "Do men observe Karwa Chauth?",
        answer:
          "Traditionally, no. But increasingly, husbands are observing the fast alongside their wives in solidarity — there is no scriptural prohibition against it.",
      },
      {
        question: "Why is the moon viewed through a sieve?",
        answer:
          "Several interpretations exist. The most poetic says that on this night, a woman's husband is the brightest light in her life — even brighter than the moon. Viewing the moon through the sieve, then her husband, completes the chain of devotion.",
      },
    ],
    relatedLinks: [
      { label: "Karwa Chauth Date & Moonrise Time", href: "/karwa-chauth" },
      { label: "Diwali", href: "/diwali" },
      { label: "Today's Panchang", href: "/panchang-today" },
    ],
    relatedSlugs: ["ekadashi-vrat-explained", "marriage-muhurat-explained", "goddess-lakshmi"],
  },

  // ────────────────────────────────────────────────────────────────────────
  // LIFE CEREMONIES (3)
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "marriage-muhurat-explained",
    title: "Hindu Marriage Muhurat – How Wedding Dates Are Chosen",
    cardTitle: "Hindu Marriage Muhurat Guide",
    metaDescription:
      "Hindu wedding dates (Vivaha Muhurat) are chosen using tithi, nakshatra, yoga, and Sun–Jupiter positions. Learn the full astrological framework astrologers use.",
    excerpt:
      "A Hindu wedding date is never picked at random — here is the full astrological framework that priests and astrologers use.",
    category: "Life Ceremonies",
    emoji: "💍",
    gradient: "from-pink-600 via-rose-600 to-red-700",
    publishDate: "2026-04-26",
    readTime: 7,
    intro:
      "A Hindu marriage muhurat (Vivaha Muhurat) is one of the most carefully chosen moments in Hindu life. The selection is not based on convenience or season — it is the result of layered astrological analysis intended to give the couple every cosmic blessing for a lifelong union.",
    sections: [
      {
        heading: "The Core Requirements",
        paragraphs: [
          "Five conditions must be checked before a wedding date can be considered auspicious. First, a favourable tithi — Dwitiya, Tritiya, Panchami, Saptami, Ekadashi, Trayodashi are preferred. Tithis like Chaturthi, Navami, and Chaturdashi are typically avoided.",
          "Second, a favourable nakshatra — Rohini, Mrigashira, Magha, Uttara Phalguni, Hasta, Swati, Anuradha, Mula, Uttara Ashadha, Uttara Bhadrapada, and Revati are considered most auspicious for marriage. Third, an auspicious yoga and karana. Fourth, the day of the week (vara) — Sunday, Wednesday, Thursday, and Friday are preferred; Tuesday and Saturday are usually avoided.",
        ],
      },
      {
        heading: "Sun and Jupiter Positions",
        paragraphs: [
          "Two more conditions are critical. The Sun (Surya) should not be combust or in transition between rashis (sankranti). And Jupiter (Guru) should not be in his combust or weakened state. Periods when Jupiter or Venus are combust are called Guru Asta and Shukra Asta — and no Hindu wedding is performed during these periods.",
          "The two main \"forbidden seasons\" for Hindu weddings are Chaturmas (Devshayani Ekadashi to Devuthani Ekadashi, roughly mid-July to mid-November) and Kharmas (when Sun is in Sagittarius or Pisces).",
        ],
      },
      {
        heading: "Lagna Selection",
        paragraphs: [
          "Beyond the day, the exact moment of the wedding is also chosen — the lagna (rising sign) at the time of the saat phere (seven steps) determines the strength of the muhurat. Astrologers prefer a fixed sign (Taurus, Leo, Scorpio, Aquarius) or dual sign (Gemini, Virgo, Sagittarius, Pisces) and avoid movable signs at the lagna.",
          "Within the lagna, certain hora (planetary hours) and the avoidance of Rahu Kalam, Yamagandam, and Bhadra Karana are also factored in.",
        ],
      },
      {
        heading: "Kundali Compatibility (Milan)",
        paragraphs: [
          "Before any date is chosen, the kundalis (birth charts) of the bride and groom are matched. The Ashtakoot system gives a compatibility score out of 36 — most families look for 18 or higher. Mangal Dosha (Mars affliction), Nadi dosha, and other key incompatibilities are also checked.",
          "A high compatibility score allows a wider range of muhurat options. A low score may limit options or require parihara (remedial) measures.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why are Tuesdays avoided for weddings?",
        answer:
          "Tuesday is ruled by Mars (Mangal), which represents conflict and aggression. Hindu tradition avoids it for harmonious occasions like marriage.",
      },
      {
        question: "What is Chaturmas and why are weddings not held in it?",
        answer:
          "Chaturmas is the four-month period when Lord Vishnu is said to be in cosmic sleep. Without his blessing, weddings (and other auspicious work) are postponed until Devuthani Ekadashi when he awakens.",
      },
      {
        question: "How early should a wedding muhurat be chosen?",
        answer:
          "Most families consult an astrologer 3–6 months before the wedding to get a list of options. For specific months, longer planning is often needed.",
      },
    ],
    relatedLinks: [
      { label: "Marriage Muhurat Dates", href: "/marriage-muhurat" },
      { label: "Free Kundali Milan", href: "/kundali-milan" },
      { label: "Free Kundali Calculator", href: "/kundali" },
    ],
    relatedSlugs: ["the-27-nakshatras", "namakaran-ceremony", "griha-pravesh-guide"],
  },

  {
    slug: "namakaran-ceremony",
    title: "Namakaran – The Hindu Naming Ceremony for a Newborn",
    cardTitle: "Namakaran – Naming Ceremony Guide",
    metaDescription:
      "Namakaran is the Hindu naming ceremony performed on the 11th or 12th day after birth. Learn the rituals, name selection by nakshatra, and modern practices.",
    excerpt:
      "Namakaran is the second of the 16 samskaras — the moment a Hindu child is given the name they will carry into life.",
    category: "Life Ceremonies",
    emoji: "👶",
    gradient: "from-amber-300 via-orange-400 to-pink-500",
    publishDate: "2026-04-26",
    readTime: 6,
    intro:
      "Namakaran is the Hindu naming ceremony — the second of the 16 samskaras (sacraments) that mark the milestones of a Hindu life. It is traditionally performed on the 11th or 12th day after a child's birth, when the family welcomes the newborn into the community by formally giving them a name.",
    sections: [
      {
        heading: "When is Namakaran Performed?",
        paragraphs: [
          "The most common day for Namakaran is the 11th day (ekadasha) after birth, after the mother and child have completed the period of ritual seclusion (sutaka). Some families choose the 12th day, the 16th day, or the 100th day, depending on regional tradition.",
          "The ceremony is held during an auspicious muhurta — avoiding Rahu Kalam, Yamagandam, and inauspicious tithis like Chaturthi and Chaturdashi. A priest (or family elder) consults the panchang to identify the best window.",
        ],
      },
      {
        heading: "Choosing the Name",
        paragraphs: [
          "Hindu names traditionally have four layers. First, the Naamakshar — the auspicious starting syllable derived from the child's Janma Nakshatra and Pada (quarter). Second, the family's chosen given name. Third, sometimes a family deity name (Ishta-devata). Fourth, the family or gotra name.",
          "The starting syllable is identified from a fixed chart — for example, a child born under Ashwini's first pada gets a name beginning with \"Chu\", second pada with \"Che\", third with \"Cho\", and fourth with \"La\". Each of the 27 nakshatras × 4 padas gives 108 syllables, which is why Hindu name selection is uniquely tied to astrology.",
        ],
      },
      {
        heading: "The Ritual",
        paragraphs: [
          "On the morning of the ceremony, the home is cleaned, decorated, and a sacred fire (havan) is lit. The priest invokes the family deities and Lord Ganesha. The father (or grandfather) then whispers the chosen name into the baby's right ear — three times — followed by a verse from the Vedas blessing the child with a long, healthy life.",
          "After the formal naming, family members hold the baby and bless them. Sweets are distributed. In modern Indian and diaspora households, the ceremony has often become a small family gathering rather than a full ritual — but the core element of whispering the name remains.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can the name be different from the Nakshatra syllable?",
        answer:
          "Yes. Many families choose two names — a Nakshatra-based name used for religious purposes (called Rashi naam) and a different everyday name. Both are valid in Hindu tradition.",
      },
      {
        question: "Who performs the Namakaran ceremony?",
        answer:
          "Traditionally a family priest (purohit). In modern households, a senior family member often performs it. The key element — whispering the name into the baby's ear — can be done by the father or grandfather.",
      },
      {
        question: "Is Namakaran needed for the legal birth certificate?",
        answer:
          "No, the legal birth certificate is a separate document. Namakaran is purely a religious-cultural ceremony. Many parents register the legal name within a week of birth and perform Namakaran later.",
      },
    ],
    relatedLinks: [
      { label: "Baby Names by Nakshatra", href: "/baby-names-by-nakshatra" },
      { label: "Free Kundali Calculator", href: "/kundali" },
      { label: "Today's Panchang", href: "/panchang-today" },
    ],
    relatedSlugs: ["the-27-nakshatras", "marriage-muhurat-explained", "griha-pravesh-guide"],
  },

  {
    slug: "griha-pravesh-guide",
    title: "Griha Pravesh – The Hindu Housewarming Ceremony",
    cardTitle: "Griha Pravesh – Housewarming Guide",
    metaDescription:
      "Griha Pravesh is the Hindu housewarming puja performed before entering a new home. Learn the three types, auspicious months, ritual sequence, and kalash entry.",
    excerpt:
      "Before any Hindu family moves into a new home, a Griha Pravesh puja invites the gods to enter first.",
    category: "Life Ceremonies",
    emoji: "🏠",
    gradient: "from-yellow-400 via-amber-500 to-orange-600",
    publishDate: "2026-04-26",
    readTime: 6,
    intro:
      "Griha Pravesh is the Hindu housewarming ceremony — a puja performed before a family enters a new home for the first time. The ceremony is meant to invite divine blessings into the dwelling, neutralise any negative energies (vastu doshas) from the construction, and ensure prosperity for everyone who lives there.",
    sections: [
      {
        heading: "The Three Types of Griha Pravesh",
        paragraphs: [
          "Hindu tradition recognises three types of Griha Pravesh, each with a slightly different ritual. Apoorva Griha Pravesh is the entry into a brand-new home for the first time — the most elaborate ritual. Sapoorva Griha Pravesh is performed when returning to a home after a long absence (usually one or more years away). Dwandwa Griha Pravesh is performed when re-entering a home after major repairs, fire damage, or significant renovation.",
        ],
      },
      {
        heading: "Choosing the Muhurat",
        paragraphs: [
          "The most auspicious months for Griha Pravesh are Vaishakh (April–May), Jyeshtha (May–June), Magha (Jan–Feb), and Phalguna (Feb–March). The months of Ashadha (June–July), Bhadrapada (Aug–Sep), Ashwin (Sep–Oct), and Pausha (Dec–Jan) are typically avoided.",
          "Within an auspicious month, the muhurat is chosen by checking tithi (Dwitiya, Tritiya, Panchami, Saptami, Dashami, Ekadashi, Trayodashi preferred), nakshatra (Rohini, Mrigashira, Pushya, Anuradha, Uttara Phalguni, Uttara Ashadha, Uttara Bhadrapada, Revati preferred), and avoiding Rahu Kalam, Yamagandam, and Eclipse periods.",
        ],
      },
      {
        heading: "The Ritual Sequence",
        paragraphs: [
          "The ceremony begins with Ganesh Puja and a Kalash Sthapana (consecrated water pot) at the entrance. The family enters the home together, with the wife traditionally carrying the kalash and stepping in with her right foot first. Milk is boiled in the new kitchen until it overflows — symbolising abundance overflowing in the family's life.",
          "A Vastu Shanti puja is then performed to honour the directional deities and the spirit of the land (Vastu Purusha). Havan (sacred fire ritual) is lit, mantras are chanted, and offerings are made. The ceremony usually concludes with a meal served to family, friends, and the priest — reinforcing the home as a place of welcome.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I move into a new home before Griha Pravesh?",
        answer:
          "Traditionally, no — the home should not be slept in until the puja is performed. If urgent occupancy is needed, a Pravesh-Mukti (entry-exemption) puja can be done by the priest.",
      },
      {
        question: "What if I am moving into a rented home?",
        answer:
          "A simpler version of Griha Pravesh can be performed for rented homes. Many families just do a small Ganesh puja and Kalash Sthapana on the first day of moving in.",
      },
      {
        question: "Why is milk boiled and allowed to overflow?",
        answer:
          "Overflowing milk symbolises overflowing abundance — the wish that the home will always have more than enough food, prosperity, and joy for everyone who lives there.",
      },
    ],
    relatedLinks: [
      { label: "Today's Panchang", href: "/panchang-today" },
      { label: "Marriage Muhurat", href: "/marriage-muhurat" },
      { label: "Today's Choghadiya", href: "/choghadiya-today" },
    ],
    relatedSlugs: ["marriage-muhurat-explained", "namakaran-ceremony", "lord-ganesha"],
  },

  // ────────────────────────────────────────────────────────────────────────
  // HINDU CULTURE (2)
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "the-four-yugas",
    title: "The Four Yugas – Hindu Cosmic Cycle of Time",
    cardTitle: "The Four Yugas of Hindu Time",
    metaDescription:
      "Hindu cosmology divides time into four ages — Satya, Treta, Dwapara, and Kali Yuga. Learn the duration, characteristics, and meaning of each cosmic yuga.",
    excerpt:
      "Hindu time is not a straight line — it is a great wheel. Here is how the four ages of cosmic existence cycle through eternity.",
    category: "Hindu Culture",
    emoji: "⏳",
    gradient: "from-emerald-700 via-teal-700 to-cyan-800",
    publishDate: "2026-04-26",
    readTime: 7,
    intro:
      "Hindu cosmology offers one of the most expansive views of time in any tradition. While most cultures conceive of time as linear — a beginning, a middle, an end — Hinduism sees time as cyclical: a wheel that rotates through four ages (yugas), repeating endlessly across vast cosmic spans.",
    sections: [
      {
        heading: "The Yuga System",
        paragraphs: [
          "One Mahayuga (great age) is made up of four yugas: Satya Yuga (1,728,000 years), Treta Yuga (1,296,000 years), Dwapara Yuga (864,000 years), and Kali Yuga (432,000 years). Together, one Mahayuga lasts 4,320,000 human years.",
          "1,000 Mahayugas equal one Kalpa — a single \"day\" of Brahma the creator, lasting 4.32 billion years. After each Kalpa, the universe is dissolved and recreated. Modern science estimates the universe is about 13.8 billion years old — Hindu cosmology has been comfortable with timescales of this magnitude for thousands of years.",
        ],
      },
      {
        heading: "Satya Yuga – The Age of Truth",
        paragraphs: [
          "In Satya Yuga (also called Krita Yuga), dharma stands on all four legs. Humans live in perfect harmony, enjoy long lives (up to 100,000 years), are honest, free of disease, and need no laws or rulers to govern them. Knowledge is direct — meditation alone is sufficient to attain liberation. This is described as a golden age.",
        ],
      },
      {
        heading: "Treta Yuga – The Age of Three Quarters",
        paragraphs: [
          "In Treta Yuga, dharma stands on three legs — one quarter has been lost. Humans live for 10,000 years, kingdoms appear, and rituals (yajna) become the primary spiritual path. Lord Rama incarnated in Treta Yuga, and the Ramayana is the great epic of this age.",
        ],
      },
      {
        heading: "Dwapara Yuga – The Age of Half",
        paragraphs: [
          "In Dwapara Yuga, dharma stands on only two legs. Humans live for 1,000 years, scriptures begin to be divided and written down (Vyasa is said to have compiled the four Vedas at the start of this age), and worship through temple rituals (puja) becomes the dominant path. Lord Krishna lived in Dwapara Yuga, and the Mahabharata war is said to have ended at its conclusion.",
        ],
      },
      {
        heading: "Kali Yuga – The Age of Quarrel",
        paragraphs: [
          "Kali Yuga began approximately 5,000 years ago (3102 BCE according to traditional reckoning) and is the age in which we now live. Dharma stands on only one leg — truth, compassion, austerity, and purity have all greatly diminished. Lifespans shrink to about 100 years, and the spiritual path of this age is bhakti — devotion to a personal form of God — and chanting of the divine names.",
          "Kali Yuga is said to be the most difficult age but also the most accessible — even small acts of devotion are believed to bring great spiritual rewards because the cosmic environment is so dense with adharma.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are we currently in Kali Yuga?",
        answer:
          "Yes, according to traditional Hindu reckoning. Kali Yuga began at midnight on February 18, 3102 BCE — making us roughly 5,127 years into the 432,000-year age.",
      },
      {
        question: "Will Kali Yuga end?",
        answer:
          "Yes. At the end of Kali Yuga, Lord Vishnu is said to incarnate as Kalki — the tenth and final avatar — to destroy the forces of adharma and usher in the next Satya Yuga. The cycle then repeats.",
      },
      {
        question: "How long until Satya Yuga returns?",
        answer:
          "About 426,873 more years, by traditional Hindu reckoning. The cosmic timescale of Hinduism is meant to humble human ego — our individual lives are short within an enormous cycle.",
      },
    ],
    relatedLinks: [
      { label: "Lord Vishnu & the 10 Avatars", href: "/blog/lord-vishnu" },
      { label: "Lord Krishna", href: "/blog/lord-krishna" },
      { label: "Significance of Om", href: "/blog/significance-of-om" },
    ],
    relatedSlugs: ["lord-vishnu", "lord-krishna", "significance-of-om"],
  },

  {
    slug: "significance-of-om",
    title: "The Significance of Om (Aum) – Hinduism's Primordial Sound",
    cardTitle: "The Significance of Om (Aum)",
    metaDescription:
      "Om (Aum) is the most sacred sound in Hinduism, representing the entire universe in three syllables. Learn its meaning, the three sounds, and how to chant it.",
    excerpt:
      "Hindus call Om the sound from which the universe was born. Three letters, three states, three worlds — and one infinite vibration.",
    category: "Hindu Culture",
    emoji: "🕉️",
    gradient: "from-orange-600 via-amber-600 to-yellow-600",
    publishDate: "2026-04-26",
    readTime: 6,
    intro:
      "Om — also written as Aum or Auṃ — is the most sacred sound in Hinduism. The Mandukya Upanishad declares that everything that exists, has existed, or will exist is the syllable Om. To chant it is to vibrate the universe; to understand it is to understand reality itself.",
    sections: [
      {
        heading: "The Three Sounds in One",
        paragraphs: [
          "Om is composed of three sounds — A, U, and M. The 'A' begins from the back of the throat, with mouth open. The 'U' rolls forward as the lips round. The 'M' completes the sound at the closed lips, vibrating the entire face.",
          "These three sounds together cover the full range of human vocal expression — from the deepest origin of speech to its complete closure. The Upanishads say this represents the totality of all sound, all language, and all manifestation.",
        ],
      },
      {
        heading: "What the Three Sounds Represent",
        paragraphs: [
          "Each syllable carries multiple layers of meaning. A represents the waking state (jagrat), the conscious mind, and Lord Brahma the creator. U represents the dream state (svapna), the subconscious mind, and Lord Vishnu the preserver. M represents the deep sleep state (sushupti), the unconscious mind, and Lord Shiva the dissolver.",
          "After the M, there is a fourth element — the silence that follows. This silence (turiya) represents the transcendent fourth state of consciousness — the pure awareness that underlies waking, dreaming, and deep sleep. This silence is considered the most important part of the chant.",
        ],
      },
      {
        heading: "Om in Daily Practice",
        paragraphs: [
          "Almost every Hindu mantra begins with Om — the Gayatri Mantra, Om Namah Shivaya, Om Mani Padme Hum, the Maha Mrityunjaya Mantra. Chanting Om at the start of any prayer is believed to align the practitioner with the cosmic vibration, removing any disturbance in the mind.",
          "Even in non-religious meditation traditions today, Om is used as a centring sound. Modern neuroscience studies have shown that Om chanting reduces activity in the amygdala (the brain's fear centre) and increases activity in regions associated with calm focus.",
        ],
      },
      {
        heading: "How to Chant Om Correctly",
        paragraphs: [
          "Sit upright, eyes closed, in a quiet place. Take a slow breath in. As you exhale, begin the 'A' from the back of the throat, then move through 'U' as the lips round, and finish with a long 'M' as the lips close — the M should last about half the total length of the chant.",
          "After the M, hold a few seconds of complete silence — the most important part. Then take another breath and repeat. Eleven repetitions (one rosary section) is a traditional starting point.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is Om only Hindu?",
        answer:
          "Om originated in Hinduism but is also revered in Buddhism, Jainism, and Sikhism. The opening line of the Sikh scripture begins with \"Ik Onkar\" (One Om), and the famous Buddhist mantra is \"Om Mani Padme Hum\".",
      },
      {
        question: "Should Om be written as Om or Aum?",
        answer:
          "Both are correct. Om reflects the everyday pronunciation. Aum reflects the original Sanskrit phonetic structure of three sounds. The traditional symbol 🕉️ visually represents all three sounds and the silence.",
      },
      {
        question: "Can non-Hindus chant Om?",
        answer:
          "Yes. Om is considered universal — it is a sound, not a religion-specific phrase. People of all backgrounds chant it for meditation, calm, and focus.",
      },
    ],
    relatedLinks: [
      { label: "Brahma Muhurta – Best Time to Chant", href: "/brahma-muhurta" },
      { label: "Lord Shiva", href: "/blog/lord-shiva" },
      { label: "The Four Yugas", href: "/blog/the-four-yugas" },
    ],
    relatedSlugs: ["brahma-muhurta", "lord-shiva", "the-four-yugas"],
  },
];

export const BLOG_CATEGORIES: { name: BlogArticle["category"]; description: string; emoji: string }[] = [
  { name: "Deities", description: "Hindu gods and goddesses, their stories and worship", emoji: "🪔" },
  { name: "Panchang Concepts", description: "Tithi, nakshatra, muhurta and the Vedic timekeeping system", emoji: "📅" },
  { name: "Vrat & Fasting", description: "Hindu fasts, their meaning, and how to observe them", emoji: "🌙" },
  { name: "Life Ceremonies", description: "Hindu samskaras — from naming to marriage to housewarming", emoji: "🪷" },
  { name: "Hindu Culture", description: "Time, sound, philosophy and the broader Hindu worldview", emoji: "🕉️" },
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find(a => a.slug === slug);
}

export function getRelatedArticles(article: BlogArticle): BlogArticle[] {
  return article.relatedSlugs
    .map(slug => BLOG_ARTICLES.find(a => a.slug === slug))
    .filter((a): a is BlogArticle => Boolean(a));
}

export function getArticlesByCategory(category: BlogArticle["category"]): BlogArticle[] {
  return BLOG_ARTICLES.filter(a => a.category === category);
}

export const BLOG_SLUGS = new Set(BLOG_ARTICLES.map(a => a.slug));
