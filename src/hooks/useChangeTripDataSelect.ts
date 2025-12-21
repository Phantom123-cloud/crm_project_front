import { useState } from "react";

export const useChangeTripDataSelect = () => {
  const initQuery = {
    page: 1,
    limit: 10,
    isActive: true,
  };
  const [query, setQuery] = useState<{
    page: number;
    limit: number;
    isActive?: boolean;
  }>(initQuery);

  const changeSelect = (value: string) => {
    switch (value) {
      case "active":
        setQuery({ ...initQuery, isActive: true });
        break;
      case "no_active":
        setQuery({ ...initQuery, isActive: false });
        break;
      case "all":
        setQuery({ ...initQuery, isActive: undefined });
        break;

      default:
        setQuery(initQuery);
        break;
    }
  };

  return { query, changeSelect, setQuery };
};
