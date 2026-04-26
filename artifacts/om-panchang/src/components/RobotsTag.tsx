import { useEffect } from "react";

interface Props {
  noindex: boolean;
}

export default function RobotsTag({ noindex }: Props) {
  useEffect(() => {
    let meta = document.querySelector(
      'meta[name="robots"]',
    ) as HTMLMetaElement | null;
    if (noindex) {
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "robots";
        document.head.appendChild(meta);
      }
      meta.content = "noindex, follow";
    } else if (meta) {
      meta.remove();
    }
  }, [noindex]);
  return null;
}
