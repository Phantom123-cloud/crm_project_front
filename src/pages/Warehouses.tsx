import WarehousesData from "@/components/data/WarehousesData";
import { DropboxOutlined, PlusOutlined } from "@ant-design/icons";
import { useOnModal } from "@/hooks/useOnModal";
import { Button } from "antd";
import RolesGuard from "@/components/layout/RolesGuard";
import { useNavigate } from "react-router-dom";

const Warehouses = () => {
  const { onOpen, onCancel, isOpen } = useOnModal();
  const navigate = useNavigate();
  const openReportPage = () => navigate("/report-warehouses-remainder");
  return (
    <>
      <div className="flex justify-end mb-10">
        <div className="flex gap-1 items-center">
          <RolesGuard access={"view_report_warehouses"}>
            <Button
              color="gold"
              variant="outlined"
              icon={<DropboxOutlined />}
              onClick={openReportPage}
            >
              Остатки
            </Button>
          </RolesGuard>
          <RolesGuard access={"create_warehouses"}>
            <Button
              color="green"
              variant="outlined"
              icon={<PlusOutlined />}
              onClick={onOpen}
            >
              Добавить
            </Button>
          </RolesGuard>
        </div>
      </div>
      <WarehousesData isOpen={isOpen} onCancel={onCancel} />
    </>
  );
};

export default Warehouses;
