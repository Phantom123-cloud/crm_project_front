import { useEffect, useState } from "react";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Footer } from "antd/es/layout/layout";
import { useUiContext } from "@/UIContext";
import UiButton from "../UI/buttons/UiButton";
import { Outlet, useNavigate } from "react-router-dom";
import type { MenuItem } from "@/types";
import {
  useLazyGetMeQuery,
  useLogoutMeMutation,
} from "@/app/services/auth/authApi";
import { useSelector } from "react-redux";
import { authState } from "@/app/features/authSlice";
import { pageStructure } from "./page-structure";
import { useSocketConnection } from "@/hooks/useSocketConnection";
import { socket } from "@/socket";
const { Header, Sider, Content } = Layout;

const Main = () => {
  useSocketConnection();
  const { handleToggleTheme, isDark, callMessage, isAcces } = useUiContext();

  const [collapsed, setCollapsed] = useState(false);
  const handleCollapse = () => setCollapsed(!collapsed);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const changePage = (path: string) => navigate(path);
  const getItem = (
    label: React.ReactNode,
    key: React.Key,
    path?: string | null,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem => {
    return {
      key,
      icon,
      children,
      label,
      onClick: () => path && changePage(path),
    } as MenuItem;
  };

  const navigate = useNavigate();

  const items: MenuItem[] = pageStructure(isAcces).map(
    ({ label, path, Icon, children }, index) => {
      return getItem(
        label,
        index,
        path,
        <Icon />,
        children?.map((item, subIndex) =>
          getItem(item.label, `sub_${index}_${subIndex}`, item.path)
        )
      );
    }
  );

  const [logoutMe] = useLogoutMeMutation();
  const [triggerMe] = useLazyGetMeQuery();

  const logoutSession = async () => {
    try {
      const { message } = await logoutMe().unwrap();
      socket.disconnect();
      callMessage.success(message);
      await triggerMe().unwrap();
    } catch (err) {
      navigate("/login");
    }
  };

  const { meData } = useSelector(authState);

  useEffect(() => {
    const interval = setInterval(() => {
      socket.emit("ping", meData?.id);
      console.log(`online`);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />

        <Menu theme="dark" mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header
          style={{ background: colorBgContainer, padding: `0 10px` }}
          className="flex justify-between items-center"
        >
          <div className="flex items-center">
            <UiButton
              onClick={handleCollapse}
              Icon={collapsed ? MenuUnfoldOutlined : MenuFoldOutlined}
              text={"меню"}
            />
            {/* <span>{meData?.email}</span> */}
          </div>
          <div className="">
            <UiButton
              onClick={handleToggleTheme}
              Icon={isDark ? SunOutlined : MoonOutlined}
              text={"смена темы"}
            />
            <UiButton
              onClick={logoutSession}
              Icon={LogoutOutlined}
              text={"выйти"}
            />
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Main;
