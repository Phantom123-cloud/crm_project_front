import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AddButton from "@/components/UI/buttons/AddButton";
import TripsData from "@/components/data/TripsData";
// import RolesGuard from "@/components/layout/RolesGuard";
const Trips = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isRegisterPage = pathname.includes("create");

  return (
    <>
      {/* <RolesGuard access={"register_users"}> */}
      <AddButton
        onClick={() => navigate(isRegisterPage ? "/trips" : "create")}
        text={isRegisterPage ? "Список" : "Добавить"}
        Icon={isRegisterPage ? null : undefined}
        color={isRegisterPage ? "volcano" : undefined}
        variant={isRegisterPage ? "solid" : undefined}
      />
      {/* </RolesGuard> */}
      <Outlet />
      {/* <RolesGuard access={"view_users"}> */}
      {!isRegisterPage && <TripsData />}
      {/* </RolesGuard> */}
    </>
  );
};

export default Trips;
