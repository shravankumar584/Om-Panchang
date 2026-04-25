import { useState } from "react";
import { useSubscribe } from "@workspace/api-client-react";

interface Props {
  variant?: "sidebar" | "inline";
}

export default function SubscribeCard({ variant = "sidebar" }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  const subscribe = useSubscribe({
    mutation: {
      onSuccess: (data) => {
        setStatus("ok");
        setMessage(data.message || "Subscribed.");
        setEmail("");
      },
      onError: () => {
        setStatus("error");
        setMessage("Could not subscribe. Please check your email and try again.");
      },
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("idle");
    setMessage("");
    subscribe.mutate({ data: { email: trimmed } });
  }

  if (variant === "inline") {
    return (
      <section className="bg-gradient-to-r from-indigo-50 via-violet-50 to-rose-50 rounded-2xl border-2 border-indigo-200 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="text-4xl flex-shrink-0">📬</div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-indigo-900 mb-1">
              Get Weekly Panchang in Your Inbox
            </h2>
            <p className="text-slate-700 text-sm mb-4">
              Tithi, nakshatra, festivals & muhurat highlights — one short email every week. Free. Unsubscribe anytime.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 px-4 py-2.5 rounded-xl border border-indigo-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={subscribe.isPending}
                className="bg-indigo-700 hover:bg-indigo-800 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition"
              >
                {subscribe.isPending ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            {status === "ok" && (
              <p className="text-sm text-green-700 mt-2">{message}</p>
            )}
            {status === "error" && (
              <p className="text-sm text-rose-700 mt-2">{message}</p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm card-glow border border-indigo-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 flex items-center gap-2">
        <span className="text-xl">📬</span>
        <div>
          <p className="text-white font-bold text-sm">Weekly Panchang Email</p>
          <p className="text-indigo-100 text-xs">Tithi, festivals & muhurat</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-slate-600 mb-3">
          One short email every week. Free. Unsubscribe anytime.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Email address"
          />
          <button
            type="submit"
            disabled={subscribe.isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition"
          >
            {subscribe.isPending ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
        {status === "ok" && (
          <p className="text-xs text-green-700 mt-2">{message}</p>
        )}
        {status === "error" && (
          <p className="text-xs text-rose-700 mt-2">{message}</p>
        )}
      </div>
    </div>
  );
}
