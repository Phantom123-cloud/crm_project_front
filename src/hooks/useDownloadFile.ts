import { baseUrl } from "@/constants";

export const useDownloadFile = () => {

  const handleDownload = async (filename: string, userId: string) => {
    const ROUTE = `${baseUrl}/files/download/passports?fileName=${encodeURIComponent(
      filename
    )}&userId=${userId}`;
    const res = await fetch(ROUTE, {
      credentials: "include",
      mode: "cors",
    });

    if (!res.ok) {
      return;
    }

    const blob = await res.blob();
    const URL = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = ROUTE;
    link.target = "_blank";
    link.click();
    window.URL.revokeObjectURL(URL);
  };

  return { handleDownload };
};
