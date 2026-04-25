import { useEffect, useState } from "react";
import { unsubscribe } from "@workspace/api-client-react";

type Status = "loading" | "ok" | "error";

export default function UnsubscribePage() {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("Processing your request...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Missing unsubscribe token in the link.");
      return;
    }

    unsubscribe({ token })
      .then((data) => {
        setStatus("ok");
        setMessage(data.message || "You have been unsubscribed.");
      })
      .catch((err: unknown) => {
        const apiMsg =
          (err as { data?: { error?: string } } | null)?.data?.error ?? null;
        setStatus("error");
        setMessage(apiMsg || "Could not unsubscribe. The link may be invalid or expired.");
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #f0f0ff 0%, #e8e8f8 50%, #f5f0ff 100%)" }}>
      <div className="bg-white rounded-2xl shadow-md border border-indigo-100 max-w-md w-full p-8 text-center">
        <div className="text-5xl mb-4">
          {status === "ok" ? "✅" : status === "error" ? "⚠️" : "⏳"}
        </div>
        <h1 className="text-2xl font-bold text-indigo-900 mb-2">
          {status === "ok" ? "Unsubscribed" : status === "error" ? "Unsubscribe Failed" : "Please wait"}
        </h1>
        <p className="text-slate-700 mb-6">{message}</p>
        <a href="/" className="inline-block bg-indigo-700 hover:bg-indigo-800 text-white font-semibold px-5 py-2.5 rounded-xl">
          Return to Om Panchang
        </a>
      </div>
    </div>
  );
}
