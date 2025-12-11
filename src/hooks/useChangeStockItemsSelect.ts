import { useState } from "react";

export const useChangeStockItemsSelect = () => {
  const initQuery = {
    page: 1,
    limit: 20,
    status: undefined,
  };
  const [query, setQuery] = useState<{
    page: number;
    limit: number;
    status?: "TRANSIT" | "RECEIVED" | "CANCELLED" | undefined;
  }>(initQuery);

  const changeSelect = (value: string) => {
    switch (value) {
      case "TRANSIT":
        setQuery({ ...initQuery, status: "TRANSIT" });
        break;
      case "RECEIVED":
        setQuery({ ...initQuery, status: "RECEIVED" });
        break;
      case "CANCELLED":
        setQuery({ ...initQuery, status: "CANCELLED" });
        break;
      case "all":
        setQuery({ ...initQuery, status: undefined });
        break;

      default:
        setQuery(initQuery);
        break;
    }
  };

  return { query, changeSelect, setQuery };
};
