import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AddButton from "@/components/UI/buttons/AddButton";
import UsersData from "@/components/data/UsersData";

const Users = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isRegisterPage = pathname.includes("register");

  return (
    <div>
      <AddButton
        onClick={() => navigate(isRegisterPage ? "/users" : "register")}
        text={isRegisterPage ? "Все аккаунты" : "Добавить"}
        Icon={isRegisterPage ? null : undefined}
        color={isRegisterPage ? "volcano" : undefined}
        variant={isRegisterPage ? "solid" : undefined}
      />
      <Outlet />
      {!isRegisterPage && <UsersData />}
    </div>
  );
};

export default Users;
