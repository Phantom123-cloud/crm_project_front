import { baseUrl } from "@/constants";
import axios from "axios";

export const useDownloadFile = () => {
  const handleDownload = async (filename: string, userId: string) => {
    try {
      const ROUTE = `${baseUrl}/files/download/passports?fileName=${encodeURIComponent(
        filename
      )}&userId=${encodeURIComponent(userId)}`;

      const res = await axios.get(ROUTE, {
        withCredentials: true,
        responseType: "blob",
      });
      const blobUrl = window.URL.createObjectURL(res.data);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Image load error:", e);
    }
  };

  return { handleDownload };
};
