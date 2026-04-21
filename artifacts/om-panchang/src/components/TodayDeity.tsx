interface DeityInfo {
  name: string;
  sanskrit: string;
  blessing: string;
  image: string;
  color: string;
}

const DEITIES: DeityInfo[] = [
  { name: "Surya",   sanskrit: "सूर्य",  blessing: "Vitality, health and self-confidence",        image: "/deities/sunday-surya.png",      color: "from-amber-50 to-orange-50" },
  { name: "Shiva",   sanskrit: "शिव",    blessing: "Inner peace, transformation and liberation",  image: "/deities/monday-shiva.png",      color: "from-indigo-50 to-blue-50" },
  { name: "Hanuman", sanskrit: "हनुमान्", blessing: "Courage, strength and devotion",              image: "/deities/tuesday-hanuman.png",   color: "from-rose-50 to-orange-50" },
  { name: "Ganesha", sanskrit: "गणेश",   blessing: "Removal of obstacles, wisdom and new beginnings", image: "/deities/wednesday-ganesha.png", color: "from-amber-50 to-yellow-50" },
  { name: "Vishnu",  sanskrit: "विष्णु",  blessing: "Preservation, prosperity and dharma",         image: "/deities/thursday-vishnu.png",   color: "from-sky-50 to-indigo-50" },
  { name: "Lakshmi", sanskrit: "लक्ष्मी",  blessing: "Wealth, abundance and good fortune",          image: "/deities/friday-lakshmi.png",    color: "from-pink-50 to-rose-50" },
  { name: "Shani",   sanskrit: "शनि",    blessing: "Discipline, justice and karmic balance",      image: "/deities/saturday-shani.png",    color: "from-slate-50 to-indigo-50" },
];

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface Props {
  date: Date;
}

export default function TodayDeity({ date }: Props) {
  const dow = date.getDay();
  const deity = DEITIES[dow];
  const weekdayName = WEEKDAYS[dow];
  const isToday = (() => {
    const t = new Date(); t.setHours(0,0,0,0);
    const d = new Date(date); d.setHours(0,0,0,0);
    return t.getTime() === d.getTime();
  })();

  return (
    <div className={`bg-gradient-to-br ${deity.color} rounded-2xl shadow-sm card-glow border border-amber-100 overflow-hidden`}>
      <div className="px-5 py-3 bg-white/40 border-b border-amber-100/60">
        <p className="text-[10px] uppercase tracking-widest font-bold text-amber-700">
          {isToday ? "Today's Presiding Deity" : `${weekdayName}'s Deity`}
        </p>
      </div>
      <div className="px-5 py-4 flex items-center gap-4">
        <img
          src={deity.image}
          alt={`Lord ${deity.name}, presiding deity of ${weekdayName}`}
          loading="lazy"
          className="w-20 h-24 object-cover rounded-xl border-2 border-amber-200 shadow-sm flex-shrink-0 no-invert"
        />
        <div className="min-w-0">
          <p className="text-xs text-slate-500 font-medium leading-tight">{deity.sanskrit}</p>
          <p className="text-lg font-bold text-indigo-900 leading-tight mt-0.5">{deity.name}</p>
          <p className="text-xs text-slate-600 leading-snug mt-1.5">{deity.blessing}</p>
        </div>
      </div>
    </div>
  );
}
