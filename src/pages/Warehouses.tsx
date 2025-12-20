import WarehousesData from "@/components/data/WarehousesData";
import { PlusOutlined } from "@ant-design/icons";
import { useOnModal } from "@/hooks/useOnModal";
import { Button } from "antd";

const Warehouses = () => {
  const { onOpen, onCancel, isOpen } = useOnModal();

  return (
    <>
      <div className="flex justify-end mb-10">
        <Button
          color="green"
          variant="outlined"
          icon={<PlusOutlined />}
          onClick={onOpen}
        >
          Добавить
        </Button>
      </div>
      <WarehousesData isOpen={isOpen} onCancel={onCancel} />
    </>
  );
};

export default Warehouses;
