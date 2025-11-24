import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AddButton from "@/components/UI/buttons/AddButton";
import UsersData from "@/components/data/UsersData/UsersData";
import RolesGuard from "@/components/layout/RolesGuard";

const Users = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isRegisterPage = pathname.includes("register");

  return (
    <>
      <RolesGuard access={"register_users"}>
        <AddButton
          onClick={() => navigate(isRegisterPage ? "/users" : "register")}
          text={isRegisterPage ? "Все аккаунты" : "Добавить"}
          Icon={isRegisterPage ? null : undefined}
          color={isRegisterPage ? "volcano" : undefined}
          variant={isRegisterPage ? "solid" : undefined}
        />
      </RolesGuard>
      <Outlet />
      <RolesGuard access={"view_users"}>
        {!isRegisterPage && <UsersData />}
      </RolesGuard>
    </>
  );
};

export default Users;
