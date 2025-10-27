import { useState } from "react";
import {
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
import { pageStructure } from "./page-structure";
import type { MenuItem } from "@/types";
const { Header, Sider, Content } = Layout;

const Main = () => {
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

  const items: MenuItem[] = pageStructure.map(
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

  const { handleToggleTheme, isDark } = useUiContext();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header
          style={{ background: colorBgContainer, padding: 0 }}
          className="flex justify-between"
        >
          <UiButton
            onClick={handleCollapse}
            isBool={collapsed}
            IconTrue={MenuUnfoldOutlined}
            IconFalse={MenuFoldOutlined}
          />
          <UiButton
            onClick={handleToggleTheme}
            isBool={isDark}
            IconTrue={SunOutlined}
            IconFalse={MoonOutlined}
          />
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
