interface Props {
  variant?: "sidebar" | "inline";
  context?: string; // e.g. "Diwali" — for contextual CTA on festival pages
}

const MAPS_URL = "https://www.google.com/maps/search/Hindu+temple+near+me/";

export default function FindTempleCard({ variant = "sidebar", context }: Props) {
  if (variant === "inline") {
    return (
      <section className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 rounded-2xl border-2 border-amber-200 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="text-4xl flex-shrink-0">🛕</div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-indigo-900 mb-1">
              {context
                ? `Celebrating ${context}? Find a Temple Near You`
                : "Find a Hindu Temple Near You"}
            </h2>
            <p className="text-slate-700 text-sm mb-4">
              Discover Hindu temples in your area on Google Maps — see photos, opening hours, reviews, and get directions.
            </p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
              </svg>
              Open Google Maps →
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm card-glow border border-amber-200 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 flex items-center gap-2">
        <span className="text-xl">🛕</span>
        <div>
          <p className="text-white font-bold text-sm">Find a Temple</p>
          <p className="text-amber-100 text-xs">Hindu temples near you</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-slate-600 mb-3">
          Discover nearby temples on Google Maps with photos, reviews, hours & directions.
        </p>
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
          </svg>
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}
