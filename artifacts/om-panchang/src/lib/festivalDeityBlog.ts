// Maps a festival (by name keyword) → its related deity blog article.
// Used to cross-link festivals to long-form deity content for SEO and reader value.
// Entries are checked in order — put more specific keywords above broader ones.

import { BLOG_ARTICLES } from "./blogData";

export interface DeityBlogLink {
  slug: string;       // deity blog article slug (must exist in BLOG_ARTICLES)
  deityName: string;  // human-readable deity name shown in the link label
}

interface DeityBlogMapping extends DeityBlogLink {
  match: string;      // case-sensitive substring matched against the festival name
}

const FESTIVAL_DEITY_BLOG_MAP: DeityBlogMapping[] = [
  // Krishna
  { match: "Janmashtami", slug: "lord-krishna", deityName: "Lord Krishna" },
  { match: "Krishna Jayanti", slug: "lord-krishna", deityName: "Lord Krishna" },
  { match: "Gokulashtami", slug: "lord-krishna", deityName: "Lord Krishna" },
  { match: "Radhashtami", slug: "lord-krishna", deityName: "Lord Krishna" },
  { match: "Holika", slug: "lord-krishna", deityName: "Lord Krishna" },
  { match: "Holi", slug: "lord-krishna", deityName: "Lord Krishna" },

  // Rama
  { match: "Ram Navami", slug: "lord-rama", deityName: "Lord Rama" },
  { match: "Rama Navami", slug: "lord-rama", deityName: "Lord Rama" },
  { match: "Dussehra", slug: "lord-rama", deityName: "Lord Rama" },
  { match: "Vijayadashami", slug: "lord-rama", deityName: "Lord Rama" },
  { match: "Dasara", slug: "lord-rama", deityName: "Lord Rama" },

  // Shiva
  { match: "Maha Shivratri", slug: "lord-shiva", deityName: "Lord Shiva" },
  { match: "Maha Shivaratri", slug: "lord-shiva", deityName: "Lord Shiva" },
  { match: "Shivratri", slug: "lord-shiva", deityName: "Lord Shiva" },
  { match: "Shivaratri", slug: "lord-shiva", deityName: "Lord Shiva" },
  { match: "Pradosh", slug: "lord-shiva", deityName: "Lord Shiva" },
  { match: "Karwa Chauth", slug: "lord-shiva", deityName: "Lord Shiva" },
  { match: "Karva Chauth", slug: "lord-shiva", deityName: "Lord Shiva" },

  // Ganesha
  { match: "Ganesh Chaturthi", slug: "lord-ganesha", deityName: "Lord Ganesha" },
  { match: "Vinayaka Chaturthi", slug: "lord-ganesha", deityName: "Lord Ganesha" },
  { match: "Sankashti", slug: "lord-ganesha", deityName: "Lord Ganesha" },

  // Hanuman
  { match: "Hanuman Jayanti", slug: "lord-hanuman", deityName: "Lord Hanuman" },

  // Surya
  { match: "Chhath", slug: "lord-surya", deityName: "Lord Surya" },
  { match: "Makar Sankranti", slug: "lord-surya", deityName: "Lord Surya" },
  { match: "Pongal", slug: "lord-surya", deityName: "Lord Surya" },
  { match: "Ratha Saptami", slug: "lord-surya", deityName: "Lord Surya" },
  { match: "Surya", slug: "lord-surya", deityName: "Lord Surya" },

  // Durga / Devi
  { match: "Navratri", slug: "goddess-durga", deityName: "Goddess Durga" },
  { match: "Durga Puja", slug: "goddess-durga", deityName: "Goddess Durga" },
  { match: "Durga", slug: "goddess-durga", deityName: "Goddess Durga" },

  // Lakshmi
  { match: "Diwali", slug: "goddess-lakshmi", deityName: "Goddess Lakshmi" },
  { match: "Deepavali", slug: "goddess-lakshmi", deityName: "Goddess Lakshmi" },
  { match: "Dhanteras", slug: "goddess-lakshmi", deityName: "Goddess Lakshmi" },
  { match: "Lakshmi Puja", slug: "goddess-lakshmi", deityName: "Goddess Lakshmi" },
  { match: "Akshaya Tritiya", slug: "goddess-lakshmi", deityName: "Goddess Lakshmi" },
  { match: "Varalakshmi", slug: "goddess-lakshmi", deityName: "Goddess Lakshmi" },

  // Saraswati
  { match: "Vasant Panchami", slug: "goddess-saraswati", deityName: "Goddess Saraswati" },
  { match: "Basant Panchami", slug: "goddess-saraswati", deityName: "Goddess Saraswati" },
  { match: "Saraswati Puja", slug: "goddess-saraswati", deityName: "Goddess Saraswati" },

  // Vishnu (covers Ekadashi vrats and Vishnu-specific days)
  { match: "Vaikuntha Ekadashi", slug: "lord-vishnu", deityName: "Lord Vishnu" },
  { match: "Ekadashi", slug: "lord-vishnu", deityName: "Lord Vishnu" },
  { match: "Vishnu", slug: "lord-vishnu", deityName: "Lord Vishnu" },

  // Brahma
  { match: "Ugadi", slug: "lord-brahma", deityName: "Lord Brahma" },
  { match: "Gudi Padwa", slug: "lord-brahma", deityName: "Lord Brahma" },

  // Kartikeya / Murugan
  { match: "Skanda", slug: "lord-kartikeya", deityName: "Lord Kartikeya" },
  { match: "Thaipusam", slug: "lord-kartikeya", deityName: "Lord Kartikeya" },
  { match: "Murugan", slug: "lord-kartikeya", deityName: "Lord Kartikeya" },
];

const VALID_DEITY_BLOG_SLUGS = new Set(BLOG_ARTICLES.map(a => a.slug));

/**
 * Returns the related deity blog (slug + display name) for a festival name,
 * or null when no clear deity article exists for that festival.
 * The slug is guaranteed to exist in BLOG_ARTICLES.
 */
export function getDeityBlogForFestival(festivalName: string): DeityBlogLink | null {
  for (const m of FESTIVAL_DEITY_BLOG_MAP) {
    if (festivalName.includes(m.match) && VALID_DEITY_BLOG_SLUGS.has(m.slug)) {
      return { slug: m.slug, deityName: m.deityName };
    }
  }
  return null;
}

/**
 * SPA navigation helper — pushes state and dispatches popstate so App.tsx
 * re-detects the route without a full page reload.
 */
export function navigateToDeityBlog(slug: string) {
  window.history.pushState({}, "", `/blog/${slug}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "instant" });
}
