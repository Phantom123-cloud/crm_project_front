import { useEffect, useState } from "react";

export function useProtectedImage(filename?: string) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!filename) return;

    let isMounted = true;

    const load = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/files/passports/${filename}`,
          {
            credentials: "include", // если кука с JWT
            // headers: { Authorization: `Bearer ${token}` }, // если токен
          }
        );

        if (!res.ok) throw new Error("Failed to load image");

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
