import { useState } from "react";

export const usePaginationState = (
  initPage?: number,
  initLimit?: number
) => {
  const [page, setPage] = useState(initPage ?? 1);
  const [limit, setLimit] = useState(initLimit ?? 10);

  const onChange = (page: number, pageSize: number) => {
    setPage(page);
    setLimit(pageSize);
  };

  return { onChange, page, limit };
};
