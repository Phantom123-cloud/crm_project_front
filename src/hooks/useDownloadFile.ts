export const useDownloadFile = () => {
  const url = import.meta.env.VITE_API_URL;

  const handleDownload = async (filename: string, userId: string) => {
    const ROUTE = `${url}/files/download?fileName=${encodeURIComponent(
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
