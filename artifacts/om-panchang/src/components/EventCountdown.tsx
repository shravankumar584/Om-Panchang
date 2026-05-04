import React, { useState, useEffect } from "react";
import { FESTIVALS, getNextOccurrence } from "@/lib/festivalsData";

export default function EventCountdown() {
  const [nextEvent, setNextEvent] = useState<{
    name: string;
    date: Date;
    slug: string;
    emoji: string;
  } | null>(null);

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    // Find the absolute next major festival from today
    const now = new Date();
    
    const upcoming = FESTIVALS
      .filter(f => f.category === "major")
      .map(f => {
        const occurrence = getNextOccurrence(f, now);
        return {
          name: f.name,
          date: occurrence ? new Date(occurrence.date + "T00:00:00") : null,
          slug: f.slug,
          emoji: f.emoji || "🕉️"
        };
      })
      .filter(f => f.date && f.date > now)
      .sort((a, b) => a.date!.getTime() - b.date!.getTime());

    if (upcoming.length > 0) {
      setNextEvent(upcoming[0] as any);
    }
  }, []);

  useEffect(() => {
    if (!nextEvent) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = nextEvent.date.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft(null);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextEvent]);

  if (!nextEvent || !timeLeft) return null;

  function navigateTo(href: string) {
    window.history.pushState({}, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <div className="bg-indigo-900 text-white rounded-2xl p-5 shadow-lg border border-indigo-700/50 mb-4 overflow-hidden relative group cursor-pointer"
         onClick={() => navigateTo(`/${nextEvent.slug}`)}>
      {/* Decorative background circle */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
      
      <div className="relative flex flex-col items-center text-center">
        <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em] mb-2">
          Next Major Festival
        </p>
        
        <h3 className="text-xl font-extrabold mb-4 flex items-center gap-2">
          <span className="text-2xl">{nextEvent.emoji}</span>
          {nextEvent.name}
        </h3>

        <div className="flex gap-3">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hrs", value: timeLeft.hours },
            { label: "Min", value: timeLeft.minutes },
            { label: "Sec", value: timeLeft.seconds },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg w-12 h-12 flex items-center justify-center border border-white/10 mb-1">
                <span className="text-lg font-bold tabular-nums">
                  {item.value.toString().padStart(2, "0")}
                </span>
              </div>
              <span className="text-[9px] uppercase font-bold text-indigo-300 tracking-wider">
                {item.label}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-indigo-400 group-hover:text-white transition-colors uppercase tracking-widest">
          View Details <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </div>
  );
}
