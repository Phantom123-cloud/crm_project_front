export const useDownloadFile = () => {
  const url = import.meta.env.VITE_API_URL;

  const handleDownload = async (filename: string) => {
    const res = await fetch(
      `${url}/files/download/${encodeURIComponent(filename)}`,
      {
        credentials: "include",
        mode: "cors",
      }
    );

    if (!res.ok) {
      return;
    }

    const blob = await res.blob();
    const URL = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = `${url}/files/download/${encodeURIComponent(filename)}`;
    link.target = "_blank";
    link.click();

    window.URL.revokeObjectURL(URL);
  };

  return { handleDownload };
};
