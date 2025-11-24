import { baseUrl } from "@/constants";
import { useEffect, useState } from "react";

export function useProtectedImage(filename?: string) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!filename) return;

    let isMounted = true;

    const load = async () => {
      try {
        const res = await fetch(`${baseUrl}/files/passports/${filename}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Ошибка ");

        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);

        if (isMounted) setUrl(objectUrl);
      } catch (e) {
        console.error("Image load error:", e);
        if (isMounted) setUrl(null);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [filename]);

  return url ?? "/";
}
