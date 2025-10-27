import type { MenuProps } from "antd";

export type ApiResponse<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
  status?: number;
};

export type MenuItem = Required<MenuProps>["items"][number];
