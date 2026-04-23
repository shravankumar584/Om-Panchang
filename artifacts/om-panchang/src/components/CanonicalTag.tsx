import { useEffect } from "react";
import { getCanonicalUrl } from "@/lib/canonical";

export default function CanonicalTag() {
  useEffect(() => {
    const href = getCanonicalUrl(window.location.pathname);
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = href;
  }, []);

  return null;
}
