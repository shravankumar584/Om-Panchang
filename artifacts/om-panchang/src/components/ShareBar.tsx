import { FaWhatsapp, FaFacebookF, FaLink } from "react-icons/fa";
import { toast } from "sonner";

interface ShareBarProps {
  title: string;
  url?: string;
  summary?: string;
}

export default function ShareBar({ title, url, summary }: ShareBarProps) {
  // Use provided URL, or fall back to current URL. 
  // Note: Facebook requires a public, non-localhost URL to show a preview.
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareTitle = title;
  
  const handleWhatsAppShare = () => {
    // WhatsApp supports pre-filling the full message
    const text = `${shareTitle}${summary ? `\n\n${summary}` : ""}\n\nCheck full details here: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleFacebookShare = () => {
    // Facebook sharer ONLY accepts the 'u' (URL) parameter. 
    // It will automatically pull the Title, Image, and Summary from your site's <meta> tags.
    // Pre-filling text is not allowed by Facebook's policy.
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="mt-4 bg-white rounded-2xl shadow-sm card-glow border border-indigo-100 overflow-hidden no-print">
      <div className="px-5 py-3 border-b border-indigo-50 bg-indigo-50/30 flex items-center justify-between">
        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
          Spread the Wisdom
        </p>
      </div>
      <div className="p-3 flex flex-wrap gap-2">
        <button
          onClick={handleWhatsAppShare}
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5c] text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
        >
          <FaWhatsapp className="text-lg" />
          WhatsApp
        </button>
        <button
          onClick={handleFacebookShare}
          className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
        >
          <FaFacebookF className="text-lg" />
          Facebook
        </button>
        <button
          onClick={handleCopyLink}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors border border-slate-200"
        >
          <FaLink className="text-lg" />
          Copy
        </button>
      </div>
    </div>
  );
}
