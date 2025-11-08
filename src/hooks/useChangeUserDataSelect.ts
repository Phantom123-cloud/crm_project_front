import { useState } from "react";

export const useChangeUserDataSelect = (isFullData: boolean) => {
  const initQuery = {
    page: 1,
    limit: 20,
    isOnline: undefined,
    isActive: undefined,
    isFullData,
  };
  const [query, setQuery] = useState<{
    page: number;
    limit: number;
    isFullData: boolean;
    isActive?: boolean;
    isOnline?: boolean;
  }>(initQuery);

  const changeSelect = (value: string) => {
    switch (value) {
      case "online":
        setQuery({ ...initQuery, isOnline: true });
        break;
      case "offline":
        setQuery({ ...initQuery, isOnline: false, isActive: true });
        break;
      case "active":
        setQuery({ ...initQuery, isActive: true });
        break;
      case "no_active":
        setQuery({ ...initQuery, isActive: false });
        break;
      case "all":
        setQuery(initQuery);
        break;

      default:
        setQuery(initQuery);
        break;
    }
  };

  return { query, changeSelect, setQuery };
};
