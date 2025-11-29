import { useState } from "react";
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
import { pageStructure } from "./page-structure";
// import { socket } from "@/socket";
// import { useAppSelector } from "@/app/hooks";
// import { authState } from "@/app/features/authSlice";
import { getItem } from "../data/UsersData/get-Item";
const { Header, Sider, Content } = Layout;

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
  // const [logoutById] = useLogoutByUserIdMutation();
  // const dispatch = useAppDispatch();

  const logoutSession = async () => {
    try {
      const { message } = await logoutMe().unwrap();
      // socket.disconnect();
      callMessage.success(message);
      await triggerMe().unwrap();
    } catch (err) {
      navigate("/login");
    }
  };

  // const { meData } = useAppSelector(authState);

  // useEffect(() => {
  //   if (!meData?.id) return;
  //   let interval: NodeJS.Timeout | null = null;

  //   if (!socket.connected) {
  //     socket.connect();
  //     // socket.emit("register", meData?.id);

  //     interval = setInterval(() => {
  //       socket.emit("ping", meData?.id);
  //       console.log('ping');
  //     }, 100_000);
  //   }

  //   return () => {
  //     socket.disconnect();
  //     interval && clearInterval(interval);
  //   };
  // }, []);

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
