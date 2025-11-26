import type { MenuItem } from "@/types";
import { useNavigate } from "react-router-dom";

export const getItem = (
  label: React.ReactNode,
  key: React.Key,
  path?: string | null,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem => {
  const navigate = useNavigate();

  return {
    key,
    icon,
    children,
    label,
    onClick: () => path && navigate(path),
  } as MenuItem;
};
