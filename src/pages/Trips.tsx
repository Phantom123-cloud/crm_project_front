import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TripsData from "@/components/data/TripsData";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const Trips = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isRegisterPage = pathname.includes("create");

  return (
    <>
      <div className="flex justify-end mb-10">
        <Button
          color={isRegisterPage ? "volcano" : "green"}
          variant={isRegisterPage ? "solid" : "outlined"}
          onClick={() => navigate(isRegisterPage ? "/trips" : "create")}
          icon={!isRegisterPage && <PlusOutlined />}
        >
          {isRegisterPage ? "Список" : "Добавить"}
        </Button>
      </div>

      {/* </RolesGuard> */}
      <Outlet />
      {/* <RolesGuard access={"view_users"}> */}
      {!isRegisterPage && <TripsData />}
      {/* </RolesGuard> */}
    </>
  );
};

export default Trips;
