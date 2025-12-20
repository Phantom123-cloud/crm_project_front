import { Outlet, useLocation, useNavigate } from "react-router-dom";
import UsersData from "@/components/data/UsersData/UsersData";
import RolesGuard from "@/components/layout/RolesGuard";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const Users = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isRegisterPage = pathname.includes("register");

  return (
    <>
      <RolesGuard access={"register_users"}>
        <div className="flex justify-end mb-10">
          <Button
            color={isRegisterPage ? "volcano" : "green"}
            variant={isRegisterPage ? "solid" : "outlined"}
            onClick={() => navigate(isRegisterPage ? "/users" : "register")}
            icon={!isRegisterPage && <PlusOutlined />}
          >
            {isRegisterPage ? "Все аккаунты" : "Добавить"}
          </Button>
        </div>
      </RolesGuard>
      <Outlet />
      <RolesGuard access={"view_users"}>
        {!isRegisterPage && <UsersData />}
      </RolesGuard>
    </>
  );
};

export default Users;
