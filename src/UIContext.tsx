import { createContext, useContext, useEffect, useState } from "react";
import { ConfigProvider, message, theme as antTheme } from "antd";
import { authState } from "./app/features/authSlice";
import { useRolesGuard } from "./hooks/useRolesGuard";
import { useAppSelector } from "./app/hooks";

type MessageType = {
  success: (content: string) => void;
  error: (content: string) => void;
  warning: (content: string) => void;
};

type ContextType = {
  handleToggleTheme: () => void;
  callMessage: MessageType;
  isDark: boolean;
  isAcces: (access: string) => boolean;
};

const AntContext = createContext<ContextType | null>(null);

export const AntUIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const callMessage: MessageType = {
    success: (content) => messageApi.open({ type: "success", content }),
    error: (content) => messageApi.open({ type: "error", content }),
    warning: (content) => messageApi.open({ type: "warning", content }),
  };
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const handleToggleTheme = () => setIsDark(!isDark);
  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.body.style.backgroundColor = isDark ? "#141414" : "#f0f0f0";
    document.body.style.color = isDark ? "#f0f0f0" : "#141414";
  }, [isDark]);

  const { roles } = useAppSelector(authState);
  const { isAcces } = useRolesGuard(roles ?? []);

  return (
    <AntContext.Provider
      value={{ callMessage, handleToggleTheme, isDark, isAcces }}
    >
      <ConfigProvider
        theme={{
          algorithm: isDark
            ? antTheme.darkAlgorithm
            : antTheme.defaultAlgorithm,

          token: {
            // colorPrimary: isDark ? "#b78aff" : "#722ed1",
            // colorBgBase: isDark ? "#141414" : "#f0f0f0",
            // colorTextBase: isDark ? "#e0d4ff" : "#3c1f7b",
            // colorLink: isDark ? "#f4c542" : "#d4a017",
            // colorLinkHover: isDark ? "#ffdc73" : "#e6b94c",
            // colorWarning: "#fadb14",
            // colorSuccess: "#52c41a",
            // borderRadius: 8,
          },
        }}
      >
        {contextHolder}
        {children}
      </ConfigProvider>
    </AntContext.Provider>
  );
};

export const useUiContext = () => {
  const ctx = useContext(AntContext);
  if (!ctx) throw new Error("useMessage must be used inside MessageProvider");
  return ctx;
};
