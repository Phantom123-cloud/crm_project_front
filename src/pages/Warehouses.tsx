import WarehousesData from "@/components/data/WarehousesData";
import { PlusOutlined } from "@ant-design/icons";
import { useOnModal } from "@/hooks/useOnModal";
import { Button } from "antd";
import RolesGuard from "@/components/layout/RolesGuard";

const Warehouses = () => {
  const { onOpen, onCancel, isOpen } = useOnModal();

  return (
    <>
      <RolesGuard access={"create_warehouses"}>
        <div className="flex justify-end mb-10">
          <Button
            color="green"
            variant="outlined"
            icon={<PlusOutlined />}
            onClick={onOpen}
          >
            Добавить
          </Button>
        </div>{" "}
      </RolesGuard>
      <WarehousesData isOpen={isOpen} onCancel={onCancel} />
    </>
  );
};

export default Warehouses;
