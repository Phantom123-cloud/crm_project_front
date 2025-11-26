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
  useLogoutByUserIdMutation,
  useLogoutMeMutation,
} from "@/app/services/auth/authApi";
import { pageStructure } from "./page-structure";
import { socket } from "@/socket";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { authState } from "@/app/features/authSlice";
import { addData } from "@/app/features/socketSlice";
import { getItem } from "../data/UsersData/get-Item";
const { Header, Sider, Content } = Layout;

type SocketData = {
  offline: number | null;
  online: number | null;
  blocked: number | null;
  userId?: string;
  type?: "logoutById" | "isActive" | undefined;
};

const Main = () => {
  const { handleToggleTheme, isDark, callMessage, isAcces } = useUiContext();

  const [collapsed, setCollapsed] = useState(false);
  const handleCollapse = () => setCollapsed(!collapsed);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
  const [logoutById] = useLogoutByUserIdMutation();
  const dispatch = useAppDispatch();

  const logoutSession = async (id?: string) => {
    try {
      const { message } = id
        ? await logoutById(id).unwrap()
        : await logoutMe().unwrap();
      socket.disconnect();
      callMessage.success(message);
      await triggerMe().unwrap();
    } catch (err) {
      navigate("/login");
    }
  };

  const { meData } = useAppSelector(authState);

  useEffect(() => {
    if (!meData?.id) return;
    let interval: NodeJS.Timeout | null = null;

    if (!socket.connected) {
      socket.connect();
      console.log("connect");

      socket.emit("register", meData?.id);
      console.log("register");

      socket.on(
        "usersSystemStatus",
        ({ offline, online, blocked, userId, type }: SocketData) => {
          dispatch(addData({ offline, online, blocked }));

          if (type && userId && userId === meData?.id) {
            logoutSession(userId);
          }
        }
      );
      console.log("usersSystemStatus");

      interval = setInterval(() => {
        socket.emit("ping", meData?.id);
        console.log("ping");
      }, 60000);
    }

    return () => {
      socket.disconnect();
      socket.off("usersSystemStatus");
      interval && clearInterval(interval);
    };
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
          ©{new Date().getFullYear()} Created by SLP
        </Footer>
      </Layout>
    </Layout>
  );
};
export default Main;
