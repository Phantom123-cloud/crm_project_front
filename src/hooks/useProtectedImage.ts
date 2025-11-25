import { baseUrl } from "@/constants";
import { useEffect, useState } from "react";
import axios from "axios";

export function useProtectedImage(filename?: string) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!filename) return;

    const load = async () => {
      try {
        const res = await axios.get(`${baseUrl}/files/passports/${filename}`, {
          withCredentials: true,
          responseType: "blob",
        });
        
        const objectUrl = URL.createObjectURL(res.data);
        setUrl(objectUrl);
      } catch (e) {
        console.error("Image load error:", e);
        setUrl(null);
      }
    };

    load();
  }, [filename]);

  return url ?? "/";
}
