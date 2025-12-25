import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TripsData from "@/components/data/TripsData";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import RolesGuard from "@/components/layout/RolesGuard";

const Trips = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isRegisterPage = pathname.includes("create");

  return (
    <RolesGuard access={"view_trips"}>  
      <RolesGuard access={"create_trips"}>
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
      </RolesGuard>
      <Outlet />
      {!isRegisterPage && <TripsData />}
    </RolesGuard>
  );
};

export default Trips;
